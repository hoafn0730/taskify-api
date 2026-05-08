import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Like } from 'typeorm';
import { Board } from '../../entities/board.entity';
import { User } from '../../entities/user.entity';
import { Column as ColumnEntity } from '../../entities/column.entity';
import { Card } from '../../entities/card.entity';
import { Member } from '../../entities/member.entity';
import { Workspace } from '../../entities/workspace.entity';
import { WorkspaceBoard } from '../../entities/workspaceboard.entity';
import { Checklist } from '../../entities/checklist.entity';
import { CheckItem } from '../../entities/checkitem.entity';
import { GeminiProvider } from '../../common/providers/gemini.provider';
import { CloudinaryProvider } from '../../common/providers/cloudinary.provider';
import { MailProvider } from '../mail/mail.provider';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as _ from 'lodash';
import { CreateBoardDto, UpdateBoardDto } from './dto/board.dto';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';

interface GeminiGeneratedData {
    title: string;
    description: string;
    type: string;
    columns: Array<{
        title: string;
        cards: Array<{
            title: string;
            description: string;
            checklists: Array<{
                title: string;
                checkItems: Array<{
                    title: string;
                    status: string;
                }>;
            }>;
        }>;
    }>;
}

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(Board)
        private boardRepository: Repository<Board>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Member)
        private memberRepository: Repository<Member>,
        @InjectRepository(Workspace)
        private workspaceRepository: Repository<Workspace>,
        @InjectRepository(WorkspaceBoard)
        private workspaceBoardRepository: Repository<WorkspaceBoard>,
        @InjectRepository(Card)
        private cardRepository: Repository<Card>,
        @InjectRepository(ColumnEntity)
        private columnRepository: Repository<ColumnEntity>,
        @InjectRepository(Checklist)
        private checklistRepository: Repository<Checklist>,
        @InjectRepository(CheckItem)
        private checkItemRepository: Repository<CheckItem>,
        private dataSource: DataSource,
        private geminiProvider: GeminiProvider,
        private cloudinaryProvider: CloudinaryProvider,
        private mailProvider: MailProvider,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async findAll(userId: number, page: number = 1, pageSize: number = 10, sortBy: string = 'latest') {
        const workspace = await this.workspaceRepository.findOne({ where: { userId } });
        if (!workspace) {
            return { data: [], meta: { total: 0, page, pageSize } };
        }

        const boards = await this.boardRepository.find({
            relations: ['workspaceBoards', 'members', 'members.user'],
        });

        const transformedBoards = boards
            .map((board) => {
                const workspaceBoard = board.workspaceBoards.find((wb) => wb.workspaceId === workspace.id);
                const starred = !!workspaceBoard?.starred;
                const lastView = workspaceBoard?.lastView || board.createdAt;

                return {
                    ...board,
                    starred,
                    lastView,
                    members: board.members.map((m) => ({
                        ...m.user,
                        role: m.role,
                        active: m.active,
                    })),
                };
            })
            .sort((a, b) => {
                const starredDiff = Number(b.starred) - Number(a.starred);
                if (starredDiff !== 0) return starredDiff;
                return sortBy === 'latest'
                    ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            });

        const offset = (page - 1) * pageSize;
        return {
            data: transformedBoards.slice(offset, offset + pageSize),
            meta: {
                total: transformedBoards.length,
                page,
                pageSize,
            },
        };
    }

    async search(query: string, page: number = 1, pageSize: number = 10) {
        const [data, total] = await this.boardRepository.findAndCount({
            where: { title: Like(`${query}%`) },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        return {
            data,
            meta: { total, page, pageSize },
        };
    }

    async getBoardBySlug(slug: string, userId: number) {
        const board = await this.boardRepository.findOne({
            where: { slug },
            relations: ['columns'],
        });

        if (!board) {
            throw new NotFoundException('Board not found');
        }

        const workspace = await this.workspaceRepository.findOne({ where: { userId } });
        if (workspace) {
            await this.workspaceBoardRepository.upsert(
                {
                    boardId: board.id,
                    workspaceId: workspace.id,
                    lastView: new Date(),
                },
                ['workspaceId', 'boardId'],
            );
        }

        const members = await this.memberRepository.find({
            where: { objectId: board.id, objectType: 'board' },
            relations: ['user'],
        });

        const cards = await this.cardRepository.find({
            where: { boardId: board.id },
        });

        const columnIdToUUIDMap = Object.fromEntries(board.columns.map((col) => [col.id, col.uuid])) as Record<number, string>;
        const cardsByColumnUUID = _.groupBy(cards, (card) => columnIdToUUIDMap[card.columnId]);

        const tasks: Record<string, Card[]> = {};
        for (const col of board.columns) {
            tasks[col.uuid] = cardsByColumnUUID[col.uuid] || [];
        }

        return {
            ...board,
            tasks,
            members: members.map((m) => ({
                ...m.user,
                role: m.role,
                active: m.active,
            })),
        };
    }

    async store(data: CreateBoardDto & { userId: number; members?: number[] }) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const workspace = await queryRunner.manager.findOne(Workspace, {
                where: { userId: data.userId },
            });

            if (!workspace) {
                throw new NotFoundException('Workspace not found');
            }

            const board = queryRunner.manager.create(Board, {
                title: data.title,
                slug: slugify(data.title, { lower: true }),
                description: data.description || '',
                type: data.type || 'kanban',
                image: data.image || '',
                columnOrderIds: [],
            });

            const savedBoard = await queryRunner.manager.save(board);

            const memberData = [
                {
                    userId: data.userId,
                    role: 'owner',
                    objectId: savedBoard.id,
                    objectType: 'board',
                    active: true,
                },
                ...(data.members || [])
                    .filter((id: number) => id !== data.userId)
                    .map((userId: number) => ({
                        userId,
                        role: 'member',
                        objectId: savedBoard.id,
                        objectType: 'board',
                        active: true,
                    })),
            ];

            await queryRunner.manager.insert(Member, memberData);

            await queryRunner.manager.save(WorkspaceBoard, {
                workspaceId: workspace.id,
                boardId: savedBoard.id,
                starred: false,
                lastView: new Date(),
            });

            await queryRunner.commitTransaction();
            return savedBoard;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async update(id: number, data: UpdateBoardDto) {
        const updateData: Partial<Board> = { ...data };
        if (data.title) {
            updateData.slug = slugify(data.title, { lower: true });
        }
        await this.boardRepository.update(id, updateData);
        return this.boardRepository.findOne({ where: { id } });
    }

    async destroy(id: number) {
        return this.boardRepository.softDelete(id);
    }

    async generate(content: string, userId: number) {
        const data = (await this.geminiProvider.googleAIGenerate(content)) as GeminiGeneratedData;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const slug = slugify(data.title, { lower: true });
            let board = await queryRunner.manager.findOne(Board, { where: { slug } });
            if (board) {
                throw new BadRequestException('Board with this title already exists!');
            }

            board = queryRunner.manager.create(Board, {
                title: data.title,
                slug,
                description: data.description,
                type: data.type || 'kanban',
                columnOrderIds: [],
            });
            board = await queryRunner.manager.save(board);

            const columns: ColumnEntity[] = [];
            for (const colData of data.columns) {
                const column = queryRunner.manager.create(ColumnEntity, {
                    title: colData.title,
                    boardId: board.id,
                    uuid: uuidv4(),
                    cardOrderIds: [],
                });
                columns.push(await queryRunner.manager.save(column));
            }

            board.columnOrderIds = columns.map((c) => c.uuid);
            await queryRunner.manager.save(board);

            for (let i = 0; i < columns.length; i++) {
                const colData = data.columns[i];
                const column = columns[i];
                const cards: Card[] = [];
                for (const cardData of colData.cards) {
                    const card = queryRunner.manager.create(Card, {
                        title: cardData.title,
                        description: cardData.description,
                        boardId: board.id,
                        columnId: column.id,
                        uuid: uuidv4(),
                    });
                    const savedCard = await queryRunner.manager.save(card);
                    cards.push(savedCard);

                    if (cardData.checklists) {
                        for (const clData of cardData.checklists) {
                            const checklist = queryRunner.manager.create(Checklist, {
                                cardId: savedCard.id,
                                title: clData.title,
                            });
                            const savedChecklist = await queryRunner.manager.save(checklist);
                            for (const ciData of clData.checkItems) {
                                const checkItem = queryRunner.manager.create(CheckItem, {
                                    checklistId: savedChecklist.id,
                                    cardId: savedCard.id,
                                    title: ciData.title,
                                    status: ciData.status === 'complete',
                                });
                                await queryRunner.manager.save(checkItem);
                            }
                        }
                    }
                }
                column.cardOrderIds = cards.map((c) => c.uuid);
                await queryRunner.manager.save(column);
            }

            await queryRunner.commitTransaction();
            return board;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async updateBackground(boardId: number, file: any) {
        const board = await this.boardRepository.findOne({ where: { id: boardId } });
        if (!board) throw new NotFoundException('Board not found');

        const result = await this.cloudinaryProvider.uploadFile(file);
        if (board.image) {
            const publicId = this.cloudinaryProvider.extractPublicId(board.image);
            if (publicId) await this.cloudinaryProvider.deleteFile(publicId);
        }

        await this.boardRepository.update(boardId, { image: result.secure_url });
        return this.boardRepository.findOne({ where: { id: boardId } });
    }

    async toggleStarBoard(boardId: number, userId: number) {
        const workspace = await this.workspaceRepository.findOne({ where: { userId } });
        if (!workspace) throw new NotFoundException('Workspace not found');

        const wb = await this.workspaceBoardRepository.findOne({
            where: { boardId, workspaceId: workspace.id },
        });

        if (!wb) throw new NotFoundException('Board not linked to this workspace');

        wb.starred = !wb.starred;
        await this.workspaceBoardRepository.save(wb);

        return { starred: wb.starred };
    }

    async invite(boardId: number, inviteEmail: string) {
        const board = await this.boardRepository.findOne({ where: { id: boardId } });
        if (!board) throw new NotFoundException('Board not found');

        const user = await this.userRepository.findOne({ where: { email: inviteEmail } });
        if (!user) throw new NotFoundException('User with this email does not exist');

        const member = await this.memberRepository.findOne({
            where: { userId: user.id, objectId: boardId, objectType: 'board' },
        });

        if (member) {
            if (member.active) throw new BadRequestException('User is already a member of this board');
            return { status: 'pending' };
        }

        const token = this.jwtService.sign({ boardId, userId: user.id }, { expiresIn: '2d' });
        const websiteDomain = this.configService.get<string>('WEBSITE_DOMAIN');
        const inviteLink = `${websiteDomain}/dashboard/kanban/accept-invite?token=${token}`;

        await this.mailProvider.sendEmail({
            email: user.email,
            subject: `You've been invited to the board: ${board.title}`,
            htmlContent: `
                <h3>Hello ${user.displayName || user.email},</h3>
                <p>You have been invited to join the board <strong>${board.title}</strong>.</p>
                <p>Click the link below to accept the invitation:</p>
                <a href="${inviteLink}" target="_blank" style="display:inline-block;padding:10px 20px;background-color:#007bff;color:#fff;text-decoration:none;border-radius:5px;">Accept Invitation</a>
                <p>This link will expire in 2 days.</p>
            `,
        });

        await this.memberRepository.insert({
            userId: user.id,
            objectId: boardId,
            objectType: 'board',
            active: false,
        });

        return { status: 'pending' };
    }

    async acceptInvite(token: string) {
        const payload = this.jwtService.verify(token);
        const { boardId, userId } = payload;

        const member = await this.memberRepository.findOne({
            where: { userId, objectId: boardId, objectType: 'board' },
        });

        if (!member) throw new NotFoundException('Invitation not found');
        if (member.active) throw new BadRequestException('Already joined this board');

        member.active = true;
        await this.memberRepository.save(member);

        return this.boardRepository.findOne({ where: { id: boardId } });
    }
}

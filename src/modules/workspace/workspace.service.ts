import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { Workspace } from '../../entities/workspace.entity';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from './dto/workspace.dto';

@Injectable()
export class WorkspaceService {
    constructor(
        @InjectRepository(Workspace)
        private workspaceRepository: Repository<Workspace>,
    ) {}

    async getWorkspaceWithBoards(userId: number) {
        const workspace = await this.workspaceRepository.findOne({
            where: { userId },
            relations: ['workspaceBoards', 'workspaceBoards.board'],
        });

        if (!workspace) return null;

        return {
            ...workspace,
            boards: workspace.workspaceBoards.map((wb) => wb.board),
            boardStars: workspace.workspaceBoards.filter((wb) => wb.starred).map((wb) => wb.board),
        };
    }

    async getOne(options: FindOneOptions<Workspace>) {
        return this.workspaceRepository.findOne(options);
    }

    async store(data: CreateWorkspaceDto & { userId: number }) {
        const workspace = this.workspaceRepository.create(data);
        return this.workspaceRepository.save(workspace);
    }

    async update(id: number, data: UpdateWorkspaceDto) {
        await this.workspaceRepository.update(id, data);
        return this.workspaceRepository.findOne({ where: { id } });
    }

    async destroy(id: number) {
        return this.workspaceRepository.delete(id);
    }
}

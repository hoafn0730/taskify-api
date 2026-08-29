import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../../entities/member.entity';
import { BaseService } from '../../common/base.service';

@Injectable()
export class MemberService extends BaseService<Member> {
    constructor(
        @InjectRepository(Member)
        private memberRepository: Repository<Member>,
    ) {
        super(memberRepository);
    }

    async findByObject(objectId: number, objectType: string, page: number = 1, pageSize: number = 10) {
        const [data, total] = await this.memberRepository.findAndCount({
            where: { objectId, objectType },
            relations: ['user'],
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        const transformedData = data.map((member) => ({
            id: member.id,
            objectId: member.objectId,
            objectType: member.objectType,
            userId: member.userId,
            role: member.role,
            active: member.active,
            email: member.user?.email,
            username: member.user?.username,
            displayName: member.user?.displayName,
            avatar: member.user?.avatar,
            createdAt: member.createdAt,
        }));

        return {
            data: transformedData,
            meta: {
                total,
                page,
                pageSize,
            },
        };
    }

    async updateMember(userId: number, objectId: number, objectType: string, data: Partial<Member>) {
        await this.memberRepository.update({ userId, objectId, objectType }, data);
    }
}

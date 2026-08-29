import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../../entities/team.entity';
import { BaseService } from '../../common/base.service';

@Injectable()
export class TeamService extends BaseService<Team> {
    constructor(
        @InjectRepository(Team)
        private teamRepository: Repository<Team>,
    ) {
        super(teamRepository);
    }
}

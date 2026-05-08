import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../../entities/event.entity';
import { BaseService } from '../../common/base.service';

@Injectable()
export class CalendarService extends BaseService<Event> {
    constructor(
        @InjectRepository(Event)
        private eventRepository: Repository<Event>,
    ) {
        super(eventRepository);
    }
}

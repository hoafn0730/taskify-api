import { Repository, FindManyOptions, FindOneOptions, DeepPartial } from 'typeorm';
import { BaseEntity } from '../entities/base.entity';

export class BaseService<T extends BaseEntity> {
    constructor(protected readonly repository: Repository<T>) {}

    async findAll(options?: FindManyOptions<T>) {
        const [data, total] = await this.repository.findAndCount(options);
        return {
            data,
            meta: {
                total,
                page: options?.skip ? Math.floor(options.skip / (options.take || 10)) + 1 : 1,
                pageSize: options?.take || 10,
            },
        };
    }

    async findOne(options: FindOneOptions<T>): Promise<T | null> {
        return this.repository.findOne(options);
    }

    async findById(id: number): Promise<T | null> {
        return this.repository.findOne({ where: { id } } as FindOneOptions<T>);
    }

    async create(data: DeepPartial<T>): Promise<T> {
        const entity = this.repository.create(data);
        return this.repository.save(entity);
    }

    async update(id: number, data: DeepPartial<T>): Promise<T | null> {
        await this.repository.update(id, data as any);
        return this.findById(id);
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }

    async softDelete(id: number): Promise<void> {
        await this.repository.softDelete(id);
    }
}

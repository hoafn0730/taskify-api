import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { Workspace } from '../../entities/workspace.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Workspace])],
    providers: [WorkspaceService],
    controllers: [WorkspaceController],
    exports: [WorkspaceService],
})
export class WorkspaceModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageEngagementStat, Visitor, VisitorEvent, VisitorSession } from '../entities';
import { EngagementController } from './engagement.controller';
import { EngagementService } from './engagement.service';

@Module({
  imports: [TypeOrmModule.forFeature([Visitor, VisitorSession, VisitorEvent, PageEngagementStat])],
  controllers: [EngagementController],
  providers: [EngagementService],
  exports: [EngagementService],
})
export class EngagementModule {}

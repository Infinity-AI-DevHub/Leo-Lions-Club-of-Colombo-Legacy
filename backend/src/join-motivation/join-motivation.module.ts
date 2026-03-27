import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JoinMotivationController } from './join-motivation.controller';
import { JoinMotivationService } from './join-motivation.service';
import {
  MotivationEvent,
  MotivationPageStat,
  MotivationSession,
  MotivationVisitor,
} from './join-motivation.entities';

@Module({
  imports: [TypeOrmModule.forFeature([MotivationVisitor, MotivationSession, MotivationEvent, MotivationPageStat])],
  controllers: [JoinMotivationController],
  providers: [JoinMotivationService],
  exports: [JoinMotivationService],
})
export class JoinMotivationModule {}

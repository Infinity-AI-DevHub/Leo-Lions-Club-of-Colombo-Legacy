import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  BlogPost,
  ContentComment,
  ContentReaction,
  ContentShare,
  Event,
  GalleryAlbum,
  Notice,
  Poll,
  Project,
} from '../entities';
import { InteractionsController } from './interactions.controller';
import { InteractionsService } from './interactions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ContentReaction,
      ContentComment,
      ContentShare,
      Project,
      Event,
      GalleryAlbum,
      BlogPost,
      Poll,
      Notice,
    ]),
  ],
  controllers: [InteractionsController],
  providers: [InteractionsService],
  exports: [InteractionsService],
})
export class InteractionsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AboutContent,
  BlogCategory,
  BlogPost,
  ContactInfo,
  ContactLead,
  Event,
  GalleryAlbum,
  GalleryImage,
  HomepageContent,
  LeadershipMember,
  MembershipContent,
  Notice,
  Poll,
  PollVote,
  Project,
  SiteSettings,
  SocialLink,
} from '../entities';
import { CmsController } from './cms.controller';
import { CmsService } from './cms.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SiteSettings,
      HomepageContent,
      AboutContent,
      LeadershipMember,
      Project,
      Event,
      GalleryAlbum,
      GalleryImage,
      MembershipContent,
      Poll,
      PollVote,
      Notice,
      BlogCategory,
      BlogPost,
      ContactInfo,
      ContactLead,
      SocialLink,
    ]),
  ],
  controllers: [CmsController],
  providers: [CmsService],
  exports: [CmsService],
})
export class CmsModule {}

import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import {
  AboutContent,
  AdminUser,
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
  PageEngagementStat,
  Poll,
  PollVote,
  Project,
  SiteSettings,
  SocialLink,
  Visitor,
  VisitorEvent,
  VisitorSession,
  ContentReaction,
  ContentComment,
  ContentShare,
} from './entities';
import { AuthModule } from './auth/auth.module';
import { CmsModule } from './cms/cms.module';
import { UploadModule } from './upload/upload.module';
import { EngagementModule } from './engagement/engagement.module';
import { InteractionsModule } from './interactions/interactions.module';
import {
  MotivationEvent,
  MotivationPageStat,
  MotivationSession,
  MotivationVisitor,
} from './join-motivation/join-motivation.entities';
import { JoinMotivationModule } from './join-motivation/join-motivation.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'leo_lions_legacy',
      password: 'DAms12/()=',
      database: 'leo_lions_legacy',
      entities: [
        AdminUser,
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
        Visitor,
        VisitorSession,
        VisitorEvent,
        PageEngagementStat,
        ContentReaction,
        ContentComment,
        ContentShare,
        MotivationVisitor,
        MotivationSession,
        MotivationEvent,
        MotivationPageStat,
      ],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    CmsModule,
    UploadModule,
    EngagementModule,
    InteractionsModule,
    JoinMotivationModule,
  ],
})
export class AppModule {}

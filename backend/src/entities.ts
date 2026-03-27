import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('admin_users')
export class AdminUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  fullName: string;

  @Column()
  passwordHash: string;

  @Column({ default: 'SUPER_ADMIN' })
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('site_settings')
export class SiteSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  organizationName: string;

  @Column()
  theme: string;

  @Column({ default: '#0F4C81' })
  primaryColor: string;

  @Column({ default: '#1F7DBA' })
  secondaryColor: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ nullable: true })
  faviconUrl: string;

  @Column({ nullable: true, type: 'text' })
  footerCopyright: string;

  @Column({ nullable: true, type: 'text' })
  defaultSeoTitle: string;

  @Column({ nullable: true, type: 'text' })
  defaultSeoDescription: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('homepage_contents')
export class HomepageContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  heroTitle: string;

  @Column({ type: 'text' })
  heroSubtitle: string;

  @Column({ nullable: true })
  heroBackgroundImage: string;

  @Column({ type: 'text', nullable: true })
  ctaPrimaryLabel: string;

  @Column({ type: 'text', nullable: true })
  ctaPrimaryLink: string;

  @Column({ type: 'text', nullable: true })
  ctaSecondaryLabel: string;

  @Column({ type: 'text', nullable: true })
  ctaSecondaryLink: string;

  @Column({ type: 'text', nullable: true })
  ctaThirdLabel: string;

  @Column({ type: 'text', nullable: true })
  ctaThirdLink: string;

  @Column({ type: 'json', nullable: true })
  impactStats: Array<{ label: string; value: string }>;

  @Column({ type: 'json', nullable: true })
  highlightedSections: Array<{ title: string; description: string }>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('about_contents')
export class AboutContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  introduction: string;

  @Column({ type: 'text' })
  vision: string;

  @Column({ type: 'text' })
  mission: string;

  @Column({ type: 'json', nullable: true })
  coreValues: string[];

  @Column({ type: 'text', nullable: true })
  presidentsMessage: string;

  @Column({ nullable: true })
  presidentsImage: string;

  @Column({ nullable: true })
  bannerImage: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('leadership_members')
export class LeadershipMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  roleTitle: string;

  @Column({ nullable: true })
  photoUrl: string;

  @Column({ type: 'text' })
  shortBio: string;

  @Column({ default: 'EXECUTIVE_COMMITTEE' })
  committeeType: 'EXECUTIVE_COMMITTEE' | 'BOARD_MEMBER';

  @Column({ default: 0 })
  displayOrder: number;

  @Column({ type: 'json', nullable: true })
  socialLinks: Array<{ label: string; url: string }>;

  @Column({ default: true })
  isPublished: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  category: string;

  @Column({ type: 'date', nullable: true })
  date: string | null;

  @Column({ nullable: true })
  coverImage: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  objectives: string;

  @Column({ type: 'text', nullable: true })
  outcomes: string;

  @Column({ type: 'json', nullable: true })
  galleryImages: string[];

  @Column({ default: 'DRAFT' })
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'datetime', nullable: true })
  eventDateTime: Date | null;

  @Column({ type: 'datetime', nullable: true })
  endDateTime: Date | null;

  @Column()
  venue: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'longtext', nullable: true })
  detailedDescription: string;

  @Column({ nullable: true })
  posterUrl: string;

  @Column({ type: 'json', nullable: true })
  galleryImages: string[];

  @Column({ type: 'text', nullable: true })
  participantsInfo: string;

  @Column({ type: 'text', nullable: true })
  organizer: string;

  @Column({ type: 'text', nullable: true })
  contactInfo: string;

  @Column({ nullable: true })
  registrationLink: string;

  @Column({ default: 'UPCOMING' })
  eventStatus: 'UPCOMING' | 'PAST';

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: 'DRAFT' })
  publishStatus: 'DRAFT' | 'PUBLISHED';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('gallery_albums')
export class GalleryAlbum {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  referenceType: string;

  @Column({ nullable: true })
  referenceId: string;

  @Column({ default: true })
  isPublished: boolean;

  @OneToMany(() => GalleryImage, (image) => image.album, { cascade: true })
  images: GalleryImage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('gallery_images')
export class GalleryImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageUrl: string;

  @Column({ nullable: true })
  caption: string;

  @ManyToOne(() => GalleryAlbum, (album) => album.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'albumId' })
  album: GalleryAlbum;

  @Column()
  albumId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('membership_contents')
export class MembershipContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  introText: string;

  @Column({ type: 'json', nullable: true })
  whyJoinPoints: string[];

  @Column({ type: 'json', nullable: true })
  benefits: string[];

  @Column({ type: 'text', nullable: true })
  eligibility: string;

  @Column({ nullable: true })
  joinFormLink: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('blog_categories')
export class BlogCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('blog_posts')
export class BlogPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  featuredImage: string;

  @Column({ nullable: true })
  magazinePdfUrl: string;

  @Column()
  author: string;

  @Column({ type: 'date', nullable: true })
  publishDate: string | null;

  @Column({ type: 'longtext' })
  content: string;

  @ManyToOne(() => BlogCategory, { nullable: true, eager: true })
  @JoinColumn({ name: 'categoryId' })
  category: BlogCategory;

  @Column({ nullable: true })
  categoryId: number;

  @Column({ nullable: true })
  seoTitle: string;

  @Column({ nullable: true })
  seoDescription: string;

  @Column({ default: 'DRAFT' })
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('polls')
export class Poll {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  options: string[];

  @Column({ nullable: true })
  thumbnailImage: string;

  @Column({ nullable: true })
  externalLink: string;

  @Column({ default: 'DRAFT' })
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('poll_votes')
@Index(['pollId', 'visitorToken'], { unique: true })
export class PollVote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pollId: number;

  @Column({ length: 120 })
  visitorToken: string;

  @Column()
  optionIndex: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('notices')
export class Notice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ type: 'longtext', nullable: true })
  content: string;

  @Column({ type: 'date', nullable: true })
  noticeDate: string | null;

  @Column({ nullable: true })
  thumbnailImage: string;

  @Column({ nullable: true })
  externalLink: string;

  @Column({ default: 'DRAFT' })
  status: 'DRAFT' | 'PUBLISHED';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('contact_infos')
export class ContactInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column({ type: 'text', nullable: true })
  googleMapsEmbed: string;

  @Column({ nullable: true })
  contactFormRecipientEmail: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('contact_leads')
export class ContactLead {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  subject: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: 'NEW' })
  status: 'NEW' | 'REVIEWED' | 'CONTACTED' | 'CLOSED';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('social_links')
export class SocialLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  platform: string;

  @Column()
  url: string;

  @Column({ default: true })
  isVisible: boolean;

  @Column({ default: 0 })
  displayOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('visitors')
export class Visitor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  visitorToken: string;

  @Column({ type: 'datetime' })
  firstSeenAt: Date;

  @Column({ type: 'datetime' })
  lastSeenAt: Date;

  @Column({ default: 0 })
  totalSessions: number;

  @Column({ default: 0 })
  totalScore: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('visitor_sessions')
export class VisitorSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Visitor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'visitorId' })
  visitor: Visitor;

  @Column()
  visitorId: number;

  @Column({ unique: true })
  sessionToken: string;

  @Column({ type: 'datetime' })
  startedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  endedAt: Date | null;

  @Column({ default: 0 })
  durationSeconds: number;

  @Column({ default: 0 })
  totalScore: number;

  @Column({ default: 0 })
  pagesVisitedCount: number;

  @Column({ default: 0 })
  actionsCount: number;

  @Column({ nullable: true, type: 'text' })
  referrer: string;

  @Column({ nullable: true, type: 'text' })
  deviceType: string;

  @Column({ nullable: true, type: 'text' })
  browserInfo: string;

  @Column({ type: 'datetime', nullable: true })
  lastActivityAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('visitor_events')
export class VisitorEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Visitor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'visitorId' })
  visitor: Visitor;

  @Column()
  visitorId: number;

  @ManyToOne(() => VisitorSession, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sessionId' })
  session: VisitorSession;

  @Column()
  sessionId: number;

  @Column({ type: 'text', nullable: true })
  pagePath: string;

  @Column()
  eventType: string;

  @Column({ type: 'text', nullable: true })
  eventLabel: string;

  @Column({ default: 0 })
  pointsAwarded: number;

  @Column({ type: 'json', nullable: true })
  metadataJson: Record<string, unknown> | null;

  @Column({ type: 'datetime' })
  occurredAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('page_engagement_stats')
export class PageEngagementStat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  pagePath: string;

  @Column({ default: 0 })
  totalViews: number;

  @Column({ default: 0 })
  totalTimeSpent: number;

  @Column({ default: 0 })
  totalScoreGenerated: number;

  @Column({ default: 0 })
  totalCtaClicks: number;

  @Column({ default: 0 })
  totalSubmissions: number;

  @Column({ type: 'datetime', nullable: true })
  updatedAt: Date;
}

@Entity('content_reactions')
@Index(['targetType', 'targetId', 'visitorToken'], { unique: true })
export class ContentReaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40 })
  targetType: 'PROJECT' | 'EVENT' | 'GALLERY_ALBUM' | 'MAGAZINE' | 'POLL' | 'NOTICE';

  @Column()
  targetId: number;

  @Column({ length: 120 })
  visitorToken: string;

  @Column({ length: 12 })
  reactionType: 'LIKE' | 'DISLIKE';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('content_comments')
export class ContentComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40 })
  targetType: 'PROJECT' | 'EVENT' | 'GALLERY_ALBUM' | 'MAGAZINE' | 'POLL' | 'NOTICE';

  @Column()
  targetId: number;

  @Column({ length: 120 })
  visitorToken: string;

  @Column({ length: 120, default: 'Guest' })
  authorName: string;

  @Column({ type: 'text' })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('content_shares')
export class ContentShare {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40 })
  targetType: 'PROJECT' | 'EVENT' | 'GALLERY_ALBUM' | 'MAGAZINE' | 'POLL' | 'NOTICE';

  @Column()
  targetId: number;

  @Column({ length: 120 })
  visitorToken: string;

  @CreateDateColumn()
  createdAt: Date;
}

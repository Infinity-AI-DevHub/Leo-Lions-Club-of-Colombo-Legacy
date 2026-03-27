import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('motivation_visitors')
export class MotivationVisitor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 120 })
  visitorToken: string;

  @Column({ type: 'datetime' })
  firstSeenAt: Date;

  @Column({ type: 'datetime' })
  lastSeenAt: Date;

  @Column({ default: 0 })
  totalSessions: number;

  @Column({ default: 0 })
  lifetimeMotivationScore: number;

  @Column({ default: 0 })
  highestMotivationScore: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('motivation_sessions')
export class MotivationSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MotivationVisitor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'visitorId' })
  visitor: MotivationVisitor;

  @Column()
  visitorId: number;

  @Column({ unique: true, length: 120 })
  sessionToken: string;

  @Column({ type: 'datetime' })
  startedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  endedAt: Date | null;

  @Column({ default: 0 })
  durationSeconds: number;

  @Column({ default: 0 })
  totalMotivationScore: number;

  @Column({ default: 'Curious Visitor', length: 64 })
  motivationLevel: string;

  @Column({ default: 0 })
  pagesVisitedCount: number;

  @Column({ default: 0 })
  actionsCount: number;

  @Column({ default: 0 })
  joinCtaClicks: number;

  @Column({ default: false })
  joinPageVisited: boolean;

  @Column({ default: false })
  joinFormStarted: boolean;

  @Column({ default: false })
  joinFormSubmitted: boolean;

  @Column({ type: 'text', nullable: true })
  referrer: string;

  @Column({ type: 'text', nullable: true })
  deviceType: string;

  @Column({ type: 'text', nullable: true })
  browserInfo: string;

  @Column({ type: 'datetime', nullable: true })
  lastActivityAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('motivation_events')
export class MotivationEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MotivationVisitor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'visitorId' })
  visitor: MotivationVisitor;

  @Column()
  visitorId: number;

  @ManyToOne(() => MotivationSession, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sessionId' })
  session: MotivationSession;

  @Column()
  sessionId: number;

  @Column({ type: 'text', nullable: true })
  pagePath: string;

  @Column({ length: 80 })
  eventType: string;

  @Column({ type: 'text', nullable: true })
  eventLabel: string;

  @Column({ default: 0 })
  pointsAwarded: number;

  @Column({ default: 'Curious Visitor', length: 64 })
  motivationLevelAfter: string;

  @Column({ type: 'json', nullable: true })
  metadataJson: Record<string, unknown> | null;

  @Column({ type: 'datetime' })
  occurredAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('motivation_page_stats')
export class MotivationPageStat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 200 })
  pagePath: string;

  @Column({ default: 0 })
  totalVisits: number;

  @Column({ default: 0 })
  totalScoreGenerated: number;

  @Column({ type: 'float', default: 0 })
  avgScoreGenerated: number;

  @Column({ default: 0 })
  totalJoinCtaClicks: number;

  @Column({ default: 0 })
  totalJoinFormStarts: number;

  @Column({ default: 0 })
  totalJoinFormSubmissions: number;

  @Column({ default: 0 })
  totalTimeSpent: number;

  @Column({ type: 'datetime', nullable: true })
  updatedAt: Date | null;
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  MotivationEndSessionDto,
  MotivationStartSessionDto,
  MotivationTrackEventDto,
  MotivationAdminSessionsQueryDto,
} from './join-motivation.dto';
import {
  MotivationEvent,
  MotivationPageStat,
  MotivationSession,
  MotivationVisitor,
} from './join-motivation.entities';

type MotivationLevel =
  | 'Curious Visitor'
  | 'Interested Explorer'
  | 'Inspired Supporter'
  | 'Future Changemaker'
  | 'Future Leo'
  | 'Ready to Join';

const SCORE_RULES: Record<string, number> = {
  page_time_30s: 8,
  page_time_60s: 12,
  scroll_50: 5,
  scroll_80: 8,
  leadership_view: 10,
  project_view: 10,
  event_view: 10,
  gallery_open: 6,
  join_page_view: 20,
  join_cta_click: 20,
  learn_more_click: 10,
  join_form_start: 25,
  join_form_submit: 50,
  contact_submit: 20,
  return_visit: 15,
  first_visit: 5,
};

const PATH_VIEW_RULES: Array<{ pattern: RegExp; points: number }> = [
  { pattern: /^\/about(\/|$)/, points: 8 },
  { pattern: /^\/leadership(\/|$)/, points: 10 },
  { pattern: /^\/projects(\/|$)/, points: 12 },
  { pattern: /^\/events(\/|$)/, points: 10 },
  { pattern: /^\/membership(\/|$)/, points: 20 },
  { pattern: /^\/contact(\/|$)/, points: 8 },
];

const STRONG_MILESTONES = new Set([
  'page_time_30s',
  'page_time_60s',
  'scroll_50',
  'scroll_80',
  'leadership_view',
  'project_view',
  'event_view',
  'gallery_open',
  'join_page_view',
  'join_form_start',
  'join_form_submit',
  'contact_submit',
  'return_visit',
  'first_visit',
]);

@Injectable()
export class JoinMotivationService {
  constructor(
    @InjectRepository(MotivationVisitor)
    private readonly visitorRepo: Repository<MotivationVisitor>,
    @InjectRepository(MotivationSession)
    private readonly sessionRepo: Repository<MotivationSession>,
    @InjectRepository(MotivationEvent)
    private readonly eventRepo: Repository<MotivationEvent>,
    @InjectRepository(MotivationPageStat)
    private readonly pageStatRepo: Repository<MotivationPageStat>,
  ) {}

  private now() {
    return new Date();
  }

  private dayKey(date: Date) {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }

  private normalizePath(path?: string) {
    const raw = String(path || '/').trim();
    if (!raw) return '/';
    return raw.startsWith('/') ? raw : `/${raw}`;
  }

  private levelFor(score: number): MotivationLevel {
    if (score >= 100) return 'Ready to Join';
    if (score >= 80) return 'Future Leo';
    if (score >= 60) return 'Future Changemaker';
    if (score >= 40) return 'Inspired Supporter';
    if (score >= 20) return 'Interested Explorer';
    return 'Curious Visitor';
  }

  private scoreForPageView(path: string) {
    for (const rule of PATH_VIEW_RULES) {
      if (rule.pattern.test(path)) return rule.points;
    }
    return 2;
  }

  private toDateOrNull(value?: string) {
    if (!value) return null;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  private async getOrCreateVisitor(visitorToken: string) {
    let visitor = await this.visitorRepo.findOne({ where: { visitorToken } });
    const now = this.now();
    if (!visitor) {
      visitor = await this.visitorRepo.save(
        this.visitorRepo.create({
          visitorToken,
          firstSeenAt: now,
          lastSeenAt: now,
          totalSessions: 0,
          lifetimeMotivationScore: 0,
          highestMotivationScore: 0,
        }),
      );
    }
    return visitor;
  }

  private async isRapidDuplicate(
    sessionId: number,
    eventType: string,
    pagePath: string,
    eventLabel: string,
    cooldownMs = 6000,
  ) {
    const last = await this.eventRepo.findOne({
      where: { sessionId, eventType, pagePath, eventLabel },
      order: { occurredAt: 'DESC' },
    });
    if (!last) return false;
    const delta = this.now().getTime() - new Date(last.occurredAt).getTime();
    return delta < cooldownMs;
  }

  private async milestoneAlreadyAwarded(sessionId: number, eventType: string, pagePath: string) {
    if (!STRONG_MILESTONES.has(eventType)) return false;
    const existing = await this.eventRepo.findOne({
      where: {
        sessionId,
        eventType,
        pagePath,
      },
    });
    return Boolean(existing);
  }

  private async createEvent(
    visitor: MotivationVisitor,
    session: MotivationSession,
    eventType: string,
    pagePath: string,
    eventLabel: string,
    pointsAwarded: number,
    metadataJson: Record<string, unknown> | null,
  ) {
    const nextScore = session.totalMotivationScore + pointsAwarded;
    const level = this.levelFor(nextScore);
    const occurredAt = this.now();

    await this.eventRepo.save(
      this.eventRepo.create({
        visitorId: visitor.id,
        sessionId: session.id,
        eventType,
        pagePath,
        eventLabel,
        pointsAwarded,
        motivationLevelAfter: level,
        metadataJson,
        occurredAt,
      }),
    );

    session.totalMotivationScore = nextScore;
    session.motivationLevel = level;
    session.actionsCount += 1;
    session.lastActivityAt = occurredAt;
    if (eventType === 'join_page_view') session.joinPageVisited = true;
    if (eventType === 'join_cta_click') session.joinCtaClicks += 1;
    if (eventType === 'join_form_start') session.joinFormStarted = true;
    if (eventType === 'join_form_submit') session.joinFormSubmitted = true;

    const uniquePages = await this.eventRepo
      .createQueryBuilder('event')
      .select('COUNT(DISTINCT event.pagePath)', 'cnt')
      .where('event.sessionId = :sessionId', { sessionId: session.id })
      .andWhere("event.eventType = 'page_view'")
      .getRawOne<{ cnt: string }>();
    session.pagesVisitedCount = Number(uniquePages?.cnt || 0);
    await this.sessionRepo.save(session);

    visitor.lastSeenAt = occurredAt;
    visitor.lifetimeMotivationScore += pointsAwarded;
    visitor.highestMotivationScore = Math.max(visitor.highestMotivationScore, session.totalMotivationScore);
    await this.visitorRepo.save(visitor);

    await this.applyPageStats(pagePath, eventType, pointsAwarded);

    return {
      accepted: true,
      pointsAwarded,
      totalScore: session.totalMotivationScore,
      motivationLevel: session.motivationLevel,
    };
  }

  private async applyPageStats(pagePath: string, eventType: string, points: number) {
    const normalizedPath = this.normalizePath(pagePath);
    let stats = await this.pageStatRepo.findOne({ where: { pagePath: normalizedPath } });
    if (!stats) {
      stats = this.pageStatRepo.create({
        pagePath: normalizedPath,
        totalVisits: 0,
        totalScoreGenerated: 0,
        avgScoreGenerated: 0,
        totalJoinCtaClicks: 0,
        totalJoinFormStarts: 0,
        totalJoinFormSubmissions: 0,
        totalTimeSpent: 0,
        updatedAt: this.now(),
      });
    }

    if (eventType === 'page_view') stats.totalVisits += 1;
    if (eventType === 'page_time_30s') stats.totalTimeSpent += 30;
    if (eventType === 'page_time_60s') stats.totalTimeSpent += 60;
    if (eventType === 'join_cta_click') stats.totalJoinCtaClicks += 1;
    if (eventType === 'join_form_start') stats.totalJoinFormStarts += 1;
    if (eventType === 'join_form_submit') stats.totalJoinFormSubmissions += 1;

    stats.totalScoreGenerated += points;
    stats.avgScoreGenerated =
      stats.totalVisits > 0 ? Number((stats.totalScoreGenerated / Math.max(1, stats.totalVisits)).toFixed(2)) : 0;
    stats.updatedAt = this.now();
    await this.pageStatRepo.save(stats);
  }

  async startSession(dto: MotivationStartSessionDto) {
    const now = this.now();
    const path = this.normalizePath(dto.pagePath || '/');
    const visitor = await this.getOrCreateVisitor(dto.visitorToken);
    let session = await this.sessionRepo.findOne({ where: { sessionToken: dto.sessionToken } });

    if (!session) {
      const isReturnVisit = this.dayKey(visitor.lastSeenAt) !== this.dayKey(now);
      session = await this.sessionRepo.save(
        this.sessionRepo.create({
          visitorId: visitor.id,
          sessionToken: dto.sessionToken,
          startedAt: now,
          endedAt: null,
          durationSeconds: 0,
          totalMotivationScore: 0,
          motivationLevel: 'Curious Visitor',
          pagesVisitedCount: 0,
          actionsCount: 0,
          joinCtaClicks: 0,
          joinPageVisited: false,
          joinFormStarted: false,
          joinFormSubmitted: false,
          referrer: dto.referrer || '',
          deviceType: dto.deviceType || '',
          browserInfo: dto.browserInfo || '',
          lastActivityAt: now,
        }),
      );

      visitor.totalSessions += 1;
      visitor.lastSeenAt = now;
      await this.visitorRepo.save(visitor);

      const bootstrapEvents: Array<{ type: string; points: number; label: string }> = [];
      if (visitor.totalSessions === 1) {
        bootstrapEvents.push({ type: 'first_visit', points: SCORE_RULES.first_visit, label: 'first_visit' });
      }
      if (isReturnVisit) {
        bootstrapEvents.push({ type: 'return_visit', points: SCORE_RULES.return_visit, label: 'return_visit' });
      }

      for (const event of bootstrapEvents) {
        await this.createEvent(visitor, session, event.type, path, event.label, event.points, null);
      }
    }

    return {
      visitorToken: visitor.visitorToken,
      sessionToken: session.sessionToken,
      sessionId: session.id,
      totalScore: session.totalMotivationScore,
      motivationLevel: session.motivationLevel,
    };
  }

  async trackEvent(dto: MotivationTrackEventDto) {
    const path = this.normalizePath(dto.pagePath || '/');
    const label = String(dto.eventLabel || dto.eventType || '').slice(0, 240);
    const visitor = await this.getOrCreateVisitor(dto.visitorToken);
    let session = await this.sessionRepo.findOne({ where: { sessionToken: dto.sessionToken } });
    if (!session) {
      await this.startSession({
        visitorToken: dto.visitorToken,
        sessionToken: dto.sessionToken,
        pagePath: path,
        referrer: '',
        deviceType: '',
        browserInfo: '',
      });
      session = await this.sessionRepo.findOne({ where: { sessionToken: dto.sessionToken } });
    }

    if (!session) {
      return { accepted: false, reason: 'session_unavailable', pointsAwarded: 0 };
    }

    if (await this.isRapidDuplicate(session.id, dto.eventType, path, label, dto.eventType === 'join_cta_click' ? 10000 : 6000)) {
      return { accepted: false, reason: 'duplicate_short_interval', pointsAwarded: 0, totalScore: session.totalMotivationScore };
    }

    if (await this.milestoneAlreadyAwarded(session.id, dto.eventType, path)) {
      return { accepted: false, reason: 'duplicate_milestone', pointsAwarded: 0, totalScore: session.totalMotivationScore };
    }

    let points = SCORE_RULES[dto.eventType] || 0;
    if (dto.eventType === 'page_view') {
      const exists = await this.eventRepo.findOne({
        where: { sessionId: session.id, eventType: 'page_view', pagePath: path },
      });
      points = exists ? 0 : this.scoreForPageView(path);
    }

    return this.createEvent(visitor, session, dto.eventType, path, label, points, dto.metadata || null);
  }

  async endSession(dto: MotivationEndSessionDto) {
    const session = await this.sessionRepo.findOne({ where: { sessionToken: dto.sessionToken } });
    if (!session) return { success: false };

    const endAt = this.now();
    session.endedAt = endAt;
    session.lastActivityAt = endAt;
    session.durationSeconds = Math.max(
      session.durationSeconds,
      Math.max(1, Math.round((endAt.getTime() - new Date(session.startedAt).getTime()) / 1000)),
    );
    await this.sessionRepo.save(session);

    return { success: true, durationSeconds: session.durationSeconds };
  }

  async status(visitorToken: string, sessionToken: string) {
    const visitor = await this.visitorRepo.findOne({ where: { visitorToken } });
    const session = await this.sessionRepo.findOne({ where: { sessionToken } });
    if (!visitor || !session) {
      return {
        exists: false,
        totalScore: 0,
        motivationLevel: 'Curious Visitor',
      };
    }

    return {
      exists: true,
      totalScore: session.totalMotivationScore,
      motivationLevel: session.motivationLevel,
      visitorLifetimeScore: visitor.lifetimeMotivationScore,
      highestSessionScore: visitor.highestMotivationScore,
    };
  }

  async adminOverview() {
    const [
      totalSessions,
      avgScoreRaw,
      maxScoreRaw,
      totalJoinCtaClicks,
      totalJoinPageVisits,
      totalJoinFormStarts,
      totalJoinFormSubmissions,
    ] = await Promise.all([
      this.sessionRepo.count(),
      this.sessionRepo.createQueryBuilder('s').select('AVG(s.totalMotivationScore)', 'avg').getRawOne<{ avg: string }>(),
      this.sessionRepo.createQueryBuilder('s').select('MAX(s.totalMotivationScore)', 'max').getRawOne<{ max: string }>(),
      this.eventRepo.count({ where: { eventType: 'join_cta_click' } }),
      this.eventRepo.count({ where: { eventType: 'join_page_view' } }),
      this.eventRepo.count({ where: { eventType: 'join_form_start' } }),
      this.eventRepo.count({ where: { eventType: 'join_form_submit' } }),
    ]);

    const motivatedSessionRows = await this.sessionRepo
      .createQueryBuilder('s')
      .select('COUNT(*)', 'count')
      .where('s.totalMotivationScore >= :threshold', { threshold: 60 })
      .getRawOne<{ count: string }>();

    const motivatedConvertedRows = await this.sessionRepo
      .createQueryBuilder('s')
      .select('COUNT(*)', 'count')
      .where('s.totalMotivationScore >= :threshold', { threshold: 60 })
      .andWhere('s.joinFormSubmitted = :submitted', { submitted: true })
      .getRawOne<{ count: string }>();

    const motivatedCount = Number(motivatedSessionRows?.count || 0);
    const motivatedConvertedCount = Number(motivatedConvertedRows?.count || 0);
    const conversionRate = motivatedCount > 0 ? (motivatedConvertedCount / motivatedCount) * 100 : 0;

    return {
      totalTrackedVisitorSessions: totalSessions,
      averageMotivationScore: Number(avgScoreRaw?.avg || 0).toFixed(2),
      highestMotivationScore: Number(maxScoreRaw?.max || 0),
      totalJoinCtaClicks,
      totalJoinPageVisits,
      totalJoinFormStarts,
      totalJoinFormSubmissions,
      conversionRateFromMotivatedVisitors: Number(conversionRate.toFixed(2)),
    };
  }

  async adminSessions(query: MotivationAdminSessionsQueryDto) {
    const page = Math.max(1, Number(query.page || 1));
    const pageSize = Math.max(1, Math.min(200, Number(query.pageSize || 50)));
    const minScore = Number.isFinite(Number(query.minScore)) ? Number(query.minScore) : 0;
    const maxScore = Number.isFinite(Number(query.maxScore)) ? Number(query.maxScore) : Number.MAX_SAFE_INTEGER;

    const qb = this.sessionRepo
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.visitor', 'v')
      .where('s.totalMotivationScore BETWEEN :minScore AND :maxScore', { minScore, maxScore });

    if (query.level) qb.andWhere('s.motivationLevel = :level', { level: query.level });
    if (query.converted === 'true') qb.andWhere('s.joinFormSubmitted = true');
    if (query.converted === 'false') qb.andWhere('s.joinFormSubmitted = false');

    const from = this.toDateOrNull(query.from);
    const to = this.toDateOrNull(query.to);
    if (from) qb.andWhere('s.startedAt >= :from', { from });
    if (to) qb.andWhere('s.startedAt <= :to', { to });

    const sortMap: Record<string, string> = {
      score: 's.totalMotivationScore',
      startedAt: 's.startedAt',
      duration: 's.durationSeconds',
      pages: 's.pagesVisitedCount',
      lastActivity: 's.lastActivityAt',
    };
    const orderBy = sortMap[query.sortBy || 'startedAt'] || 's.startedAt';
    const sortDir = String(query.sortDir || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    qb.orderBy(orderBy, sortDir as 'ASC' | 'DESC');

    const [rows, total] = await qb.skip((page - 1) * pageSize).take(pageSize).getManyAndCount();

    const enriched = rows.map((session) => ({
      id: session.id,
      sessionToken: session.sessionToken,
      visitorId: session.visitorId,
      visitorToken: session.visitor?.visitorToken || '',
      motivationScore: session.totalMotivationScore,
      motivationLevel: session.motivationLevel,
      pagesVisited: session.pagesVisitedCount,
      sessionDurationSeconds: session.durationSeconds,
      joinCtaClicks: session.joinCtaClicks,
      joinFormStarted: session.joinFormStarted,
      joinFormSubmitted: session.joinFormSubmitted,
      lastActivityAt: session.lastActivityAt,
      startedAt: session.startedAt,
    }));

    return {
      total,
      page,
      pageSize,
      items: enriched,
    };
  }

  async adminSessionDetail(id: number) {
    const session = await this.sessionRepo.findOne({ where: { id }, relations: { visitor: true } });
    if (!session) return null;

    const events = await this.eventRepo.find({ where: { sessionId: id }, order: { occurredAt: 'ASC' } });
    const sessionEnd = session.endedAt || session.lastActivityAt || this.now();

    return {
      visitorToken: session.visitor?.visitorToken || '',
      sessionToken: session.sessionToken,
      totalScore: session.totalMotivationScore,
      level: session.motivationLevel,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      durationSeconds: session.durationSeconds || Math.max(1, Math.round((sessionEnd.getTime() - new Date(session.startedAt).getTime()) / 1000)),
      pageJourney: events.filter((event) => event.eventType === 'page_view').map((event) => event.pagePath),
      joinCtaClicks: session.joinCtaClicks,
      joinFormStarted: session.joinFormStarted,
      joinFormSubmitted: session.joinFormSubmitted,
      events: events.map((event) => ({
        id: event.id,
        pagePath: event.pagePath,
        eventType: event.eventType,
        eventLabel: event.eventLabel,
        pointsAwarded: event.pointsAwarded,
        motivationLevelAfter: event.motivationLevelAfter,
        occurredAt: event.occurredAt,
      })),
    };
  }

  async adminFunnel() {
    const stage = async (types: string[], whereExtra?: string) => {
      const qb = this.eventRepo
        .createQueryBuilder('e')
        .select('COUNT(DISTINCT e.sessionId)', 'count')
        .where('e.eventType IN (:...types)', { types });
      if (whereExtra) qb.andWhere(whereExtra);
      const result = await qb.getRawOne<{ count: string }>();
      return Number(result?.count || 0);
    };

    return {
      homepageVisit: await stage(['page_view'], "e.pagePath = '/'"),
      intentPagesVisited: await stage(['page_view'], "e.pagePath IN ('/about','/projects','/leadership','/events') OR e.pagePath LIKE '/projects/%' OR e.pagePath LIKE '/events/%'"),
      joinPageVisited: await stage(['join_page_view', 'page_view'], "e.pagePath = '/membership'"),
      joinCtaClicked: await stage(['join_cta_click']),
      joinFormStarted: await stage(['join_form_start']),
      joinFormSubmitted: await stage(['join_form_submit']),
    };
  }

  async adminPages() {
    return this.pageStatRepo.find({ order: { totalScoreGenerated: 'DESC' } });
  }

  async adminDistribution() {
    const rows = await this.sessionRepo
      .createQueryBuilder('s')
      .select('s.motivationLevel', 'level')
      .addSelect('COUNT(*)', 'count')
      .groupBy('s.motivationLevel')
      .orderBy('count', 'DESC')
      .getRawMany<{ level: string; count: string }>();

    const map = new Map(rows.map((row) => [row.level, Number(row.count)]));
    const levels: MotivationLevel[] = [
      'Curious Visitor',
      'Interested Explorer',
      'Inspired Supporter',
      'Future Changemaker',
      'Future Leo',
      'Ready to Join',
    ];

    return levels.map((level) => ({ level, count: map.get(level) || 0 }));
  }
}

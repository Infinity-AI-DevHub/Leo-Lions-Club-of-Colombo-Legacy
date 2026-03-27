"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EngagementService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../entities");
const SCORE_MAP = {
    page_time_30s: 10,
    page_time_60s: 15,
    scroll_50: 5,
    scroll_80: 10,
    cta_click: 15,
    project_open: 10,
    event_open: 10,
    gallery_open: 8,
    video_engaged: 15,
    contact_submit: 30,
    membership_submit: 50,
    return_visit: 25,
};
const MILESTONE_EVENTS = new Set([
    'page_time_30s',
    'page_time_60s',
    'scroll_50',
    'scroll_80',
    'project_open',
    'event_open',
    'gallery_open',
    'video_engaged',
    'contact_submit',
    'membership_submit',
]);
let EngagementService = class EngagementService {
    visitorRepo;
    sessionRepo;
    eventRepo;
    pageStatsRepo;
    constructor(visitorRepo, sessionRepo, eventRepo, pageStatsRepo) {
        this.visitorRepo = visitorRepo;
        this.sessionRepo = sessionRepo;
        this.eventRepo = eventRepo;
        this.pageStatsRepo = pageStatsRepo;
    }
    now() {
        return new Date();
    }
    dayKey(date) {
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    }
    isLikelyDuplicate(lastEvent, eventType, pagePath, label) {
        if (!lastEvent)
            return false;
        const sameType = lastEvent.eventType === eventType;
        const samePage = (lastEvent.pagePath || '') === (pagePath || '');
        const sameLabel = (lastEvent.eventLabel || '') === (label || '');
        if (!(sameType && samePage && sameLabel))
            return false;
        const elapsed = this.now().getTime() - new Date(lastEvent.occurredAt).getTime();
        return elapsed < 8000;
    }
    async getOrCreateVisitor(visitorToken) {
        let visitor = await this.visitorRepo.findOne({ where: { visitorToken } });
        const now = this.now();
        if (!visitor) {
            visitor = await this.visitorRepo.save(this.visitorRepo.create({
                visitorToken,
                firstSeenAt: now,
                lastSeenAt: now,
                totalSessions: 0,
                totalScore: 0,
            }));
        }
        return visitor;
    }
    async getSessionByToken(sessionToken) {
        return this.sessionRepo.findOne({ where: { sessionToken } });
    }
    async startSession(dto) {
        const now = this.now();
        const visitor = await this.getOrCreateVisitor(dto.visitorToken);
        let session = await this.getSessionByToken(dto.sessionToken);
        if (!session) {
            const isReturnVisit = this.dayKey(visitor.lastSeenAt) !== this.dayKey(now);
            session = await this.sessionRepo.save(this.sessionRepo.create({
                visitorId: visitor.id,
                sessionToken: dto.sessionToken,
                startedAt: now,
                endedAt: null,
                durationSeconds: 0,
                totalScore: isReturnVisit ? SCORE_MAP.return_visit : 0,
                pagesVisitedCount: 0,
                actionsCount: isReturnVisit ? 1 : 0,
                referrer: dto.referrer || '',
                deviceType: dto.deviceType || '',
                browserInfo: dto.browserInfo || '',
                lastActivityAt: now,
            }));
            visitor.totalSessions += 1;
            visitor.totalScore += session.totalScore;
            visitor.lastSeenAt = now;
            await this.visitorRepo.save(visitor);
            if (isReturnVisit) {
                await this.eventRepo.save(this.eventRepo.create({
                    visitorId: visitor.id,
                    sessionId: session.id,
                    pagePath: dto.pagePath || '/',
                    eventType: 'return_visit',
                    eventLabel: 'return_visit',
                    pointsAwarded: SCORE_MAP.return_visit,
                    metadataJson: null,
                    occurredAt: now,
                }));
            }
        }
        if (dto.pagePath) {
            await this.trackEvent({
                visitorToken: dto.visitorToken,
                sessionToken: dto.sessionToken,
                pagePath: dto.pagePath,
                eventType: 'page_view',
                eventLabel: 'page_view',
            });
        }
        return {
            visitorToken: visitor.visitorToken,
            sessionToken: session.sessionToken,
            sessionId: session.id,
            totalScore: session.totalScore,
        };
    }
    async scoreForPageView(sessionId, pagePath) {
        const existingPageEvents = await this.eventRepo.find({
            where: { sessionId, eventType: 'page_view' },
            select: ['pagePath'],
        });
        if (existingPageEvents.length === 0)
            return 5;
        const isNewPage = !existingPageEvents.some((e) => e.pagePath === pagePath);
        return isNewPage ? 10 : 0;
    }
    async applyPageStats(pagePath, eventType, points) {
        if (!pagePath)
            return;
        let stats = await this.pageStatsRepo.findOne({ where: { pagePath } });
        if (!stats) {
            stats = this.pageStatsRepo.create({
                pagePath,
                totalViews: 0,
                totalTimeSpent: 0,
                totalScoreGenerated: 0,
                totalCtaClicks: 0,
                totalSubmissions: 0,
                updatedAt: this.now(),
            });
        }
        if (eventType === 'page_view')
            stats.totalViews += 1;
        if (eventType === 'page_time_30s')
            stats.totalTimeSpent += 30;
        if (eventType === 'page_time_60s')
            stats.totalTimeSpent += 60;
        if (eventType === 'cta_click')
            stats.totalCtaClicks += 1;
        if (eventType === 'contact_submit' || eventType === 'membership_submit')
            stats.totalSubmissions += 1;
        stats.totalScoreGenerated += points;
        stats.updatedAt = this.now();
        await this.pageStatsRepo.save(stats);
    }
    async trackEvent(dto) {
        const visitor = await this.getOrCreateVisitor(dto.visitorToken);
        let session = await this.getSessionByToken(dto.sessionToken);
        if (!session) {
            const created = await this.startSession({
                visitorToken: dto.visitorToken,
                sessionToken: dto.sessionToken,
                referrer: '',
                deviceType: '',
                browserInfo: '',
                pagePath: dto.pagePath || '/',
            });
            session = await this.getSessionByToken(created.sessionToken);
        }
        if (!session) {
            return { accepted: false, reason: 'session_unavailable', pointsAwarded: 0 };
        }
        const lastEvent = await this.eventRepo.findOne({
            where: { sessionId: session.id },
            order: { occurredAt: 'DESC' },
        });
        if (this.isLikelyDuplicate(lastEvent, dto.eventType, dto.pagePath, dto.eventLabel)) {
            return { accepted: false, reason: 'duplicate_short_interval', pointsAwarded: 0 };
        }
        if (MILESTONE_EVENTS.has(dto.eventType)) {
            const existing = await this.eventRepo.findOne({
                where: {
                    sessionId: session.id,
                    eventType: dto.eventType,
                    pagePath: dto.pagePath || '',
                    eventLabel: dto.eventLabel || '',
                },
            });
            if (existing) {
                return { accepted: false, reason: 'duplicate_milestone', pointsAwarded: 0 };
            }
        }
        const points = dto.eventType === 'page_view'
            ? await this.scoreForPageView(session.id, dto.pagePath || '/')
            : SCORE_MAP[dto.eventType] || 0;
        await this.eventRepo.save(this.eventRepo.create({
            visitorId: visitor.id,
            sessionId: session.id,
            pagePath: dto.pagePath || '',
            eventType: dto.eventType,
            eventLabel: dto.eventLabel || '',
            pointsAwarded: points,
            metadataJson: dto.metadata || null,
            occurredAt: this.now(),
        }));
        session.totalScore += points;
        session.actionsCount += 1;
        session.lastActivityAt = this.now();
        const uniquePages = await this.eventRepo
            .createQueryBuilder('event')
            .select('COUNT(DISTINCT event.pagePath)', 'cnt')
            .where('event.sessionId = :sessionId', { sessionId: session.id })
            .andWhere("event.eventType = 'page_view'")
            .getRawOne();
        session.pagesVisitedCount = Number(uniquePages?.cnt || 0);
        await this.sessionRepo.save(session);
        visitor.lastSeenAt = this.now();
        visitor.totalScore += points;
        await this.visitorRepo.save(visitor);
        await this.applyPageStats(dto.pagePath, dto.eventType, points);
        return { accepted: true, pointsAwarded: points, totalScore: session.totalScore };
    }
    async endSession(dto) {
        const session = await this.getSessionByToken(dto.sessionToken);
        if (!session) {
            return { success: false };
        }
        const end = this.now();
        session.endedAt = end;
        session.durationSeconds = Math.max(session.durationSeconds, Math.round((end.getTime() - new Date(session.startedAt).getTime()) / 1000));
        session.lastActivityAt = end;
        await this.sessionRepo.save(session);
        return { success: true, durationSeconds: session.durationSeconds };
    }
    async adminOverview() {
        const [totalSessions, avgScoreRaw, maxScoreRaw, ctaClicks, joinSubmits, contactSubmits] = await Promise.all([
            this.sessionRepo.count(),
            this.sessionRepo
                .createQueryBuilder('s')
                .select('AVG(s.totalScore)', 'avg')
                .getRawOne(),
            this.sessionRepo
                .createQueryBuilder('s')
                .select('MAX(s.totalScore)', 'max')
                .getRawOne(),
            this.eventRepo.count({ where: { eventType: 'cta_click' } }),
            this.eventRepo.count({ where: { eventType: 'membership_submit' } }),
            this.eventRepo.count({ where: { eventType: 'contact_submit' } }),
        ]);
        const pageRows = await this.pageStatsRepo.find({ order: { totalViews: 'DESC' } });
        const mostVisitedPage = pageRows[0]?.pagePath || '-';
        const mostEngagingPage = pageRows.sort((a, b) => b.totalScoreGenerated - a.totalScoreGenerated)[0]?.pagePath || '-';
        return {
            totalSessions,
            averageEngagementScore: Number(avgScoreRaw?.avg || 0).toFixed(2),
            highestEngagementScore: Number(maxScoreRaw?.max || 0),
            totalCtaClicks: ctaClicks,
            totalJoinFormSubmissions: joinSubmits,
            totalContactSubmissions: contactSubmits,
            mostVisitedPage,
            mostEngagingPage,
        };
    }
    async adminSessions() {
        const rows = await this.sessionRepo.find({
            relations: { visitor: true },
            order: { startedAt: 'DESC' },
            take: 200,
        });
        return rows.map((session) => ({
            ...session,
            visitorToken: session.visitor?.visitorToken || '',
            durationSeconds: session.durationSeconds ||
                Math.max(0, Math.round((this.now().getTime() - new Date(session.startedAt).getTime()) / 1000)),
        }));
    }
    async adminSessionDetail(id) {
        const session = await this.sessionRepo.findOne({ where: { id }, relations: { visitor: true } });
        if (!session)
            return null;
        const events = await this.eventRepo.find({ where: { sessionId: id }, order: { occurredAt: 'ASC' } });
        const scoreFromEvents = events.reduce((acc, e) => acc + e.pointsAwarded, 0);
        const pageTimeline = events
            .filter((event) => event.eventType === 'page_view')
            .map((event) => event.pagePath);
        return {
            session,
            scoreFromEvents,
            pageTimeline,
            events,
        };
    }
    adminPages() {
        return this.pageStatsRepo.find({ order: { totalScoreGenerated: 'DESC' } });
    }
    async adminEvents() {
        const grouped = await this.eventRepo
            .createQueryBuilder('event')
            .select('event.eventType', 'eventType')
            .addSelect('COUNT(*)', 'count')
            .groupBy('event.eventType')
            .orderBy('count', 'DESC')
            .getRawMany();
        return grouped.map((row) => ({ eventType: row.eventType, count: Number(row.count) }));
    }
    async adminFunnel() {
        const [stage1, stage2, stage3, stage4] = await Promise.all([
            this.eventRepo
                .createQueryBuilder('event')
                .select('COUNT(DISTINCT event.sessionId)', 'count')
                .where("event.eventType = 'page_view'")
                .andWhere("event.pagePath = '/'")
                .getRawOne(),
            this.eventRepo
                .createQueryBuilder('event')
                .select('COUNT(DISTINCT event.sessionId)', 'count')
                .where('event.eventType IN (:...types)', { types: ['project_open', 'event_open', 'gallery_open'] })
                .getRawOne(),
            this.eventRepo
                .createQueryBuilder('event')
                .select('COUNT(DISTINCT event.sessionId)', 'count')
                .where("event.eventType = 'cta_click'")
                .getRawOne(),
            this.eventRepo
                .createQueryBuilder('event')
                .select('COUNT(DISTINCT event.sessionId)', 'count')
                .where('event.eventType IN (:...types)', { types: ['membership_submit', 'contact_submit'] })
                .getRawOne(),
        ]);
        return {
            homepageVisit: Number(stage1?.count || 0),
            projectEventOrGalleryView: Number(stage2?.count || 0),
            ctaClick: Number(stage3?.count || 0),
            conversionSubmit: Number(stage4?.count || 0),
        };
    }
};
exports.EngagementService = EngagementService;
exports.EngagementService = EngagementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Visitor)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.VisitorSession)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.VisitorEvent)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.PageEngagementStat)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EngagementService);
//# sourceMappingURL=engagement.service.js.map
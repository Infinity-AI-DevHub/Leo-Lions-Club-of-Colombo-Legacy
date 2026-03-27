import { Repository } from 'typeorm';
import { PageEngagementStat, Visitor, VisitorEvent, VisitorSession } from '../entities';
import { EndSessionDto, StartSessionDto, TrackEventDto } from './engagement.dto';
export declare class EngagementService {
    private readonly visitorRepo;
    private readonly sessionRepo;
    private readonly eventRepo;
    private readonly pageStatsRepo;
    constructor(visitorRepo: Repository<Visitor>, sessionRepo: Repository<VisitorSession>, eventRepo: Repository<VisitorEvent>, pageStatsRepo: Repository<PageEngagementStat>);
    private now;
    private dayKey;
    private isLikelyDuplicate;
    private getOrCreateVisitor;
    private getSessionByToken;
    startSession(dto: StartSessionDto): Promise<{
        visitorToken: string;
        sessionToken: string;
        sessionId: number;
        totalScore: number;
    }>;
    private scoreForPageView;
    private applyPageStats;
    trackEvent(dto: TrackEventDto): Promise<{
        accepted: boolean;
        reason: string;
        pointsAwarded: number;
        totalScore?: undefined;
    } | {
        accepted: boolean;
        pointsAwarded: number;
        totalScore: number;
        reason?: undefined;
    }>;
    endSession(dto: EndSessionDto): Promise<{
        success: boolean;
        durationSeconds?: undefined;
    } | {
        success: boolean;
        durationSeconds: number;
    }>;
    adminOverview(): Promise<{
        totalSessions: number;
        averageEngagementScore: string;
        highestEngagementScore: number;
        totalCtaClicks: number;
        totalJoinFormSubmissions: number;
        totalContactSubmissions: number;
        mostVisitedPage: string;
        mostEngagingPage: string;
    }>;
    adminSessions(): Promise<{
        visitorToken: string;
        durationSeconds: number;
        id: number;
        visitor: Visitor;
        visitorId: number;
        sessionToken: string;
        startedAt: Date;
        endedAt: Date | null;
        totalScore: number;
        pagesVisitedCount: number;
        actionsCount: number;
        referrer: string;
        deviceType: string;
        browserInfo: string;
        lastActivityAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    adminSessionDetail(id: number): Promise<{
        session: VisitorSession;
        scoreFromEvents: number;
        pageTimeline: string[];
        events: VisitorEvent[];
    } | null>;
    adminPages(): Promise<PageEngagementStat[]>;
    adminEvents(): Promise<{
        eventType: string;
        count: number;
    }[]>;
    adminFunnel(): Promise<{
        homepageVisit: number;
        projectEventOrGalleryView: number;
        ctaClick: number;
        conversionSubmit: number;
    }>;
}

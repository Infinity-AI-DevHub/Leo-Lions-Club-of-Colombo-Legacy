import { EndSessionDto, StartSessionDto, TrackEventDto } from './engagement.dto';
import { EngagementService } from './engagement.service';
export declare class EngagementController {
    private readonly engagementService;
    constructor(engagementService: EngagementService);
    startSession(dto: StartSessionDto): Promise<{
        visitorToken: string;
        sessionToken: string;
        sessionId: number;
        totalScore: number;
    }>;
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
    overview(): Promise<{
        totalSessions: number;
        averageEngagementScore: string;
        highestEngagementScore: number;
        totalCtaClicks: number;
        totalJoinFormSubmissions: number;
        totalContactSubmissions: number;
        mostVisitedPage: string;
        mostEngagingPage: string;
    }>;
    sessions(): Promise<{
        visitorToken: string;
        durationSeconds: number;
        id: number;
        visitor: import("../entities").Visitor;
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
    sessionDetail(id: number): Promise<{
        session: import("../entities").VisitorSession;
        scoreFromEvents: number;
        pageTimeline: string[];
        events: import("../entities").VisitorEvent[];
    } | null>;
    pages(): Promise<import("../entities").PageEngagementStat[]>;
    events(): Promise<{
        eventType: string;
        count: number;
    }[]>;
    funnel(): Promise<{
        homepageVisit: number;
        projectEventOrGalleryView: number;
        ctaClick: number;
        conversionSubmit: number;
    }>;
}

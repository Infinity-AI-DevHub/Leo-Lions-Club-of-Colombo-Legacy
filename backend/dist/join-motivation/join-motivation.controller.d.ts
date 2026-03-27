import { MotivationAdminSessionsQueryDto, MotivationEndSessionDto, MotivationStartSessionDto, MotivationStatusQueryDto, MotivationTrackEventDto } from './join-motivation.dto';
import { JoinMotivationService } from './join-motivation.service';
export declare class JoinMotivationController {
    private readonly motivationService;
    constructor(motivationService: JoinMotivationService);
    startSession(dto: MotivationStartSessionDto): Promise<{
        visitorToken: string;
        sessionToken: string;
        sessionId: number;
        totalScore: number;
        motivationLevel: string;
    }>;
    trackEvent(dto: MotivationTrackEventDto): Promise<{
        accepted: boolean;
        pointsAwarded: number;
        totalScore: number;
        motivationLevel: string;
    } | {
        accepted: boolean;
        reason: string;
        pointsAwarded: number;
        totalScore?: undefined;
    } | {
        accepted: boolean;
        reason: string;
        pointsAwarded: number;
        totalScore: number;
    }>;
    endSession(dto: MotivationEndSessionDto): Promise<{
        success: boolean;
        durationSeconds?: undefined;
    } | {
        success: boolean;
        durationSeconds: number;
    }>;
    getStatus(query: MotivationStatusQueryDto): Promise<{
        exists: boolean;
        totalScore: number;
        motivationLevel: string;
        visitorLifetimeScore?: undefined;
        highestSessionScore?: undefined;
    } | {
        exists: boolean;
        totalScore: number;
        motivationLevel: string;
        visitorLifetimeScore: number;
        highestSessionScore: number;
    }>;
    adminOverview(): Promise<{
        totalTrackedVisitorSessions: number;
        averageMotivationScore: string;
        highestMotivationScore: number;
        totalJoinCtaClicks: number;
        totalJoinPageVisits: number;
        totalJoinFormStarts: number;
        totalJoinFormSubmissions: number;
        conversionRateFromMotivatedVisitors: number;
    }>;
    adminSessions(query: MotivationAdminSessionsQueryDto): Promise<{
        total: number;
        page: number;
        pageSize: number;
        items: {
            id: number;
            sessionToken: string;
            visitorId: number;
            visitorToken: string;
            motivationScore: number;
            motivationLevel: string;
            pagesVisited: number;
            sessionDurationSeconds: number;
            joinCtaClicks: number;
            joinFormStarted: boolean;
            joinFormSubmitted: boolean;
            lastActivityAt: Date | null;
            startedAt: Date;
        }[];
    }>;
    adminSessionDetail(id: number): Promise<{
        visitorToken: string;
        sessionToken: string;
        totalScore: number;
        level: string;
        startedAt: Date;
        endedAt: Date | null;
        durationSeconds: number;
        pageJourney: string[];
        joinCtaClicks: number;
        joinFormStarted: boolean;
        joinFormSubmitted: boolean;
        events: {
            id: number;
            pagePath: string;
            eventType: string;
            eventLabel: string;
            pointsAwarded: number;
            motivationLevelAfter: string;
            occurredAt: Date;
        }[];
    } | null>;
    adminFunnel(): Promise<{
        homepageVisit: number;
        intentPagesVisited: number;
        joinPageVisited: number;
        joinCtaClicked: number;
        joinFormStarted: number;
        joinFormSubmitted: number;
    }>;
    adminPages(): Promise<import("./join-motivation.entities").MotivationPageStat[]>;
    adminDistribution(): Promise<{
        level: "Curious Visitor" | "Interested Explorer" | "Inspired Supporter" | "Future Changemaker" | "Future Leo" | "Ready to Join";
        count: number;
    }[]>;
}

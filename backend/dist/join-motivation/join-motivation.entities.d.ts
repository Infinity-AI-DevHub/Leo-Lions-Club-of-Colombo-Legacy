export declare class MotivationVisitor {
    id: number;
    visitorToken: string;
    firstSeenAt: Date;
    lastSeenAt: Date;
    totalSessions: number;
    lifetimeMotivationScore: number;
    highestMotivationScore: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class MotivationSession {
    id: number;
    visitor: MotivationVisitor;
    visitorId: number;
    sessionToken: string;
    startedAt: Date;
    endedAt: Date | null;
    durationSeconds: number;
    totalMotivationScore: number;
    motivationLevel: string;
    pagesVisitedCount: number;
    actionsCount: number;
    joinCtaClicks: number;
    joinPageVisited: boolean;
    joinFormStarted: boolean;
    joinFormSubmitted: boolean;
    referrer: string;
    deviceType: string;
    browserInfo: string;
    lastActivityAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare class MotivationEvent {
    id: number;
    visitor: MotivationVisitor;
    visitorId: number;
    session: MotivationSession;
    sessionId: number;
    pagePath: string;
    eventType: string;
    eventLabel: string;
    pointsAwarded: number;
    motivationLevelAfter: string;
    metadataJson: Record<string, unknown> | null;
    occurredAt: Date;
    createdAt: Date;
}
export declare class MotivationPageStat {
    id: number;
    pagePath: string;
    totalVisits: number;
    totalScoreGenerated: number;
    avgScoreGenerated: number;
    totalJoinCtaClicks: number;
    totalJoinFormStarts: number;
    totalJoinFormSubmissions: number;
    totalTimeSpent: number;
    updatedAt: Date | null;
}

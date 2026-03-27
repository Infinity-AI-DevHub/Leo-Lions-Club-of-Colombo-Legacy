export declare const MOTIVATION_EVENT_TYPES: readonly ["page_view", "page_time_30s", "page_time_60s", "scroll_50", "scroll_80", "leadership_view", "project_view", "event_view", "gallery_open", "join_page_view", "join_cta_click", "learn_more_click", "join_form_start", "join_form_submit", "contact_submit", "return_visit", "first_visit"];
export declare class MotivationStartSessionDto {
    visitorToken: string;
    sessionToken: string;
    pagePath?: string;
    referrer?: string;
    deviceType?: string;
    browserInfo?: string;
}
export declare class MotivationTrackEventDto {
    visitorToken: string;
    sessionToken: string;
    pagePath?: string;
    eventType: (typeof MOTIVATION_EVENT_TYPES)[number];
    eventLabel?: string;
    metadata?: Record<string, unknown>;
}
export declare class MotivationEndSessionDto {
    visitorToken: string;
    sessionToken: string;
}
export declare class MotivationStatusQueryDto {
    visitorToken: string;
    sessionToken: string;
}
export declare class MotivationAdminSessionsQueryDto {
    minScore?: number;
    maxScore?: number;
    from?: string;
    to?: string;
    converted?: string;
    level?: string;
    sortBy?: string;
    sortDir?: 'ASC' | 'DESC' | 'asc' | 'desc';
    page?: number;
    pageSize?: number;
}

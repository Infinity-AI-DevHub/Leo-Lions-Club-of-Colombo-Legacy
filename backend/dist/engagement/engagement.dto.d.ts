declare const EVENT_TYPES: readonly ["page_view", "page_time_30s", "page_time_60s", "scroll_50", "scroll_80", "cta_click", "project_open", "event_open", "gallery_open", "video_engaged", "contact_submit", "membership_submit", "return_visit"];
export declare class StartSessionDto {
    visitorToken: string;
    sessionToken: string;
    referrer?: string;
    deviceType?: string;
    browserInfo?: string;
    pagePath?: string;
}
export declare class TrackEventDto {
    visitorToken: string;
    sessionToken: string;
    pagePath?: string;
    eventType: (typeof EVENT_TYPES)[number];
    eventLabel?: string;
    metadata?: Record<string, unknown>;
}
export declare class EndSessionDto {
    visitorToken: string;
    sessionToken: string;
}
export {};

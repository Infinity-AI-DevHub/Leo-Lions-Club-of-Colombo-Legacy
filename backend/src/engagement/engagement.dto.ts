import { IsIn, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

const EVENT_TYPES = [
  'page_view',
  'page_time_30s',
  'page_time_60s',
  'scroll_50',
  'scroll_80',
  'cta_click',
  'project_open',
  'event_open',
  'gallery_open',
  'video_engaged',
  'contact_submit',
  'membership_submit',
  'return_visit',
] as const;

export class StartSessionDto {
  @IsString()
  @MaxLength(120)
  visitorToken: string;

  @IsString()
  @MaxLength(120)
  sessionToken: string;

  @IsOptional()
  @IsString()
  referrer?: string;

  @IsOptional()
  @IsString()
  deviceType?: string;

  @IsOptional()
  @IsString()
  browserInfo?: string;

  @IsOptional()
  @IsString()
  pagePath?: string;
}

export class TrackEventDto {
  @IsString()
  @MaxLength(120)
  visitorToken: string;

  @IsString()
  @MaxLength(120)
  sessionToken: string;

  @IsOptional()
  @IsString()
  pagePath?: string;

  @IsIn(EVENT_TYPES)
  eventType: (typeof EVENT_TYPES)[number];

  @IsOptional()
  @IsString()
  eventLabel?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class EndSessionDto {
  @IsString()
  @MaxLength(120)
  visitorToken: string;

  @IsString()
  @MaxLength(120)
  sessionToken: string;
}

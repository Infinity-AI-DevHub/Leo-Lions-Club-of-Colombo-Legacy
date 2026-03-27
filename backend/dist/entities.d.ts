export declare class AdminUser {
    id: number;
    email: string;
    fullName: string;
    passwordHash: string;
    role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class SiteSettings {
    id: number;
    organizationName: string;
    theme: string;
    primaryColor: string;
    secondaryColor: string;
    logoUrl: string;
    faviconUrl: string;
    footerCopyright: string;
    defaultSeoTitle: string;
    defaultSeoDescription: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class HomepageContent {
    id: number;
    heroTitle: string;
    heroSubtitle: string;
    heroBackgroundImage: string;
    ctaPrimaryLabel: string;
    ctaPrimaryLink: string;
    ctaSecondaryLabel: string;
    ctaSecondaryLink: string;
    ctaThirdLabel: string;
    ctaThirdLink: string;
    impactStats: Array<{
        label: string;
        value: string;
    }>;
    highlightedSections: Array<{
        title: string;
        description: string;
    }>;
    createdAt: Date;
    updatedAt: Date;
}
export declare class AboutContent {
    id: number;
    introduction: string;
    vision: string;
    mission: string;
    coreValues: string[];
    presidentsMessage: string;
    presidentsImage: string;
    bannerImage: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class LeadershipMember {
    id: number;
    fullName: string;
    roleTitle: string;
    photoUrl: string;
    shortBio: string;
    committeeType: 'EXECUTIVE_COMMITTEE' | 'BOARD_MEMBER';
    displayOrder: number;
    socialLinks: Array<{
        label: string;
        url: string;
    }>;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class Project {
    id: number;
    title: string;
    category: string;
    date: string | null;
    coverImage: string;
    description: string;
    objectives: string;
    outcomes: string;
    galleryImages: string[];
    status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
    createdAt: Date;
    updatedAt: Date;
}
export declare class Event {
    id: number;
    title: string;
    eventDateTime: Date | null;
    endDateTime: Date | null;
    venue: string;
    description: string;
    detailedDescription: string;
    posterUrl: string;
    galleryImages: string[];
    participantsInfo: string;
    organizer: string;
    contactInfo: string;
    registrationLink: string;
    eventStatus: 'UPCOMING' | 'PAST';
    isFeatured: boolean;
    publishStatus: 'DRAFT' | 'PUBLISHED';
    createdAt: Date;
    updatedAt: Date;
}
export declare class GalleryAlbum {
    id: number;
    title: string;
    referenceType: string;
    referenceId: string;
    isPublished: boolean;
    images: GalleryImage[];
    createdAt: Date;
    updatedAt: Date;
}
export declare class GalleryImage {
    id: number;
    imageUrl: string;
    caption: string;
    album: GalleryAlbum;
    albumId: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class MembershipContent {
    id: number;
    introText: string;
    whyJoinPoints: string[];
    benefits: string[];
    eligibility: string;
    joinFormLink: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class BlogCategory {
    id: number;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class BlogPost {
    id: number;
    title: string;
    slug: string;
    featuredImage: string;
    magazinePdfUrl: string;
    author: string;
    publishDate: string | null;
    content: string;
    category: BlogCategory;
    categoryId: number;
    seoTitle: string;
    seoDescription: string;
    status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
    createdAt: Date;
    updatedAt: Date;
}
export declare class Poll {
    id: number;
    title: string;
    description: string;
    options: string[];
    thumbnailImage: string;
    externalLink: string;
    status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
    createdAt: Date;
    updatedAt: Date;
}
export declare class PollVote {
    id: number;
    pollId: number;
    visitorToken: string;
    optionIndex: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class Notice {
    id: number;
    title: string;
    summary: string;
    content: string;
    noticeDate: string | null;
    thumbnailImage: string;
    externalLink: string;
    status: 'DRAFT' | 'PUBLISHED';
    createdAt: Date;
    updatedAt: Date;
}
export declare class ContactInfo {
    id: number;
    email: string;
    phone: string;
    address: string;
    googleMapsEmbed: string;
    contactFormRecipientEmail: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ContactLead {
    id: number;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: 'NEW' | 'REVIEWED' | 'CONTACTED' | 'CLOSED';
    createdAt: Date;
    updatedAt: Date;
}
export declare class SocialLink {
    id: number;
    platform: string;
    url: string;
    isVisible: boolean;
    displayOrder: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class Visitor {
    id: number;
    visitorToken: string;
    firstSeenAt: Date;
    lastSeenAt: Date;
    totalSessions: number;
    totalScore: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class VisitorSession {
    id: number;
    visitor: Visitor;
    visitorId: number;
    sessionToken: string;
    startedAt: Date;
    endedAt: Date | null;
    durationSeconds: number;
    totalScore: number;
    pagesVisitedCount: number;
    actionsCount: number;
    referrer: string;
    deviceType: string;
    browserInfo: string;
    lastActivityAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare class VisitorEvent {
    id: number;
    visitor: Visitor;
    visitorId: number;
    session: VisitorSession;
    sessionId: number;
    pagePath: string;
    eventType: string;
    eventLabel: string;
    pointsAwarded: number;
    metadataJson: Record<string, unknown> | null;
    occurredAt: Date;
    createdAt: Date;
}
export declare class PageEngagementStat {
    id: number;
    pagePath: string;
    totalViews: number;
    totalTimeSpent: number;
    totalScoreGenerated: number;
    totalCtaClicks: number;
    totalSubmissions: number;
    updatedAt: Date;
}
export declare class ContentReaction {
    id: number;
    targetType: 'PROJECT' | 'EVENT' | 'GALLERY_ALBUM' | 'MAGAZINE' | 'POLL' | 'NOTICE';
    targetId: number;
    visitorToken: string;
    reactionType: 'LIKE' | 'DISLIKE';
    createdAt: Date;
    updatedAt: Date;
}
export declare class ContentComment {
    id: number;
    targetType: 'PROJECT' | 'EVENT' | 'GALLERY_ALBUM' | 'MAGAZINE' | 'POLL' | 'NOTICE';
    targetId: number;
    visitorToken: string;
    authorName: string;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ContentShare {
    id: number;
    targetType: 'PROJECT' | 'EVENT' | 'GALLERY_ALBUM' | 'MAGAZINE' | 'POLL' | 'NOTICE';
    targetId: number;
    visitorToken: string;
    createdAt: Date;
}

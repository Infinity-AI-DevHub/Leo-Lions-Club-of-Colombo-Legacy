import { CmsService } from './cms.service';
declare class EntityQueryDto {
    entity: 'leadership' | 'projects' | 'events' | 'galleryAlbums' | 'galleryImages' | 'blogCategories' | 'blogPosts' | 'socialLinks' | 'polls' | 'notices';
}
declare class ContactFormDto {
    name: string;
    email: string;
    phone?: string;
    message: string;
    subject?: string;
}
declare class PollVoteDto {
    visitorToken: string;
    optionIndex: number;
}
declare class PollUndoVoteDto {
    visitorToken: string;
}
declare class PollResultsQueryDto {
    visitorToken?: string;
}
export declare class CmsController {
    private readonly cmsService;
    constructor(cmsService: CmsService);
    getPublicContent(): Promise<{
        siteSettings: import("../entities").SiteSettings;
        homepage: import("../entities").HomepageContent;
        about: import("../entities").AboutContent;
        leadership: import("../entities").LeadershipMember[];
        projects: import("../entities").Project[];
        events: import("../entities").Event[];
        galleryAlbums: import("../entities").GalleryAlbum[];
        membership: import("../entities").MembershipContent;
        blogPosts: import("../entities").BlogPost[];
        polls: import("../entities").Poll[];
        notices: import("../entities").Notice[];
        contact: import("../entities").ContactInfo;
        socialLinks: import("../entities").SocialLink[];
    }>;
    submitContactForm(dto: ContactFormDto): Promise<{
        success: boolean;
        message: string;
    }>;
    getPollResults(id: number, query: PollResultsQueryDto): Promise<{
        pollId: number;
        status: "DRAFT" | "PUBLISHED" | "CLOSED";
        totalVotes: number;
        selectedOptionIndex: number | null;
        options: {
            index: number;
            label: string;
            votes: number;
            percentage: number;
        }[];
    }>;
    votePoll(id: number, dto: PollVoteDto): Promise<{
        pollId: number;
        status: "DRAFT" | "PUBLISHED" | "CLOSED";
        totalVotes: number;
        selectedOptionIndex: number | null;
        options: {
            index: number;
            label: string;
            votes: number;
            percentage: number;
        }[];
    }>;
    unvotePoll(id: number, dto: PollUndoVoteDto): Promise<{
        pollId: number;
        status: "DRAFT" | "PUBLISHED" | "CLOSED";
        totalVotes: number;
        selectedOptionIndex: number | null;
        options: {
            index: number;
            label: string;
            votes: number;
            percentage: number;
        }[];
    }>;
    getLeads(): Promise<import("../entities").ContactLead[]>;
    deleteLead(id: number): Promise<{
        deleted: boolean;
    }>;
    pingAnalytics(payload: Record<string, unknown>): {
        success: boolean;
        payload: Record<string, unknown>;
    };
    seedData(): Promise<{
        siteSettings: import("../entities").SiteSettings;
        homepage: import("../entities").HomepageContent;
        about: import("../entities").AboutContent;
        leadership: import("../entities").LeadershipMember[];
        projects: import("../entities").Project[];
        events: import("../entities").Event[];
        galleryAlbums: import("../entities").GalleryAlbum[];
        membership: import("../entities").MembershipContent;
        blogPosts: import("../entities").BlogPost[];
        polls: import("../entities").Poll[];
        notices: import("../entities").Notice[];
        contact: import("../entities").ContactInfo;
        socialLinks: import("../entities").SocialLink[];
    }>;
    getOverview(): Promise<{
        projects: number;
        events: number;
        blogPosts: number;
        galleryItems: number;
        leadership: number;
        polls: number;
        notices: number;
    }>;
    getSiteSettings(): Promise<import("../entities").SiteSettings>;
    updateSiteSettings(payload: Record<string, unknown>): Promise<import("../entities").SiteSettings>;
    getHomepage(): Promise<import("../entities").HomepageContent>;
    updateHomepage(payload: Record<string, unknown>): Promise<import("../entities").HomepageContent>;
    getAbout(): Promise<import("../entities").AboutContent>;
    updateAbout(payload: Record<string, unknown>): Promise<import("../entities").AboutContent>;
    getMembership(): Promise<import("../entities").MembershipContent>;
    updateMembership(payload: Record<string, unknown>): Promise<import("../entities").MembershipContent>;
    getContactInfo(): Promise<import("../entities").ContactInfo>;
    updateContactInfo(payload: Record<string, unknown>): Promise<import("../entities").ContactInfo>;
    listByEntity(query: EntityQueryDto): Promise<any[]>;
    getPollVotesOverview(): Promise<{
        id: number;
        title: string;
        status: "DRAFT" | "PUBLISHED" | "CLOSED";
        totalVotes: number;
        optionBreakdown: {
            index: number;
            label: string;
            votes: number;
        }[];
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getPollVoteDetails(id: number): Promise<{
        poll: {
            id: number;
            title: string;
            description: string;
            status: "DRAFT" | "PUBLISHED" | "CLOSED";
        };
        totalVotes: number;
        optionBreakdown: {
            index: number;
            label: string;
            votes: number;
        }[];
        votes: {
            id: number;
            visitorToken: string;
            optionIndex: number;
            optionLabel: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    createByEntity(query: EntityQueryDto, payload: Record<string, unknown>): Promise<any>;
    updateByEntity(query: EntityQueryDto, id: number, payload: Record<string, unknown>): Promise<any>;
    removeByEntity(query: EntityQueryDto, id: number): Promise<{
        deleted: boolean;
    }>;
}
export {};

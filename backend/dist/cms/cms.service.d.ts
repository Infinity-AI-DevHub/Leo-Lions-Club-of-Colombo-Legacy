import { Repository } from 'typeorm';
import { AboutContent, BlogCategory, BlogPost, ContactInfo, ContactLead, Event, GalleryAlbum, GalleryImage, HomepageContent, LeadershipMember, MembershipContent, Notice, Poll, PollVote, Project, SiteSettings, SocialLink } from '../entities';
type EntityName = 'leadership' | 'projects' | 'events' | 'galleryAlbums' | 'galleryImages' | 'blogCategories' | 'blogPosts' | 'socialLinks' | 'polls' | 'notices';
export declare class CmsService {
    private readonly siteSettingsRepo;
    private readonly homepageRepo;
    private readonly aboutRepo;
    private readonly leadershipRepo;
    private readonly projectsRepo;
    private readonly eventsRepo;
    private readonly galleryAlbumsRepo;
    private readonly galleryImagesRepo;
    private readonly membershipRepo;
    private readonly blogCategoriesRepo;
    private readonly blogPostsRepo;
    private readonly contactInfoRepo;
    private readonly contactLeadsRepo;
    private readonly socialLinksRepo;
    private readonly pollsRepo;
    private readonly noticesRepo;
    private readonly pollVotesRepo;
    constructor(siteSettingsRepo: Repository<SiteSettings>, homepageRepo: Repository<HomepageContent>, aboutRepo: Repository<AboutContent>, leadershipRepo: Repository<LeadershipMember>, projectsRepo: Repository<Project>, eventsRepo: Repository<Event>, galleryAlbumsRepo: Repository<GalleryAlbum>, galleryImagesRepo: Repository<GalleryImage>, membershipRepo: Repository<MembershipContent>, blogCategoriesRepo: Repository<BlogCategory>, blogPostsRepo: Repository<BlogPost>, contactInfoRepo: Repository<ContactInfo>, contactLeadsRepo: Repository<ContactLead>, socialLinksRepo: Repository<SocialLink>, pollsRepo: Repository<Poll>, noticesRepo: Repository<Notice>, pollVotesRepo: Repository<PollVote>);
    private getRepo;
    private singleton;
    private updateSingleton;
    private normalizeGalleryImages;
    getPublicContent(): Promise<{
        siteSettings: SiteSettings;
        homepage: HomepageContent;
        about: AboutContent;
        leadership: LeadershipMember[];
        projects: Project[];
        events: Event[];
        galleryAlbums: GalleryAlbum[];
        membership: MembershipContent;
        blogPosts: BlogPost[];
        polls: Poll[];
        notices: Notice[];
        contact: ContactInfo;
        socialLinks: SocialLink[];
    }>;
    getAdminOverview(): Promise<{
        projects: number;
        events: number;
        blogPosts: number;
        galleryItems: number;
        leadership: number;
        polls: number;
        notices: number;
    }>;
    getSiteSettings(): Promise<SiteSettings>;
    updateSiteSettings(payload: Partial<SiteSettings>): Promise<SiteSettings>;
    getHomepage(): Promise<HomepageContent>;
    updateHomepage(payload: Partial<HomepageContent>): Promise<HomepageContent>;
    getAbout(): Promise<AboutContent>;
    updateAbout(payload: Partial<AboutContent>): Promise<AboutContent>;
    getMembership(): Promise<MembershipContent>;
    updateMembership(payload: Partial<MembershipContent>): Promise<MembershipContent>;
    getContactInfo(): Promise<ContactInfo>;
    updateContactInfo(payload: Partial<ContactInfo>): Promise<ContactInfo>;
    createContactLead(payload: Pick<ContactLead, 'name' | 'email' | 'message'> & Partial<ContactLead>): Promise<ContactLead>;
    listContactLeads(): Promise<ContactLead[]>;
    removeContactLead(id: number): Promise<{
        deleted: boolean;
    }>;
    list(entity: EntityName): Promise<any[]>;
    create(entity: EntityName, payload: Record<string, unknown>): Promise<any>;
    update(entity: EntityName, id: number, payload: Record<string, unknown>): Promise<any>;
    remove(entity: EntityName, id: number): Promise<{
        deleted: boolean;
    }>;
    getPollResults(pollId: number, visitorToken?: string): Promise<{
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
    voteOnPoll(pollId: number, visitorToken: string, optionIndex: number): Promise<{
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
    undoPollVote(pollId: number, visitorToken: string): Promise<{
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
    getPollVoteDetails(pollId: number): Promise<{
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
}
export {};

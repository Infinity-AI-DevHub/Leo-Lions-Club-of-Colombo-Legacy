import { Repository } from 'typeorm';
import { BlogPost, ContentComment, ContentReaction, ContentShare, Event, GalleryAlbum, Notice, Poll, Project } from '../entities';
import { AdminCommentsQueryDto, PublicCommentDto, PublicInteractionQueryDto, PublicReactionDto, PublicShareDto } from './interactions.dto';
export declare class InteractionsService {
    private readonly reactionsRepo;
    private readonly commentsRepo;
    private readonly sharesRepo;
    private readonly projectsRepo;
    private readonly eventsRepo;
    private readonly galleryRepo;
    private readonly magazinesRepo;
    private readonly pollsRepo;
    private readonly noticesRepo;
    constructor(reactionsRepo: Repository<ContentReaction>, commentsRepo: Repository<ContentComment>, sharesRepo: Repository<ContentShare>, projectsRepo: Repository<Project>, eventsRepo: Repository<Event>, galleryRepo: Repository<GalleryAlbum>, magazinesRepo: Repository<BlogPost>, pollsRepo: Repository<Poll>, noticesRepo: Repository<Notice>);
    private ensureTargetExists;
    getPublicSummary(query: PublicInteractionQueryDto): Promise<{
        likes: number;
        dislikes: number;
        shares: number;
        commentsCount: number;
        viewerReaction: "LIKE" | "DISLIKE" | null;
        comments: {
            id: number;
            authorName: string;
            comment: string;
            createdAt: Date;
        }[];
    }>;
    react(dto: PublicReactionDto): Promise<{
        likes: number;
        dislikes: number;
        shares: number;
        commentsCount: number;
        viewerReaction: "LIKE" | "DISLIKE" | null;
        comments: {
            id: number;
            authorName: string;
            comment: string;
            createdAt: Date;
        }[];
    }>;
    comment(dto: PublicCommentDto): Promise<{
        likes: number;
        dislikes: number;
        shares: number;
        commentsCount: number;
        viewerReaction: "LIKE" | "DISLIKE" | null;
        comments: {
            id: number;
            authorName: string;
            comment: string;
            createdAt: Date;
        }[];
    }>;
    share(dto: PublicShareDto): Promise<{
        likes: number;
        dislikes: number;
        shares: number;
        commentsCount: number;
        viewerReaction: "LIKE" | "DISLIKE" | null;
        comments: {
            id: number;
            authorName: string;
            comment: string;
            createdAt: Date;
        }[];
    }>;
    adminOverview(): Promise<{
        totalComments: number;
        totalLikes: number;
        totalDislikes: number;
        totalShares: number;
    }>;
    adminComments(query: AdminCommentsQueryDto): Promise<ContentComment[]>;
    adminDeleteComment(id: number): Promise<{
        deleted: boolean;
    }>;
}

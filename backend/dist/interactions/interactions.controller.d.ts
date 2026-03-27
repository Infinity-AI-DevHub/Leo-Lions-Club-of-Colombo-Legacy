import { AdminCommentsQueryDto, PublicCommentDto, PublicInteractionQueryDto, PublicReactionDto, PublicShareDto } from './interactions.dto';
import { InteractionsService } from './interactions.service';
export declare class InteractionsController {
    private readonly interactionsService;
    constructor(interactionsService: InteractionsService);
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
    adminComments(query: AdminCommentsQueryDto): Promise<import("../entities").ContentComment[]>;
    adminDeleteComment(id: number): Promise<{
        deleted: boolean;
    }>;
}

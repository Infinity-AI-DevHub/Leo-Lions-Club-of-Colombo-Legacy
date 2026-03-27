export declare const TARGET_TYPES: readonly ["PROJECT", "EVENT", "GALLERY_ALBUM", "MAGAZINE", "POLL", "NOTICE"];
export declare class PublicInteractionQueryDto {
    targetType: (typeof TARGET_TYPES)[number];
    targetId: number;
    visitorToken?: string;
}
export declare class PublicReactionDto {
    targetType: (typeof TARGET_TYPES)[number];
    targetId: number;
    visitorToken: string;
    reactionType: 'LIKE' | 'DISLIKE';
}
export declare class PublicCommentDto {
    targetType: (typeof TARGET_TYPES)[number];
    targetId: number;
    visitorToken: string;
    authorName?: string;
    comment: string;
}
export declare class PublicShareDto {
    targetType: (typeof TARGET_TYPES)[number];
    targetId: number;
    visitorToken: string;
}
export declare class AdminCommentsQueryDto {
    targetType?: (typeof TARGET_TYPES)[number];
    search?: string;
}

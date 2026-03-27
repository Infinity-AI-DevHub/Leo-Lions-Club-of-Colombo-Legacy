"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../entities");
let InteractionsService = class InteractionsService {
    reactionsRepo;
    commentsRepo;
    sharesRepo;
    projectsRepo;
    eventsRepo;
    galleryRepo;
    magazinesRepo;
    pollsRepo;
    noticesRepo;
    constructor(reactionsRepo, commentsRepo, sharesRepo, projectsRepo, eventsRepo, galleryRepo, magazinesRepo, pollsRepo, noticesRepo) {
        this.reactionsRepo = reactionsRepo;
        this.commentsRepo = commentsRepo;
        this.sharesRepo = sharesRepo;
        this.projectsRepo = projectsRepo;
        this.eventsRepo = eventsRepo;
        this.galleryRepo = galleryRepo;
        this.magazinesRepo = magazinesRepo;
        this.pollsRepo = pollsRepo;
        this.noticesRepo = noticesRepo;
    }
    async ensureTargetExists(targetType, targetId) {
        if (targetType === 'PROJECT') {
            const item = await this.projectsRepo.findOne({ where: { id: targetId } });
            if (!item)
                throw new common_1.NotFoundException('Project not found');
            return;
        }
        if (targetType === 'EVENT') {
            const item = await this.eventsRepo.findOne({ where: { id: targetId } });
            if (!item)
                throw new common_1.NotFoundException('Event not found');
            return;
        }
        if (targetType === 'GALLERY_ALBUM') {
            const item = await this.galleryRepo.findOne({ where: { id: targetId } });
            if (!item)
                throw new common_1.NotFoundException('Gallery album not found');
            return;
        }
        if (targetType === 'MAGAZINE') {
            const item = await this.magazinesRepo.findOne({ where: { id: targetId } });
            if (!item)
                throw new common_1.NotFoundException('Magazine not found');
            return;
        }
        if (targetType === 'POLL') {
            const item = await this.pollsRepo.findOne({ where: { id: targetId } });
            if (!item)
                throw new common_1.NotFoundException('Poll not found');
            return;
        }
        if (targetType === 'NOTICE') {
            const item = await this.noticesRepo.findOne({ where: { id: targetId } });
            if (!item)
                throw new common_1.NotFoundException('Notice not found');
            return;
        }
        throw new common_1.BadRequestException('Unsupported target type');
    }
    async getPublicSummary(query) {
        await this.ensureTargetExists(query.targetType, query.targetId);
        const grouped = await this.reactionsRepo
            .createQueryBuilder('reaction')
            .select('reaction.reactionType', 'reactionType')
            .addSelect('COUNT(*)', 'count')
            .where('reaction.targetType = :targetType', { targetType: query.targetType })
            .andWhere('reaction.targetId = :targetId', { targetId: query.targetId })
            .groupBy('reaction.reactionType')
            .getRawMany();
        const likes = Number(grouped.find((row) => row.reactionType === 'LIKE')?.count || 0);
        const dislikes = Number(grouped.find((row) => row.reactionType === 'DISLIKE')?.count || 0);
        const shares = await this.sharesRepo.count({
            where: {
                targetType: query.targetType,
                targetId: query.targetId,
            },
        });
        let viewerReaction = null;
        if (query.visitorToken) {
            const existing = await this.reactionsRepo.findOne({
                where: {
                    targetType: query.targetType,
                    targetId: query.targetId,
                    visitorToken: query.visitorToken,
                },
            });
            viewerReaction = existing?.reactionType || null;
        }
        const comments = await this.commentsRepo.find({
            where: {
                targetType: query.targetType,
                targetId: query.targetId,
            },
            order: { createdAt: 'DESC' },
            take: 80,
        });
        return {
            likes,
            dislikes,
            shares,
            commentsCount: comments.length,
            viewerReaction,
            comments: comments.map((comment) => ({
                id: comment.id,
                authorName: comment.authorName || 'Guest',
                comment: comment.comment,
                createdAt: comment.createdAt,
            })),
        };
    }
    async react(dto) {
        await this.ensureTargetExists(dto.targetType, dto.targetId);
        let row = await this.reactionsRepo.findOne({
            where: {
                targetType: dto.targetType,
                targetId: dto.targetId,
                visitorToken: dto.visitorToken,
            },
        });
        if (!row) {
            row = this.reactionsRepo.create({
                targetType: dto.targetType,
                targetId: dto.targetId,
                visitorToken: dto.visitorToken,
                reactionType: dto.reactionType,
            });
        }
        else {
            row.reactionType = dto.reactionType;
        }
        await this.reactionsRepo.save(row);
        return this.getPublicSummary({
            targetType: dto.targetType,
            targetId: dto.targetId,
            visitorToken: dto.visitorToken,
        });
    }
    async comment(dto) {
        await this.ensureTargetExists(dto.targetType, dto.targetId);
        if (dto.targetType === 'MAGAZINE') {
            throw new common_1.BadRequestException('Comments are disabled for magazines.');
        }
        const trimmed = String(dto.comment || '').trim();
        if (!trimmed)
            throw new common_1.BadRequestException('Comment is required');
        const lastComment = await this.commentsRepo.findOne({
            where: {
                targetType: dto.targetType,
                targetId: dto.targetId,
                visitorToken: dto.visitorToken,
            },
            order: { createdAt: 'DESC' },
        });
        if (lastComment) {
            const seconds = Math.floor((Date.now() - new Date(lastComment.createdAt).getTime()) / 1000);
            if (seconds < 12) {
                throw new common_1.BadRequestException('Please wait a few seconds before posting another comment.');
            }
        }
        const row = this.commentsRepo.create({
            targetType: dto.targetType,
            targetId: dto.targetId,
            visitorToken: dto.visitorToken,
            authorName: (dto.authorName || 'Guest').trim().slice(0, 120) || 'Guest',
            comment: trimmed.slice(0, 2000),
        });
        await this.commentsRepo.save(row);
        return this.getPublicSummary({
            targetType: dto.targetType,
            targetId: dto.targetId,
            visitorToken: dto.visitorToken,
        });
    }
    async share(dto) {
        await this.ensureTargetExists(dto.targetType, dto.targetId);
        const lastShare = await this.sharesRepo.findOne({
            where: {
                targetType: dto.targetType,
                targetId: dto.targetId,
                visitorToken: dto.visitorToken,
            },
            order: { createdAt: 'DESC' },
        });
        if (lastShare) {
            const seconds = Math.floor((Date.now() - new Date(lastShare.createdAt).getTime()) / 1000);
            if (seconds < 8) {
                return this.getPublicSummary({
                    targetType: dto.targetType,
                    targetId: dto.targetId,
                    visitorToken: dto.visitorToken,
                });
            }
        }
        const row = this.sharesRepo.create({
            targetType: dto.targetType,
            targetId: dto.targetId,
            visitorToken: dto.visitorToken,
        });
        await this.sharesRepo.save(row);
        return this.getPublicSummary({
            targetType: dto.targetType,
            targetId: dto.targetId,
            visitorToken: dto.visitorToken,
        });
    }
    async adminOverview() {
        const [totalComments, totalLikes, totalDislikes, totalShares] = await Promise.all([
            this.commentsRepo.count(),
            this.reactionsRepo.count({ where: { reactionType: 'LIKE' } }),
            this.reactionsRepo.count({ where: { reactionType: 'DISLIKE' } }),
            this.sharesRepo.count(),
        ]);
        return {
            totalComments,
            totalLikes,
            totalDislikes,
            totalShares,
        };
    }
    async adminComments(query) {
        const qb = this.commentsRepo.createQueryBuilder('comment').orderBy('comment.createdAt', 'DESC');
        if (query.targetType) {
            qb.andWhere('comment.targetType = :targetType', { targetType: query.targetType });
        }
        if (query.search?.trim()) {
            qb.andWhere('(comment.comment LIKE :search OR comment.authorName LIKE :search)', {
                search: `%${query.search.trim()}%`,
            });
        }
        const items = await qb.take(300).getMany();
        return items;
    }
    async adminDeleteComment(id) {
        const row = await this.commentsRepo.findOne({ where: { id } });
        if (!row)
            throw new common_1.NotFoundException('Comment not found');
        await this.commentsRepo.remove(row);
        return { deleted: true };
    }
};
exports.InteractionsService = InteractionsService;
exports.InteractionsService = InteractionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.ContentReaction)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.ContentComment)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.ContentShare)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.Project)),
    __param(4, (0, typeorm_1.InjectRepository)(entities_1.Event)),
    __param(5, (0, typeorm_1.InjectRepository)(entities_1.GalleryAlbum)),
    __param(6, (0, typeorm_1.InjectRepository)(entities_1.BlogPost)),
    __param(7, (0, typeorm_1.InjectRepository)(entities_1.Poll)),
    __param(8, (0, typeorm_1.InjectRepository)(entities_1.Notice)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], InteractionsService);
//# sourceMappingURL=interactions.service.js.map
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BlogPost,
  ContentComment,
  ContentReaction,
  ContentShare,
  Event,
  GalleryAlbum,
  Notice,
  Poll,
  Project,
} from '../entities';
import {
  AdminCommentsQueryDto,
  PublicCommentDto,
  PublicInteractionQueryDto,
  PublicReactionDto,
  PublicShareDto,
} from './interactions.dto';

@Injectable()
export class InteractionsService {
  constructor(
    @InjectRepository(ContentReaction)
    private readonly reactionsRepo: Repository<ContentReaction>,
    @InjectRepository(ContentComment)
    private readonly commentsRepo: Repository<ContentComment>,
    @InjectRepository(ContentShare)
    private readonly sharesRepo: Repository<ContentShare>,
    @InjectRepository(Project)
    private readonly projectsRepo: Repository<Project>,
    @InjectRepository(Event)
    private readonly eventsRepo: Repository<Event>,
    @InjectRepository(GalleryAlbum)
    private readonly galleryRepo: Repository<GalleryAlbum>,
    @InjectRepository(BlogPost)
    private readonly magazinesRepo: Repository<BlogPost>,
    @InjectRepository(Poll)
    private readonly pollsRepo: Repository<Poll>,
    @InjectRepository(Notice)
    private readonly noticesRepo: Repository<Notice>,
  ) {}

  private async ensureTargetExists(targetType: string, targetId: number) {
    if (targetType === 'PROJECT') {
      const item = await this.projectsRepo.findOne({ where: { id: targetId } });
      if (!item) throw new NotFoundException('Project not found');
      return;
    }
    if (targetType === 'EVENT') {
      const item = await this.eventsRepo.findOne({ where: { id: targetId } });
      if (!item) throw new NotFoundException('Event not found');
      return;
    }
    if (targetType === 'GALLERY_ALBUM') {
      const item = await this.galleryRepo.findOne({ where: { id: targetId } });
      if (!item) throw new NotFoundException('Gallery album not found');
      return;
    }
    if (targetType === 'MAGAZINE') {
      const item = await this.magazinesRepo.findOne({ where: { id: targetId } });
      if (!item) throw new NotFoundException('Magazine not found');
      return;
    }
    if (targetType === 'POLL') {
      const item = await this.pollsRepo.findOne({ where: { id: targetId } });
      if (!item) throw new NotFoundException('Poll not found');
      return;
    }
    if (targetType === 'NOTICE') {
      const item = await this.noticesRepo.findOne({ where: { id: targetId } });
      if (!item) throw new NotFoundException('Notice not found');
      return;
    }
    throw new BadRequestException('Unsupported target type');
  }

  async getPublicSummary(query: PublicInteractionQueryDto) {
    await this.ensureTargetExists(query.targetType, query.targetId);

    const grouped = await this.reactionsRepo
      .createQueryBuilder('reaction')
      .select('reaction.reactionType', 'reactionType')
      .addSelect('COUNT(*)', 'count')
      .where('reaction.targetType = :targetType', { targetType: query.targetType })
      .andWhere('reaction.targetId = :targetId', { targetId: query.targetId })
      .groupBy('reaction.reactionType')
      .getRawMany<{ reactionType: string; count: string }>();

    const likes = Number(grouped.find((row) => row.reactionType === 'LIKE')?.count || 0);
    const dislikes = Number(grouped.find((row) => row.reactionType === 'DISLIKE')?.count || 0);
    const shares = await this.sharesRepo.count({
      where: {
        targetType: query.targetType,
        targetId: query.targetId,
      },
    });

    let viewerReaction: 'LIKE' | 'DISLIKE' | null = null;
    if (query.visitorToken) {
      const existing = await this.reactionsRepo.findOne({
        where: {
          targetType: query.targetType,
          targetId: query.targetId,
          visitorToken: query.visitorToken,
        },
      });
      viewerReaction = (existing?.reactionType as 'LIKE' | 'DISLIKE' | undefined) || null;
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

  async react(dto: PublicReactionDto) {
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
    } else {
      row.reactionType = dto.reactionType;
    }

    await this.reactionsRepo.save(row);
    return this.getPublicSummary({
      targetType: dto.targetType,
      targetId: dto.targetId,
      visitorToken: dto.visitorToken,
    });
  }

  async comment(dto: PublicCommentDto) {
    await this.ensureTargetExists(dto.targetType, dto.targetId);
    if (dto.targetType === 'MAGAZINE') {
      throw new BadRequestException('Comments are disabled for magazines.');
    }
    const trimmed = String(dto.comment || '').trim();
    if (!trimmed) throw new BadRequestException('Comment is required');

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
        throw new BadRequestException('Please wait a few seconds before posting another comment.');
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

  async share(dto: PublicShareDto) {
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

  async adminComments(query: AdminCommentsQueryDto) {
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

  async adminDeleteComment(id: number) {
    const row = await this.commentsRepo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Comment not found');
    await this.commentsRepo.remove(row);
    return { deleted: true };
  }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import {
  AboutContent,
  BlogCategory,
  BlogPost,
  ContactInfo,
  ContactLead,
  Event,
  GalleryAlbum,
  GalleryImage,
  HomepageContent,
  LeadershipMember,
  MembershipContent,
  Notice,
  Poll,
  PollVote,
  Project,
  SiteSettings,
  SocialLink,
} from '../entities';

type EntityName =
  | 'leadership'
  | 'projects'
  | 'events'
  | 'galleryAlbums'
  | 'galleryImages'
  | 'blogCategories'
  | 'blogPosts'
  | 'socialLinks'
  | 'polls'
  | 'notices';

@Injectable()
export class CmsService {
  constructor(
    @InjectRepository(SiteSettings) private readonly siteSettingsRepo: Repository<SiteSettings>,
    @InjectRepository(HomepageContent) private readonly homepageRepo: Repository<HomepageContent>,
    @InjectRepository(AboutContent) private readonly aboutRepo: Repository<AboutContent>,
    @InjectRepository(LeadershipMember)
    private readonly leadershipRepo: Repository<LeadershipMember>,
    @InjectRepository(Project) private readonly projectsRepo: Repository<Project>,
    @InjectRepository(Event) private readonly eventsRepo: Repository<Event>,
    @InjectRepository(GalleryAlbum) private readonly galleryAlbumsRepo: Repository<GalleryAlbum>,
    @InjectRepository(GalleryImage) private readonly galleryImagesRepo: Repository<GalleryImage>,
    @InjectRepository(MembershipContent)
    private readonly membershipRepo: Repository<MembershipContent>,
    @InjectRepository(BlogCategory) private readonly blogCategoriesRepo: Repository<BlogCategory>,
    @InjectRepository(BlogPost) private readonly blogPostsRepo: Repository<BlogPost>,
    @InjectRepository(ContactInfo) private readonly contactInfoRepo: Repository<ContactInfo>,
    @InjectRepository(ContactLead) private readonly contactLeadsRepo: Repository<ContactLead>,
    @InjectRepository(SocialLink) private readonly socialLinksRepo: Repository<SocialLink>,
    @InjectRepository(Poll) private readonly pollsRepo: Repository<Poll>,
    @InjectRepository(Notice) private readonly noticesRepo: Repository<Notice>,
    @InjectRepository(PollVote) private readonly pollVotesRepo: Repository<PollVote>,
  ) {}

  private getRepo(entity: EntityName): Repository<any> {
    const map: Record<EntityName, Repository<any>> = {
      leadership: this.leadershipRepo,
      projects: this.projectsRepo,
      events: this.eventsRepo,
      galleryAlbums: this.galleryAlbumsRepo,
      galleryImages: this.galleryImagesRepo,
      blogCategories: this.blogCategoriesRepo,
      blogPosts: this.blogPostsRepo,
      socialLinks: this.socialLinksRepo,
      polls: this.pollsRepo,
      notices: this.noticesRepo,
    };
    return map[entity];
  }

  private async singleton<T extends ObjectLiteral>(repo: Repository<T>, defaults: Partial<T>): Promise<T> {
    let row = await repo.findOne({ where: {} as any });
    if (!row) {
      row = repo.create(defaults as any) as unknown as T;
      await repo.save(row);
    }
    return row!;
  }

  private async updateSingleton<T extends ObjectLiteral>(repo: Repository<T>, payload: Partial<T>) {
    const current = await this.singleton(repo, payload);
    Object.assign(current as any, payload);
    return repo.save(current);
  }

  private normalizeGalleryImages(input: unknown): Array<{ imageUrl: string; caption?: string }> {
    if (!Array.isArray(input)) return [];
    return input
      .map((item) => {
        if (typeof item === 'string') {
          const imageUrl = item.trim();
          return imageUrl ? { imageUrl } : null;
        }
        if (item && typeof item === 'object') {
          const imageUrl = String((item as any).imageUrl || '').trim();
          const caption = String((item as any).caption || '').trim();
          if (!imageUrl) return null;
          return { imageUrl, ...(caption ? { caption } : {}) };
        }
        return null;
      })
      .filter((item): item is { imageUrl: string; caption?: string } => Boolean(item));
  }

  async getPublicContent() {
    const [
      siteSettings,
      homepage,
      about,
      leadership,
      projects,
      events,
      membership,
      blogPosts,
      contact,
      social,
      polls,
      notices,
    ] =
      await Promise.all([
        this.singleton(this.siteSettingsRepo, {
          organizationName: 'Leo Lions Club of Colombo Legacy',
          theme: 'Empower You!',
        } as any),
        this.singleton(this.homepageRepo, {
          heroTitle: 'Empower You!',
          heroSubtitle: 'Official platform of Leo Lions Club of Colombo Legacy',
        } as any),
        this.singleton(this.aboutRepo, {
          introduction: '',
          vision: '',
          mission: '',
          presidentsImage: '',
        } as any),
        this.leadershipRepo.find({ where: { isPublished: true }, order: { displayOrder: 'ASC' } }),
        this.projectsRepo.find({ where: { status: 'PUBLISHED' as const }, order: { date: 'DESC' } }),
        this.eventsRepo.find({ where: { publishStatus: 'PUBLISHED' as const }, order: { eventDateTime: 'ASC' } }),
        this.singleton(this.membershipRepo, { introText: '' } as any),
        this.blogPostsRepo.find({ where: { status: 'PUBLISHED' as const }, order: { publishDate: 'DESC' } }),
        this.singleton(this.contactInfoRepo, { email: '', phone: '', address: '' } as any),
        this.socialLinksRepo.find({ where: { isVisible: true }, order: { displayOrder: 'ASC' } }),
        this.pollsRepo.find({ where: [{ status: 'PUBLISHED' as const }, { status: 'CLOSED' as const }], order: { createdAt: 'DESC' } }),
        this.noticesRepo.find({ where: { status: 'PUBLISHED' as const }, order: { noticeDate: 'DESC', createdAt: 'DESC' } }),
      ]);

    const galleryAlbums = await this.galleryAlbumsRepo.find({
      where: { isPublished: true },
      relations: { images: true },
      order: { createdAt: 'DESC' },
    });

    return {
      siteSettings,
      homepage,
      about,
      leadership,
      projects,
      events,
      galleryAlbums,
      membership,
      blogPosts,
      polls,
      notices,
      contact,
      socialLinks: social,
    };
  }

  getAdminOverview() {
    return Promise.all([
      this.projectsRepo.count(),
      this.eventsRepo.count(),
      this.blogPostsRepo.count(),
      this.galleryImagesRepo.count(),
      this.leadershipRepo.count(),
      this.pollsRepo.count(),
      this.noticesRepo.count(),
    ]).then(([projects, events, blogPosts, galleryItems, leadership, polls, notices]) => ({
      projects,
      events,
      blogPosts,
      galleryItems,
      leadership,
      polls,
      notices,
    }));
  }

  getSiteSettings() {
    return this.singleton(this.siteSettingsRepo, {
      organizationName: 'Leo Lions Club of Colombo Legacy',
      theme: 'Empower You!',
      primaryColor: '#0F4C81',
      secondaryColor: '#1F7DBA',
      footerCopyright: 'Leo Lions Club of Colombo Legacy',
      defaultSeoTitle: 'Leo Lions Club of Colombo Legacy',
      defaultSeoDescription: 'Empowering youth for leadership and service.',
    } as any);
  }

  updateSiteSettings(payload: Partial<SiteSettings>) {
    return this.updateSingleton(this.siteSettingsRepo, payload);
  }

  getHomepage() {
    return this.singleton(this.homepageRepo, {
      heroTitle: 'Empower You!',
      heroSubtitle: 'Inspiring youth leadership, service, and unity.',
      ctaPrimaryLabel: 'Join Us',
      ctaPrimaryLink: '/membership',
      ctaSecondaryLabel: 'Explore Our Impact',
      ctaSecondaryLink: '/projects',
      ctaThirdLabel: 'Contact Us',
      ctaThirdLink: '/contact',
      impactStats: [],
      highlightedSections: [],
    } as any);
  }

  updateHomepage(payload: Partial<HomepageContent>) {
    return this.updateSingleton(this.homepageRepo, payload);
  }

  getAbout() {
    return this.singleton(this.aboutRepo, {
      introduction: '',
      vision: '',
      mission: '',
      coreValues: [],
      presidentsMessage: '',
      presidentsImage: '',
    } as any);
  }

  updateAbout(payload: Partial<AboutContent>) {
    return this.updateSingleton(this.aboutRepo, payload);
  }

  getMembership() {
    return this.singleton(this.membershipRepo, {
      introText: '',
      whyJoinPoints: [],
      benefits: [],
      eligibility: '',
    } as any);
  }

  updateMembership(payload: Partial<MembershipContent>) {
    return this.updateSingleton(this.membershipRepo, payload);
  }

  getContactInfo() {
    return this.singleton(this.contactInfoRepo, {
      email: '',
      phone: '',
      address: '',
      googleMapsEmbed: '',
      contactFormRecipientEmail: '',
    } as any);
  }

  updateContactInfo(payload: Partial<ContactInfo>) {
    return this.updateSingleton(this.contactInfoRepo, payload);
  }

  createContactLead(payload: Pick<ContactLead, 'name' | 'email' | 'message'> & Partial<ContactLead>) {
    const lead = this.contactLeadsRepo.create({
      name: payload.name,
      email: payload.email,
      phone: payload.phone || '',
      subject: payload.subject || '',
      message: payload.message,
      status: payload.status || 'NEW',
    });
    return this.contactLeadsRepo.save(lead);
  }

  listContactLeads() {
    return this.contactLeadsRepo.find({ order: { createdAt: 'DESC' } });
  }

  async removeContactLead(id: number) {
    const lead = await this.contactLeadsRepo.findOne({ where: { id } });
    if (!lead) {
      throw new NotFoundException('Lead not found');
    }
    await this.contactLeadsRepo.remove(lead);
    return { deleted: true };
  }

  async list(entity: EntityName) {
    const repo = this.getRepo(entity);
    if (entity === 'galleryAlbums') {
      return repo.find({ relations: { images: true }, order: { createdAt: 'DESC' } });
    }
    if (entity === 'blogPosts') {
      return repo.find({ order: { publishDate: 'DESC' } });
    }
    if (entity === 'notices') {
      return repo.find({ order: { noticeDate: 'DESC', createdAt: 'DESC' } });
    }
    return repo.find({ order: { createdAt: 'DESC' } });
  }

  async create(entity: EntityName, payload: Record<string, unknown>) {
    if (entity === 'galleryAlbums') {
      const albumPayload = { ...payload };
      const images = this.normalizeGalleryImages(albumPayload.images);
      delete (albumPayload as any).images;
      const savedAlbum = await this.galleryAlbumsRepo.save(this.galleryAlbumsRepo.create(albumPayload as any));
      const album = Array.isArray(savedAlbum) ? savedAlbum[0] : savedAlbum;
      if (!album) {
        throw new NotFoundException('Record not found');
      }
      if (images.length > 0) {
        await this.galleryImagesRepo.save(
          images.map((image) => this.galleryImagesRepo.create({ ...image, albumId: album.id })),
        );
      }
      return this.galleryAlbumsRepo.findOne({ where: { id: album.id }, relations: { images: true } });
    }
    const repo = this.getRepo(entity);
    const row = repo.create(payload);
    return repo.save(row);
  }

  async update(entity: EntityName, id: number, payload: Record<string, unknown>) {
    if (entity === 'galleryAlbums') {
      const album = await this.galleryAlbumsRepo.findOne({ where: { id }, relations: { images: true } });
      if (!album) {
        throw new NotFoundException('Record not found');
      }
      const albumPayload = { ...payload };
      const hasImages = Object.prototype.hasOwnProperty.call(albumPayload, 'images');
      const images = this.normalizeGalleryImages(albumPayload.images);
      delete (albumPayload as any).images;
      Object.assign(album, albumPayload);
      await this.galleryAlbumsRepo.save(album);

      if (hasImages) {
        await this.galleryImagesRepo.delete({ albumId: id });
        if (images.length > 0) {
          await this.galleryImagesRepo.save(
            images.map((image) => this.galleryImagesRepo.create({ ...image, albumId: id })),
          );
        }
      }

      return this.galleryAlbumsRepo.findOne({ where: { id }, relations: { images: true } });
    }
    const repo = this.getRepo(entity);
    const row = await repo.findOne({ where: { id } });
    if (!row) {
      throw new NotFoundException('Record not found');
    }
    Object.assign(row, payload);
    return repo.save(row);
  }

  async remove(entity: EntityName, id: number) {
    const repo = this.getRepo(entity);
    const row = await repo.findOne({ where: { id } });
    if (!row) {
      throw new NotFoundException('Record not found');
    }
    await repo.remove(row);
    return { deleted: true };
  }

  async getPollResults(pollId: number, visitorToken?: string) {
    const poll = await this.pollsRepo.findOne({
      where: [{ id: pollId, status: 'PUBLISHED' as const }, { id: pollId, status: 'CLOSED' as const }],
    });
    if (!poll) {
      throw new NotFoundException('Poll not found');
    }
    const options = Array.isArray(poll.options) ? poll.options : [];
    const grouped = await this.pollVotesRepo
      .createQueryBuilder('vote')
      .select('vote.optionIndex', 'optionIndex')
      .addSelect('COUNT(*)', 'count')
      .where('vote.pollId = :pollId', { pollId })
      .groupBy('vote.optionIndex')
      .getRawMany<{ optionIndex: string; count: string }>();

    const voteMap = new Map<number, number>();
    for (const row of grouped) {
      voteMap.set(Number(row.optionIndex), Number(row.count));
    }
    const totalVotes = Array.from(voteMap.values()).reduce((sum, count) => sum + count, 0);
    let selectedOptionIndex: number | null = null;
    if (visitorToken) {
      const existing = await this.pollVotesRepo.findOne({ where: { pollId, visitorToken } });
      selectedOptionIndex = typeof existing?.optionIndex === 'number' ? existing.optionIndex : null;
    }
    const optionResults = options.map((label, index) => {
      const votes = voteMap.get(index) || 0;
      const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
      return { index, label, votes, percentage };
    });

    return {
      pollId,
      status: poll.status,
      totalVotes,
      selectedOptionIndex,
      options: optionResults,
    };
  }

  async voteOnPoll(pollId: number, visitorToken: string, optionIndex: number) {
    const poll = await this.pollsRepo.findOne({ where: { id: pollId } });
    if (!poll) {
      throw new NotFoundException('Poll not found');
    }
    if (poll.status !== 'PUBLISHED') {
      throw new BadRequestException('Poll voting is closed.');
    }
    const options = Array.isArray(poll.options) ? poll.options : [];
    if (!options.length) {
      throw new NotFoundException('Poll options not found');
    }
    if (optionIndex < 0 || optionIndex >= options.length) {
      throw new NotFoundException('Poll option not found');
    }

    let vote = await this.pollVotesRepo.findOne({ where: { pollId, visitorToken } });
    if (!vote) {
      vote = this.pollVotesRepo.create({ pollId, visitorToken, optionIndex });
    } else {
      vote.optionIndex = optionIndex;
    }
    await this.pollVotesRepo.save(vote);
    return this.getPollResults(pollId, visitorToken);
  }

  async undoPollVote(pollId: number, visitorToken: string) {
    const poll = await this.pollsRepo.findOne({ where: { id: pollId } });
    if (!poll) {
      throw new NotFoundException('Poll not found');
    }
    if (poll.status !== 'PUBLISHED') {
      throw new BadRequestException('Poll voting is closed.');
    }
    const vote = await this.pollVotesRepo.findOne({ where: { pollId, visitorToken } });
    if (vote) {
      await this.pollVotesRepo.remove(vote);
    }
    return this.getPollResults(pollId, visitorToken);
  }

  async getPollVotesOverview() {
    const polls = await this.pollsRepo.find({ order: { createdAt: 'DESC' } });
    if (!polls.length) return [];

    const grouped = await this.pollVotesRepo
      .createQueryBuilder('vote')
      .select('vote.pollId', 'pollId')
      .addSelect('vote.optionIndex', 'optionIndex')
      .addSelect('COUNT(*)', 'count')
      .groupBy('vote.pollId')
      .addGroupBy('vote.optionIndex')
      .getRawMany<{ pollId: string; optionIndex: string; count: string }>();

    const map = new Map<number, Map<number, number>>();
    for (const row of grouped) {
      const pollId = Number(row.pollId);
      const optionIndex = Number(row.optionIndex);
      const count = Number(row.count);
      const optionMap = map.get(pollId) || new Map<number, number>();
      optionMap.set(optionIndex, count);
      map.set(pollId, optionMap);
    }

    return polls.map((poll) => {
      const optionCounts = map.get(poll.id) || new Map<number, number>();
      const options = Array.isArray(poll.options) ? poll.options : [];
      const optionBreakdown = options.map((label, index) => ({
        index,
        label,
        votes: optionCounts.get(index) || 0,
      }));
      const totalVotes = optionBreakdown.reduce((sum, item) => sum + item.votes, 0);
      return {
        id: poll.id,
        title: poll.title,
        status: poll.status,
        totalVotes,
        optionBreakdown,
        createdAt: poll.createdAt,
        updatedAt: poll.updatedAt,
      };
    });
  }

  async getPollVoteDetails(pollId: number) {
    const poll = await this.pollsRepo.findOne({ where: { id: pollId } });
    if (!poll) throw new NotFoundException('Poll not found');

    const options = Array.isArray(poll.options) ? poll.options : [];
    const votes = await this.pollVotesRepo.find({
      where: { pollId },
      order: { updatedAt: 'DESC' },
      take: 1000,
    });

    const optionMap = new Map<number, number>();
    for (const vote of votes) {
      const current = optionMap.get(vote.optionIndex) || 0;
      optionMap.set(vote.optionIndex, current + 1);
    }

    const optionBreakdown = options.map((label, index) => ({
      index,
      label,
      votes: optionMap.get(index) || 0,
    }));
    const totalVotes = optionBreakdown.reduce((sum, item) => sum + item.votes, 0);

    return {
      poll: {
        id: poll.id,
        title: poll.title,
        description: poll.description,
        status: poll.status,
      },
      totalVotes,
      optionBreakdown,
      votes: votes.map((vote) => ({
        id: vote.id,
        visitorToken: vote.visitorToken,
        optionIndex: vote.optionIndex,
        optionLabel: options[vote.optionIndex] || `Option ${vote.optionIndex + 1}`,
        createdAt: vote.createdAt,
        updatedAt: vote.updatedAt,
      })),
    };
  }
}

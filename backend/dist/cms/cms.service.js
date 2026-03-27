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
exports.CmsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../entities");
let CmsService = class CmsService {
    siteSettingsRepo;
    homepageRepo;
    aboutRepo;
    leadershipRepo;
    projectsRepo;
    eventsRepo;
    galleryAlbumsRepo;
    galleryImagesRepo;
    membershipRepo;
    blogCategoriesRepo;
    blogPostsRepo;
    contactInfoRepo;
    contactLeadsRepo;
    socialLinksRepo;
    pollsRepo;
    noticesRepo;
    pollVotesRepo;
    constructor(siteSettingsRepo, homepageRepo, aboutRepo, leadershipRepo, projectsRepo, eventsRepo, galleryAlbumsRepo, galleryImagesRepo, membershipRepo, blogCategoriesRepo, blogPostsRepo, contactInfoRepo, contactLeadsRepo, socialLinksRepo, pollsRepo, noticesRepo, pollVotesRepo) {
        this.siteSettingsRepo = siteSettingsRepo;
        this.homepageRepo = homepageRepo;
        this.aboutRepo = aboutRepo;
        this.leadershipRepo = leadershipRepo;
        this.projectsRepo = projectsRepo;
        this.eventsRepo = eventsRepo;
        this.galleryAlbumsRepo = galleryAlbumsRepo;
        this.galleryImagesRepo = galleryImagesRepo;
        this.membershipRepo = membershipRepo;
        this.blogCategoriesRepo = blogCategoriesRepo;
        this.blogPostsRepo = blogPostsRepo;
        this.contactInfoRepo = contactInfoRepo;
        this.contactLeadsRepo = contactLeadsRepo;
        this.socialLinksRepo = socialLinksRepo;
        this.pollsRepo = pollsRepo;
        this.noticesRepo = noticesRepo;
        this.pollVotesRepo = pollVotesRepo;
    }
    getRepo(entity) {
        const map = {
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
    async singleton(repo, defaults) {
        let row = await repo.findOne({ where: {} });
        if (!row) {
            row = repo.create(defaults);
            await repo.save(row);
        }
        return row;
    }
    async updateSingleton(repo, payload) {
        const current = await this.singleton(repo, payload);
        Object.assign(current, payload);
        return repo.save(current);
    }
    normalizeGalleryImages(input) {
        if (!Array.isArray(input))
            return [];
        return input
            .map((item) => {
            if (typeof item === 'string') {
                const imageUrl = item.trim();
                return imageUrl ? { imageUrl } : null;
            }
            if (item && typeof item === 'object') {
                const imageUrl = String(item.imageUrl || '').trim();
                const caption = String(item.caption || '').trim();
                if (!imageUrl)
                    return null;
                return { imageUrl, ...(caption ? { caption } : {}) };
            }
            return null;
        })
            .filter((item) => Boolean(item));
    }
    async getPublicContent() {
        const [siteSettings, homepage, about, leadership, projects, events, membership, blogPosts, contact, social, polls, notices,] = await Promise.all([
            this.singleton(this.siteSettingsRepo, {
                organizationName: 'Leo Lions Club of Colombo Legacy',
                theme: 'Empower You!',
            }),
            this.singleton(this.homepageRepo, {
                heroTitle: 'Empower You!',
                heroSubtitle: 'Official platform of Leo Lions Club of Colombo Legacy',
            }),
            this.singleton(this.aboutRepo, {
                introduction: '',
                vision: '',
                mission: '',
                presidentsImage: '',
            }),
            this.leadershipRepo.find({ where: { isPublished: true }, order: { displayOrder: 'ASC' } }),
            this.projectsRepo.find({ where: { status: 'PUBLISHED' }, order: { date: 'DESC' } }),
            this.eventsRepo.find({ where: { publishStatus: 'PUBLISHED' }, order: { eventDateTime: 'ASC' } }),
            this.singleton(this.membershipRepo, { introText: '' }),
            this.blogPostsRepo.find({ where: { status: 'PUBLISHED' }, order: { publishDate: 'DESC' } }),
            this.singleton(this.contactInfoRepo, { email: '', phone: '', address: '' }),
            this.socialLinksRepo.find({ where: { isVisible: true }, order: { displayOrder: 'ASC' } }),
            this.pollsRepo.find({ where: [{ status: 'PUBLISHED' }, { status: 'CLOSED' }], order: { createdAt: 'DESC' } }),
            this.noticesRepo.find({ where: { status: 'PUBLISHED' }, order: { noticeDate: 'DESC', createdAt: 'DESC' } }),
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
        });
    }
    updateSiteSettings(payload) {
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
        });
    }
    updateHomepage(payload) {
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
        });
    }
    updateAbout(payload) {
        return this.updateSingleton(this.aboutRepo, payload);
    }
    getMembership() {
        return this.singleton(this.membershipRepo, {
            introText: '',
            whyJoinPoints: [],
            benefits: [],
            eligibility: '',
        });
    }
    updateMembership(payload) {
        return this.updateSingleton(this.membershipRepo, payload);
    }
    getContactInfo() {
        return this.singleton(this.contactInfoRepo, {
            email: '',
            phone: '',
            address: '',
            googleMapsEmbed: '',
            contactFormRecipientEmail: '',
        });
    }
    updateContactInfo(payload) {
        return this.updateSingleton(this.contactInfoRepo, payload);
    }
    createContactLead(payload) {
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
    async removeContactLead(id) {
        const lead = await this.contactLeadsRepo.findOne({ where: { id } });
        if (!lead) {
            throw new common_1.NotFoundException('Lead not found');
        }
        await this.contactLeadsRepo.remove(lead);
        return { deleted: true };
    }
    async list(entity) {
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
    async create(entity, payload) {
        if (entity === 'galleryAlbums') {
            const albumPayload = { ...payload };
            const images = this.normalizeGalleryImages(albumPayload.images);
            delete albumPayload.images;
            const savedAlbum = await this.galleryAlbumsRepo.save(this.galleryAlbumsRepo.create(albumPayload));
            const album = Array.isArray(savedAlbum) ? savedAlbum[0] : savedAlbum;
            if (!album) {
                throw new common_1.NotFoundException('Record not found');
            }
            if (images.length > 0) {
                await this.galleryImagesRepo.save(images.map((image) => this.galleryImagesRepo.create({ ...image, albumId: album.id })));
            }
            return this.galleryAlbumsRepo.findOne({ where: { id: album.id }, relations: { images: true } });
        }
        const repo = this.getRepo(entity);
        const row = repo.create(payload);
        return repo.save(row);
    }
    async update(entity, id, payload) {
        if (entity === 'galleryAlbums') {
            const album = await this.galleryAlbumsRepo.findOne({ where: { id }, relations: { images: true } });
            if (!album) {
                throw new common_1.NotFoundException('Record not found');
            }
            const albumPayload = { ...payload };
            const hasImages = Object.prototype.hasOwnProperty.call(albumPayload, 'images');
            const images = this.normalizeGalleryImages(albumPayload.images);
            delete albumPayload.images;
            Object.assign(album, albumPayload);
            await this.galleryAlbumsRepo.save(album);
            if (hasImages) {
                await this.galleryImagesRepo.delete({ albumId: id });
                if (images.length > 0) {
                    await this.galleryImagesRepo.save(images.map((image) => this.galleryImagesRepo.create({ ...image, albumId: id })));
                }
            }
            return this.galleryAlbumsRepo.findOne({ where: { id }, relations: { images: true } });
        }
        const repo = this.getRepo(entity);
        const row = await repo.findOne({ where: { id } });
        if (!row) {
            throw new common_1.NotFoundException('Record not found');
        }
        Object.assign(row, payload);
        return repo.save(row);
    }
    async remove(entity, id) {
        const repo = this.getRepo(entity);
        const row = await repo.findOne({ where: { id } });
        if (!row) {
            throw new common_1.NotFoundException('Record not found');
        }
        await repo.remove(row);
        return { deleted: true };
    }
    async getPollResults(pollId, visitorToken) {
        const poll = await this.pollsRepo.findOne({
            where: [{ id: pollId, status: 'PUBLISHED' }, { id: pollId, status: 'CLOSED' }],
        });
        if (!poll) {
            throw new common_1.NotFoundException('Poll not found');
        }
        const options = Array.isArray(poll.options) ? poll.options : [];
        const grouped = await this.pollVotesRepo
            .createQueryBuilder('vote')
            .select('vote.optionIndex', 'optionIndex')
            .addSelect('COUNT(*)', 'count')
            .where('vote.pollId = :pollId', { pollId })
            .groupBy('vote.optionIndex')
            .getRawMany();
        const voteMap = new Map();
        for (const row of grouped) {
            voteMap.set(Number(row.optionIndex), Number(row.count));
        }
        const totalVotes = Array.from(voteMap.values()).reduce((sum, count) => sum + count, 0);
        let selectedOptionIndex = null;
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
    async voteOnPoll(pollId, visitorToken, optionIndex) {
        const poll = await this.pollsRepo.findOne({ where: { id: pollId } });
        if (!poll) {
            throw new common_1.NotFoundException('Poll not found');
        }
        if (poll.status !== 'PUBLISHED') {
            throw new common_1.BadRequestException('Poll voting is closed.');
        }
        const options = Array.isArray(poll.options) ? poll.options : [];
        if (!options.length) {
            throw new common_1.NotFoundException('Poll options not found');
        }
        if (optionIndex < 0 || optionIndex >= options.length) {
            throw new common_1.NotFoundException('Poll option not found');
        }
        let vote = await this.pollVotesRepo.findOne({ where: { pollId, visitorToken } });
        if (!vote) {
            vote = this.pollVotesRepo.create({ pollId, visitorToken, optionIndex });
        }
        else {
            vote.optionIndex = optionIndex;
        }
        await this.pollVotesRepo.save(vote);
        return this.getPollResults(pollId, visitorToken);
    }
    async undoPollVote(pollId, visitorToken) {
        const poll = await this.pollsRepo.findOne({ where: { id: pollId } });
        if (!poll) {
            throw new common_1.NotFoundException('Poll not found');
        }
        if (poll.status !== 'PUBLISHED') {
            throw new common_1.BadRequestException('Poll voting is closed.');
        }
        const vote = await this.pollVotesRepo.findOne({ where: { pollId, visitorToken } });
        if (vote) {
            await this.pollVotesRepo.remove(vote);
        }
        return this.getPollResults(pollId, visitorToken);
    }
    async getPollVotesOverview() {
        const polls = await this.pollsRepo.find({ order: { createdAt: 'DESC' } });
        if (!polls.length)
            return [];
        const grouped = await this.pollVotesRepo
            .createQueryBuilder('vote')
            .select('vote.pollId', 'pollId')
            .addSelect('vote.optionIndex', 'optionIndex')
            .addSelect('COUNT(*)', 'count')
            .groupBy('vote.pollId')
            .addGroupBy('vote.optionIndex')
            .getRawMany();
        const map = new Map();
        for (const row of grouped) {
            const pollId = Number(row.pollId);
            const optionIndex = Number(row.optionIndex);
            const count = Number(row.count);
            const optionMap = map.get(pollId) || new Map();
            optionMap.set(optionIndex, count);
            map.set(pollId, optionMap);
        }
        return polls.map((poll) => {
            const optionCounts = map.get(poll.id) || new Map();
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
    async getPollVoteDetails(pollId) {
        const poll = await this.pollsRepo.findOne({ where: { id: pollId } });
        if (!poll)
            throw new common_1.NotFoundException('Poll not found');
        const options = Array.isArray(poll.options) ? poll.options : [];
        const votes = await this.pollVotesRepo.find({
            where: { pollId },
            order: { updatedAt: 'DESC' },
            take: 1000,
        });
        const optionMap = new Map();
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
};
exports.CmsService = CmsService;
exports.CmsService = CmsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.SiteSettings)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.HomepageContent)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.AboutContent)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.LeadershipMember)),
    __param(4, (0, typeorm_1.InjectRepository)(entities_1.Project)),
    __param(5, (0, typeorm_1.InjectRepository)(entities_1.Event)),
    __param(6, (0, typeorm_1.InjectRepository)(entities_1.GalleryAlbum)),
    __param(7, (0, typeorm_1.InjectRepository)(entities_1.GalleryImage)),
    __param(8, (0, typeorm_1.InjectRepository)(entities_1.MembershipContent)),
    __param(9, (0, typeorm_1.InjectRepository)(entities_1.BlogCategory)),
    __param(10, (0, typeorm_1.InjectRepository)(entities_1.BlogPost)),
    __param(11, (0, typeorm_1.InjectRepository)(entities_1.ContactInfo)),
    __param(12, (0, typeorm_1.InjectRepository)(entities_1.ContactLead)),
    __param(13, (0, typeorm_1.InjectRepository)(entities_1.SocialLink)),
    __param(14, (0, typeorm_1.InjectRepository)(entities_1.Poll)),
    __param(15, (0, typeorm_1.InjectRepository)(entities_1.Notice)),
    __param(16, (0, typeorm_1.InjectRepository)(entities_1.PollVote)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CmsService);
//# sourceMappingURL=cms.service.js.map
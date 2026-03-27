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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentShare = exports.ContentComment = exports.ContentReaction = exports.PageEngagementStat = exports.VisitorEvent = exports.VisitorSession = exports.Visitor = exports.SocialLink = exports.ContactLead = exports.ContactInfo = exports.Notice = exports.PollVote = exports.Poll = exports.BlogPost = exports.BlogCategory = exports.MembershipContent = exports.GalleryImage = exports.GalleryAlbum = exports.Event = exports.Project = exports.LeadershipMember = exports.AboutContent = exports.HomepageContent = exports.SiteSettings = exports.AdminUser = void 0;
const typeorm_1 = require("typeorm");
let AdminUser = class AdminUser {
    id;
    email;
    fullName;
    passwordHash;
    role;
    isActive;
    createdAt;
    updatedAt;
};
exports.AdminUser = AdminUser;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AdminUser.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], AdminUser.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AdminUser.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AdminUser.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'SUPER_ADMIN' }),
    __metadata("design:type", String)
], AdminUser.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], AdminUser.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AdminUser.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AdminUser.prototype, "updatedAt", void 0);
exports.AdminUser = AdminUser = __decorate([
    (0, typeorm_1.Entity)('admin_users')
], AdminUser);
let SiteSettings = class SiteSettings {
    id;
    organizationName;
    theme;
    primaryColor;
    secondaryColor;
    logoUrl;
    faviconUrl;
    footerCopyright;
    defaultSeoTitle;
    defaultSeoDescription;
    createdAt;
    updatedAt;
};
exports.SiteSettings = SiteSettings;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SiteSettings.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SiteSettings.prototype, "organizationName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SiteSettings.prototype, "theme", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '#0F4C81' }),
    __metadata("design:type", String)
], SiteSettings.prototype, "primaryColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '#1F7DBA' }),
    __metadata("design:type", String)
], SiteSettings.prototype, "secondaryColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SiteSettings.prototype, "logoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SiteSettings.prototype, "faviconUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], SiteSettings.prototype, "footerCopyright", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], SiteSettings.prototype, "defaultSeoTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], SiteSettings.prototype, "defaultSeoDescription", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SiteSettings.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SiteSettings.prototype, "updatedAt", void 0);
exports.SiteSettings = SiteSettings = __decorate([
    (0, typeorm_1.Entity)('site_settings')
], SiteSettings);
let HomepageContent = class HomepageContent {
    id;
    heroTitle;
    heroSubtitle;
    heroBackgroundImage;
    ctaPrimaryLabel;
    ctaPrimaryLink;
    ctaSecondaryLabel;
    ctaSecondaryLink;
    ctaThirdLabel;
    ctaThirdLink;
    impactStats;
    highlightedSections;
    createdAt;
    updatedAt;
};
exports.HomepageContent = HomepageContent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HomepageContent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HomepageContent.prototype, "heroTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], HomepageContent.prototype, "heroSubtitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], HomepageContent.prototype, "heroBackgroundImage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], HomepageContent.prototype, "ctaPrimaryLabel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], HomepageContent.prototype, "ctaPrimaryLink", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], HomepageContent.prototype, "ctaSecondaryLabel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], HomepageContent.prototype, "ctaSecondaryLink", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], HomepageContent.prototype, "ctaThirdLabel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], HomepageContent.prototype, "ctaThirdLink", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], HomepageContent.prototype, "impactStats", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], HomepageContent.prototype, "highlightedSections", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], HomepageContent.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], HomepageContent.prototype, "updatedAt", void 0);
exports.HomepageContent = HomepageContent = __decorate([
    (0, typeorm_1.Entity)('homepage_contents')
], HomepageContent);
let AboutContent = class AboutContent {
    id;
    introduction;
    vision;
    mission;
    coreValues;
    presidentsMessage;
    presidentsImage;
    bannerImage;
    createdAt;
    updatedAt;
};
exports.AboutContent = AboutContent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AboutContent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], AboutContent.prototype, "introduction", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], AboutContent.prototype, "vision", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], AboutContent.prototype, "mission", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], AboutContent.prototype, "coreValues", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AboutContent.prototype, "presidentsMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AboutContent.prototype, "presidentsImage", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AboutContent.prototype, "bannerImage", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AboutContent.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AboutContent.prototype, "updatedAt", void 0);
exports.AboutContent = AboutContent = __decorate([
    (0, typeorm_1.Entity)('about_contents')
], AboutContent);
let LeadershipMember = class LeadershipMember {
    id;
    fullName;
    roleTitle;
    photoUrl;
    shortBio;
    committeeType;
    displayOrder;
    socialLinks;
    isPublished;
    createdAt;
    updatedAt;
};
exports.LeadershipMember = LeadershipMember;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], LeadershipMember.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LeadershipMember.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LeadershipMember.prototype, "roleTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], LeadershipMember.prototype, "photoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], LeadershipMember.prototype, "shortBio", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'EXECUTIVE_COMMITTEE' }),
    __metadata("design:type", String)
], LeadershipMember.prototype, "committeeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], LeadershipMember.prototype, "displayOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], LeadershipMember.prototype, "socialLinks", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], LeadershipMember.prototype, "isPublished", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], LeadershipMember.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], LeadershipMember.prototype, "updatedAt", void 0);
exports.LeadershipMember = LeadershipMember = __decorate([
    (0, typeorm_1.Entity)('leadership_members')
], LeadershipMember);
let Project = class Project {
    id;
    title;
    category;
    date;
    coverImage;
    description;
    objectives;
    outcomes;
    galleryImages;
    status;
    createdAt;
    updatedAt;
};
exports.Project = Project;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Project.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Project.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "coverImage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Project.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "objectives", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "outcomes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Project.prototype, "galleryImages", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'DRAFT' }),
    __metadata("design:type", String)
], Project.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Project.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Project.prototype, "updatedAt", void 0);
exports.Project = Project = __decorate([
    (0, typeorm_1.Entity)('projects')
], Project);
let Event = class Event {
    id;
    title;
    eventDateTime;
    endDateTime;
    venue;
    description;
    detailedDescription;
    posterUrl;
    galleryImages;
    participantsInfo;
    organizer;
    contactInfo;
    registrationLink;
    eventStatus;
    isFeatured;
    publishStatus;
    createdAt;
    updatedAt;
};
exports.Event = Event;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Event.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Event.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "eventDateTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "endDateTime", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Event.prototype, "venue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Event.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'longtext', nullable: true }),
    __metadata("design:type", String)
], Event.prototype, "detailedDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Event.prototype, "posterUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Event.prototype, "galleryImages", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Event.prototype, "participantsInfo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Event.prototype, "organizer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Event.prototype, "contactInfo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Event.prototype, "registrationLink", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'UPCOMING' }),
    __metadata("design:type", String)
], Event.prototype, "eventStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Event.prototype, "isFeatured", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'DRAFT' }),
    __metadata("design:type", String)
], Event.prototype, "publishStatus", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Event.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Event.prototype, "updatedAt", void 0);
exports.Event = Event = __decorate([
    (0, typeorm_1.Entity)('events')
], Event);
let GalleryAlbum = class GalleryAlbum {
    id;
    title;
    referenceType;
    referenceId;
    isPublished;
    images;
    createdAt;
    updatedAt;
};
exports.GalleryAlbum = GalleryAlbum;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GalleryAlbum.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GalleryAlbum.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], GalleryAlbum.prototype, "referenceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], GalleryAlbum.prototype, "referenceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], GalleryAlbum.prototype, "isPublished", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => GalleryImage, (image) => image.album, { cascade: true }),
    __metadata("design:type", Array)
], GalleryAlbum.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], GalleryAlbum.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], GalleryAlbum.prototype, "updatedAt", void 0);
exports.GalleryAlbum = GalleryAlbum = __decorate([
    (0, typeorm_1.Entity)('gallery_albums')
], GalleryAlbum);
let GalleryImage = class GalleryImage {
    id;
    imageUrl;
    caption;
    album;
    albumId;
    createdAt;
    updatedAt;
};
exports.GalleryImage = GalleryImage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GalleryImage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GalleryImage.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], GalleryImage.prototype, "caption", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => GalleryAlbum, (album) => album.images, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'albumId' }),
    __metadata("design:type", GalleryAlbum)
], GalleryImage.prototype, "album", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], GalleryImage.prototype, "albumId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], GalleryImage.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], GalleryImage.prototype, "updatedAt", void 0);
exports.GalleryImage = GalleryImage = __decorate([
    (0, typeorm_1.Entity)('gallery_images')
], GalleryImage);
let MembershipContent = class MembershipContent {
    id;
    introText;
    whyJoinPoints;
    benefits;
    eligibility;
    joinFormLink;
    createdAt;
    updatedAt;
};
exports.MembershipContent = MembershipContent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MembershipContent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], MembershipContent.prototype, "introText", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], MembershipContent.prototype, "whyJoinPoints", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], MembershipContent.prototype, "benefits", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MembershipContent.prototype, "eligibility", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MembershipContent.prototype, "joinFormLink", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MembershipContent.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], MembershipContent.prototype, "updatedAt", void 0);
exports.MembershipContent = MembershipContent = __decorate([
    (0, typeorm_1.Entity)('membership_contents')
], MembershipContent);
let BlogCategory = class BlogCategory {
    id;
    name;
    slug;
    createdAt;
    updatedAt;
};
exports.BlogCategory = BlogCategory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BlogCategory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], BlogCategory.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], BlogCategory.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BlogCategory.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], BlogCategory.prototype, "updatedAt", void 0);
exports.BlogCategory = BlogCategory = __decorate([
    (0, typeorm_1.Entity)('blog_categories')
], BlogCategory);
let BlogPost = class BlogPost {
    id;
    title;
    slug;
    featuredImage;
    magazinePdfUrl;
    author;
    publishDate;
    content;
    category;
    categoryId;
    seoTitle;
    seoDescription;
    status;
    createdAt;
    updatedAt;
};
exports.BlogPost = BlogPost;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BlogPost.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BlogPost.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], BlogPost.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BlogPost.prototype, "featuredImage", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BlogPost.prototype, "magazinePdfUrl", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BlogPost.prototype, "author", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], BlogPost.prototype, "publishDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'longtext' }),
    __metadata("design:type", String)
], BlogPost.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => BlogCategory, { nullable: true, eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'categoryId' }),
    __metadata("design:type", BlogCategory)
], BlogPost.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], BlogPost.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BlogPost.prototype, "seoTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BlogPost.prototype, "seoDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'DRAFT' }),
    __metadata("design:type", String)
], BlogPost.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BlogPost.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], BlogPost.prototype, "updatedAt", void 0);
exports.BlogPost = BlogPost = __decorate([
    (0, typeorm_1.Entity)('blog_posts')
], BlogPost);
let Poll = class Poll {
    id;
    title;
    description;
    options;
    thumbnailImage;
    externalLink;
    status;
    createdAt;
    updatedAt;
};
exports.Poll = Poll;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Poll.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Poll.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Poll.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Poll.prototype, "options", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Poll.prototype, "thumbnailImage", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Poll.prototype, "externalLink", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'DRAFT' }),
    __metadata("design:type", String)
], Poll.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Poll.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Poll.prototype, "updatedAt", void 0);
exports.Poll = Poll = __decorate([
    (0, typeorm_1.Entity)('polls')
], Poll);
let PollVote = class PollVote {
    id;
    pollId;
    visitorToken;
    optionIndex;
    createdAt;
    updatedAt;
};
exports.PollVote = PollVote;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PollVote.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PollVote.prototype, "pollId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 120 }),
    __metadata("design:type", String)
], PollVote.prototype, "visitorToken", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PollVote.prototype, "optionIndex", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PollVote.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], PollVote.prototype, "updatedAt", void 0);
exports.PollVote = PollVote = __decorate([
    (0, typeorm_1.Entity)('poll_votes'),
    (0, typeorm_1.Index)(['pollId', 'visitorToken'], { unique: true })
], PollVote);
let Notice = class Notice {
    id;
    title;
    summary;
    content;
    noticeDate;
    thumbnailImage;
    externalLink;
    status;
    createdAt;
    updatedAt;
};
exports.Notice = Notice;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Notice.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Notice.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Notice.prototype, "summary", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'longtext', nullable: true }),
    __metadata("design:type", String)
], Notice.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Notice.prototype, "noticeDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Notice.prototype, "thumbnailImage", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Notice.prototype, "externalLink", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'DRAFT' }),
    __metadata("design:type", String)
], Notice.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Notice.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Notice.prototype, "updatedAt", void 0);
exports.Notice = Notice = __decorate([
    (0, typeorm_1.Entity)('notices')
], Notice);
let ContactInfo = class ContactInfo {
    id;
    email;
    phone;
    address;
    googleMapsEmbed;
    contactFormRecipientEmail;
    createdAt;
    updatedAt;
};
exports.ContactInfo = ContactInfo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ContactInfo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ContactInfo.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ContactInfo.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ContactInfo.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ContactInfo.prototype, "googleMapsEmbed", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ContactInfo.prototype, "contactFormRecipientEmail", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ContactInfo.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ContactInfo.prototype, "updatedAt", void 0);
exports.ContactInfo = ContactInfo = __decorate([
    (0, typeorm_1.Entity)('contact_infos')
], ContactInfo);
let ContactLead = class ContactLead {
    id;
    name;
    email;
    phone;
    subject;
    message;
    status;
    createdAt;
    updatedAt;
};
exports.ContactLead = ContactLead;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ContactLead.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ContactLead.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ContactLead.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ContactLead.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ContactLead.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], ContactLead.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'NEW' }),
    __metadata("design:type", String)
], ContactLead.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ContactLead.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ContactLead.prototype, "updatedAt", void 0);
exports.ContactLead = ContactLead = __decorate([
    (0, typeorm_1.Entity)('contact_leads')
], ContactLead);
let SocialLink = class SocialLink {
    id;
    platform;
    url;
    isVisible;
    displayOrder;
    createdAt;
    updatedAt;
};
exports.SocialLink = SocialLink;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SocialLink.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SocialLink.prototype, "platform", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SocialLink.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], SocialLink.prototype, "isVisible", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], SocialLink.prototype, "displayOrder", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SocialLink.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SocialLink.prototype, "updatedAt", void 0);
exports.SocialLink = SocialLink = __decorate([
    (0, typeorm_1.Entity)('social_links')
], SocialLink);
let Visitor = class Visitor {
    id;
    visitorToken;
    firstSeenAt;
    lastSeenAt;
    totalSessions;
    totalScore;
    createdAt;
    updatedAt;
};
exports.Visitor = Visitor;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Visitor.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Visitor.prototype, "visitorToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], Visitor.prototype, "firstSeenAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], Visitor.prototype, "lastSeenAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Visitor.prototype, "totalSessions", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Visitor.prototype, "totalScore", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Visitor.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Visitor.prototype, "updatedAt", void 0);
exports.Visitor = Visitor = __decorate([
    (0, typeorm_1.Entity)('visitors')
], Visitor);
let VisitorSession = class VisitorSession {
    id;
    visitor;
    visitorId;
    sessionToken;
    startedAt;
    endedAt;
    durationSeconds;
    totalScore;
    pagesVisitedCount;
    actionsCount;
    referrer;
    deviceType;
    browserInfo;
    lastActivityAt;
    createdAt;
    updatedAt;
};
exports.VisitorSession = VisitorSession;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], VisitorSession.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Visitor, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'visitorId' }),
    __metadata("design:type", Visitor)
], VisitorSession.prototype, "visitor", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], VisitorSession.prototype, "visitorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], VisitorSession.prototype, "sessionToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], VisitorSession.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], VisitorSession.prototype, "endedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], VisitorSession.prototype, "durationSeconds", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], VisitorSession.prototype, "totalScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], VisitorSession.prototype, "pagesVisitedCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], VisitorSession.prototype, "actionsCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], VisitorSession.prototype, "referrer", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], VisitorSession.prototype, "deviceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], VisitorSession.prototype, "browserInfo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], VisitorSession.prototype, "lastActivityAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], VisitorSession.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], VisitorSession.prototype, "updatedAt", void 0);
exports.VisitorSession = VisitorSession = __decorate([
    (0, typeorm_1.Entity)('visitor_sessions')
], VisitorSession);
let VisitorEvent = class VisitorEvent {
    id;
    visitor;
    visitorId;
    session;
    sessionId;
    pagePath;
    eventType;
    eventLabel;
    pointsAwarded;
    metadataJson;
    occurredAt;
    createdAt;
};
exports.VisitorEvent = VisitorEvent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], VisitorEvent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Visitor, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'visitorId' }),
    __metadata("design:type", Visitor)
], VisitorEvent.prototype, "visitor", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], VisitorEvent.prototype, "visitorId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => VisitorSession, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'sessionId' }),
    __metadata("design:type", VisitorSession)
], VisitorEvent.prototype, "session", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], VisitorEvent.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], VisitorEvent.prototype, "pagePath", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], VisitorEvent.prototype, "eventType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], VisitorEvent.prototype, "eventLabel", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], VisitorEvent.prototype, "pointsAwarded", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], VisitorEvent.prototype, "metadataJson", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], VisitorEvent.prototype, "occurredAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], VisitorEvent.prototype, "createdAt", void 0);
exports.VisitorEvent = VisitorEvent = __decorate([
    (0, typeorm_1.Entity)('visitor_events')
], VisitorEvent);
let PageEngagementStat = class PageEngagementStat {
    id;
    pagePath;
    totalViews;
    totalTimeSpent;
    totalScoreGenerated;
    totalCtaClicks;
    totalSubmissions;
    updatedAt;
};
exports.PageEngagementStat = PageEngagementStat;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PageEngagementStat.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], PageEngagementStat.prototype, "pagePath", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], PageEngagementStat.prototype, "totalViews", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], PageEngagementStat.prototype, "totalTimeSpent", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], PageEngagementStat.prototype, "totalScoreGenerated", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], PageEngagementStat.prototype, "totalCtaClicks", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], PageEngagementStat.prototype, "totalSubmissions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], PageEngagementStat.prototype, "updatedAt", void 0);
exports.PageEngagementStat = PageEngagementStat = __decorate([
    (0, typeorm_1.Entity)('page_engagement_stats')
], PageEngagementStat);
let ContentReaction = class ContentReaction {
    id;
    targetType;
    targetId;
    visitorToken;
    reactionType;
    createdAt;
    updatedAt;
};
exports.ContentReaction = ContentReaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ContentReaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 40 }),
    __metadata("design:type", String)
], ContentReaction.prototype, "targetType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ContentReaction.prototype, "targetId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 120 }),
    __metadata("design:type", String)
], ContentReaction.prototype, "visitorToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 12 }),
    __metadata("design:type", String)
], ContentReaction.prototype, "reactionType", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ContentReaction.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ContentReaction.prototype, "updatedAt", void 0);
exports.ContentReaction = ContentReaction = __decorate([
    (0, typeorm_1.Entity)('content_reactions'),
    (0, typeorm_1.Index)(['targetType', 'targetId', 'visitorToken'], { unique: true })
], ContentReaction);
let ContentComment = class ContentComment {
    id;
    targetType;
    targetId;
    visitorToken;
    authorName;
    comment;
    createdAt;
    updatedAt;
};
exports.ContentComment = ContentComment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ContentComment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 40 }),
    __metadata("design:type", String)
], ContentComment.prototype, "targetType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ContentComment.prototype, "targetId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 120 }),
    __metadata("design:type", String)
], ContentComment.prototype, "visitorToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 120, default: 'Guest' }),
    __metadata("design:type", String)
], ContentComment.prototype, "authorName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], ContentComment.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ContentComment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ContentComment.prototype, "updatedAt", void 0);
exports.ContentComment = ContentComment = __decorate([
    (0, typeorm_1.Entity)('content_comments')
], ContentComment);
let ContentShare = class ContentShare {
    id;
    targetType;
    targetId;
    visitorToken;
    createdAt;
};
exports.ContentShare = ContentShare;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ContentShare.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 40 }),
    __metadata("design:type", String)
], ContentShare.prototype, "targetType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ContentShare.prototype, "targetId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 120 }),
    __metadata("design:type", String)
], ContentShare.prototype, "visitorToken", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ContentShare.prototype, "createdAt", void 0);
exports.ContentShare = ContentShare = __decorate([
    (0, typeorm_1.Entity)('content_shares')
], ContentShare);
//# sourceMappingURL=entities.js.map
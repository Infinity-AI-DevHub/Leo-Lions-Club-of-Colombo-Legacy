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
exports.CmsController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const cms_service_1 = require("./cms.service");
class EntityQueryDto {
    entity;
}
__decorate([
    (0, class_validator_1.IsIn)([
        'leadership',
        'projects',
        'events',
        'galleryAlbums',
        'galleryImages',
        'blogCategories',
        'blogPosts',
        'socialLinks',
        'polls',
        'notices',
    ]),
    __metadata("design:type", String)
], EntityQueryDto.prototype, "entity", void 0);
class ContactFormDto {
    name;
    email;
    phone;
    message;
    subject;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ContactFormDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ContactFormDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ContactFormDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ContactFormDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ContactFormDto.prototype, "subject", void 0);
class PollVoteDto {
    visitorToken;
    optionIndex;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], PollVoteDto.prototype, "visitorToken", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PollVoteDto.prototype, "optionIndex", void 0);
class PollUndoVoteDto {
    visitorToken;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], PollUndoVoteDto.prototype, "visitorToken", void 0);
class PollResultsQueryDto {
    visitorToken;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], PollResultsQueryDto.prototype, "visitorToken", void 0);
let CmsController = class CmsController {
    cmsService;
    constructor(cmsService) {
        this.cmsService = cmsService;
    }
    getPublicContent() {
        return this.cmsService.getPublicContent();
    }
    async submitContactForm(dto) {
        await this.cmsService.createContactLead(dto);
        return {
            success: true,
            message: 'Message received successfully. Our team will reach out shortly.',
        };
    }
    getPollResults(id, query) {
        return this.cmsService.getPollResults(id, query.visitorToken);
    }
    votePoll(id, dto) {
        return this.cmsService.voteOnPoll(id, dto.visitorToken, dto.optionIndex);
    }
    unvotePoll(id, dto) {
        return this.cmsService.undoPollVote(id, dto.visitorToken);
    }
    getLeads() {
        return this.cmsService.listContactLeads();
    }
    deleteLead(id) {
        return this.cmsService.removeContactLead(id);
    }
    pingAnalytics(payload) {
        return { success: true, payload };
    }
    seedData() {
        return this.cmsService.getPublicContent();
    }
    getOverview() {
        return this.cmsService.getAdminOverview();
    }
    getSiteSettings() {
        return this.cmsService.getSiteSettings();
    }
    updateSiteSettings(payload) {
        return this.cmsService.updateSiteSettings(payload);
    }
    getHomepage() {
        return this.cmsService.getHomepage();
    }
    updateHomepage(payload) {
        return this.cmsService.updateHomepage(payload);
    }
    getAbout() {
        return this.cmsService.getAbout();
    }
    updateAbout(payload) {
        return this.cmsService.updateAbout(payload);
    }
    getMembership() {
        return this.cmsService.getMembership();
    }
    updateMembership(payload) {
        return this.cmsService.updateMembership(payload);
    }
    getContactInfo() {
        return this.cmsService.getContactInfo();
    }
    updateContactInfo(payload) {
        return this.cmsService.updateContactInfo(payload);
    }
    listByEntity(query) {
        return this.cmsService.list(query.entity);
    }
    getPollVotesOverview() {
        return this.cmsService.getPollVotesOverview();
    }
    getPollVoteDetails(id) {
        return this.cmsService.getPollVoteDetails(id);
    }
    createByEntity(query, payload) {
        return this.cmsService.create(query.entity, payload);
    }
    updateByEntity(query, id, payload) {
        return this.cmsService.update(query.entity, id, payload);
    }
    removeByEntity(query, id) {
        return this.cmsService.remove(query.entity, id);
    }
};
exports.CmsController = CmsController;
__decorate([
    (0, common_1.Get)('public/content'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getPublicContent", null);
__decorate([
    (0, common_1.Post)('public/contact-message'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ContactFormDto]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "submitContactForm", null);
__decorate([
    (0, common_1.Get)('public/polls/:id/results'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, PollResultsQueryDto]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getPollResults", null);
__decorate([
    (0, common_1.Post)('public/polls/:id/vote'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, PollVoteDto]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "votePoll", null);
__decorate([
    (0, common_1.Post)('public/polls/:id/unvote'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, PollUndoVoteDto]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "unvotePoll", null);
__decorate([
    (0, common_1.Get)('admin/leads'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getLeads", null);
__decorate([
    (0, common_1.Delete)('admin/leads/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "deleteLead", null);
__decorate([
    (0, common_1.Post)('admin/analytics/ping'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "pingAnalytics", null);
__decorate([
    (0, common_1.Post)('admin/seed'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "seedData", null);
__decorate([
    (0, common_1.Get)('admin/overview'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('admin/site-settings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getSiteSettings", null);
__decorate([
    (0, common_1.Patch)('admin/site-settings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "updateSiteSettings", null);
__decorate([
    (0, common_1.Get)('admin/homepage'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getHomepage", null);
__decorate([
    (0, common_1.Patch)('admin/homepage'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "updateHomepage", null);
__decorate([
    (0, common_1.Get)('admin/about'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getAbout", null);
__decorate([
    (0, common_1.Patch)('admin/about'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "updateAbout", null);
__decorate([
    (0, common_1.Get)('admin/membership'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getMembership", null);
__decorate([
    (0, common_1.Patch)('admin/membership'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "updateMembership", null);
__decorate([
    (0, common_1.Get)('admin/contact-info'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getContactInfo", null);
__decorate([
    (0, common_1.Patch)('admin/contact-info'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "updateContactInfo", null);
__decorate([
    (0, common_1.Get)('admin/content'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EntityQueryDto]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "listByEntity", null);
__decorate([
    (0, common_1.Get)('admin/polls/votes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getPollVotesOverview", null);
__decorate([
    (0, common_1.Get)('admin/polls/votes/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getPollVoteDetails", null);
__decorate([
    (0, common_1.Post)('admin/content'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EntityQueryDto, Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "createByEntity", null);
__decorate([
    (0, common_1.Patch)('admin/content/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EntityQueryDto, Number, Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "updateByEntity", null);
__decorate([
    (0, common_1.Delete)('admin/content/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EntityQueryDto, Number]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "removeByEntity", null);
exports.CmsController = CmsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [cms_service_1.CmsService])
], CmsController);
//# sourceMappingURL=cms.controller.js.map
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
exports.EngagementController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const engagement_dto_1 = require("./engagement.dto");
const engagement_service_1 = require("./engagement.service");
let EngagementController = class EngagementController {
    engagementService;
    constructor(engagementService) {
        this.engagementService = engagementService;
    }
    startSession(dto) {
        return this.engagementService.startSession(dto);
    }
    trackEvent(dto) {
        return this.engagementService.trackEvent(dto);
    }
    endSession(dto) {
        return this.engagementService.endSession(dto);
    }
    overview() {
        return this.engagementService.adminOverview();
    }
    sessions() {
        return this.engagementService.adminSessions();
    }
    sessionDetail(id) {
        return this.engagementService.adminSessionDetail(id);
    }
    pages() {
        return this.engagementService.adminPages();
    }
    events() {
        return this.engagementService.adminEvents();
    }
    funnel() {
        return this.engagementService.adminFunnel();
    }
};
exports.EngagementController = EngagementController;
__decorate([
    (0, common_1.Post)('engagement/session/start'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [engagement_dto_1.StartSessionDto]),
    __metadata("design:returntype", void 0)
], EngagementController.prototype, "startSession", null);
__decorate([
    (0, common_1.Post)('engagement/event'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [engagement_dto_1.TrackEventDto]),
    __metadata("design:returntype", void 0)
], EngagementController.prototype, "trackEvent", null);
__decorate([
    (0, common_1.Post)('engagement/session/end'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [engagement_dto_1.EndSessionDto]),
    __metadata("design:returntype", void 0)
], EngagementController.prototype, "endSession", null);
__decorate([
    (0, common_1.Get)('admin/engagement/overview'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EngagementController.prototype, "overview", null);
__decorate([
    (0, common_1.Get)('admin/engagement/sessions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EngagementController.prototype, "sessions", null);
__decorate([
    (0, common_1.Get)('admin/engagement/sessions/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], EngagementController.prototype, "sessionDetail", null);
__decorate([
    (0, common_1.Get)('admin/engagement/pages'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EngagementController.prototype, "pages", null);
__decorate([
    (0, common_1.Get)('admin/engagement/events'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EngagementController.prototype, "events", null);
__decorate([
    (0, common_1.Get)('admin/engagement/funnel'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EngagementController.prototype, "funnel", null);
exports.EngagementController = EngagementController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [engagement_service_1.EngagementService])
], EngagementController);
//# sourceMappingURL=engagement.controller.js.map
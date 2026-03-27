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
exports.JoinMotivationController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const join_motivation_dto_1 = require("./join-motivation.dto");
const join_motivation_service_1 = require("./join-motivation.service");
let JoinMotivationController = class JoinMotivationController {
    motivationService;
    constructor(motivationService) {
        this.motivationService = motivationService;
    }
    startSession(dto) {
        return this.motivationService.startSession(dto);
    }
    trackEvent(dto) {
        return this.motivationService.trackEvent(dto);
    }
    endSession(dto) {
        return this.motivationService.endSession(dto);
    }
    getStatus(query) {
        return this.motivationService.status(query.visitorToken, query.sessionToken);
    }
    adminOverview() {
        return this.motivationService.adminOverview();
    }
    adminSessions(query) {
        return this.motivationService.adminSessions(query);
    }
    adminSessionDetail(id) {
        return this.motivationService.adminSessionDetail(id);
    }
    adminFunnel() {
        return this.motivationService.adminFunnel();
    }
    adminPages() {
        return this.motivationService.adminPages();
    }
    adminDistribution() {
        return this.motivationService.adminDistribution();
    }
};
exports.JoinMotivationController = JoinMotivationController;
__decorate([
    (0, common_1.Post)('motivation/session/start'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [join_motivation_dto_1.MotivationStartSessionDto]),
    __metadata("design:returntype", void 0)
], JoinMotivationController.prototype, "startSession", null);
__decorate([
    (0, common_1.Post)('motivation/event'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [join_motivation_dto_1.MotivationTrackEventDto]),
    __metadata("design:returntype", void 0)
], JoinMotivationController.prototype, "trackEvent", null);
__decorate([
    (0, common_1.Post)('motivation/session/end'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [join_motivation_dto_1.MotivationEndSessionDto]),
    __metadata("design:returntype", void 0)
], JoinMotivationController.prototype, "endSession", null);
__decorate([
    (0, common_1.Get)('motivation/session/status'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [join_motivation_dto_1.MotivationStatusQueryDto]),
    __metadata("design:returntype", void 0)
], JoinMotivationController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Get)('admin/motivation/overview'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JoinMotivationController.prototype, "adminOverview", null);
__decorate([
    (0, common_1.Get)('admin/motivation/sessions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [join_motivation_dto_1.MotivationAdminSessionsQueryDto]),
    __metadata("design:returntype", void 0)
], JoinMotivationController.prototype, "adminSessions", null);
__decorate([
    (0, common_1.Get)('admin/motivation/sessions/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], JoinMotivationController.prototype, "adminSessionDetail", null);
__decorate([
    (0, common_1.Get)('admin/motivation/funnel'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JoinMotivationController.prototype, "adminFunnel", null);
__decorate([
    (0, common_1.Get)('admin/motivation/pages'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JoinMotivationController.prototype, "adminPages", null);
__decorate([
    (0, common_1.Get)('admin/motivation/distribution'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JoinMotivationController.prototype, "adminDistribution", null);
exports.JoinMotivationController = JoinMotivationController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [join_motivation_service_1.JoinMotivationService])
], JoinMotivationController);
//# sourceMappingURL=join-motivation.controller.js.map
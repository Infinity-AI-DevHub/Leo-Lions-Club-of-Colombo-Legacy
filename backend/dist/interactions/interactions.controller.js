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
exports.InteractionsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const interactions_dto_1 = require("./interactions.dto");
const interactions_service_1 = require("./interactions.service");
let InteractionsController = class InteractionsController {
    interactionsService;
    constructor(interactionsService) {
        this.interactionsService = interactionsService;
    }
    getPublicSummary(query) {
        return this.interactionsService.getPublicSummary(query);
    }
    react(dto) {
        return this.interactionsService.react(dto);
    }
    comment(dto) {
        return this.interactionsService.comment(dto);
    }
    share(dto) {
        return this.interactionsService.share(dto);
    }
    adminOverview() {
        return this.interactionsService.adminOverview();
    }
    adminComments(query) {
        return this.interactionsService.adminComments(query);
    }
    adminDeleteComment(id) {
        return this.interactionsService.adminDeleteComment(id);
    }
};
exports.InteractionsController = InteractionsController;
__decorate([
    (0, common_1.Get)('public/interactions/summary'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interactions_dto_1.PublicInteractionQueryDto]),
    __metadata("design:returntype", void 0)
], InteractionsController.prototype, "getPublicSummary", null);
__decorate([
    (0, common_1.Post)('public/interactions/reaction'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interactions_dto_1.PublicReactionDto]),
    __metadata("design:returntype", void 0)
], InteractionsController.prototype, "react", null);
__decorate([
    (0, common_1.Post)('public/interactions/comment'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interactions_dto_1.PublicCommentDto]),
    __metadata("design:returntype", void 0)
], InteractionsController.prototype, "comment", null);
__decorate([
    (0, common_1.Post)('public/interactions/share'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interactions_dto_1.PublicShareDto]),
    __metadata("design:returntype", void 0)
], InteractionsController.prototype, "share", null);
__decorate([
    (0, common_1.Get)('admin/interactions/overview'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InteractionsController.prototype, "adminOverview", null);
__decorate([
    (0, common_1.Get)('admin/interactions/comments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [interactions_dto_1.AdminCommentsQueryDto]),
    __metadata("design:returntype", void 0)
], InteractionsController.prototype, "adminComments", null);
__decorate([
    (0, common_1.Delete)('admin/interactions/comments/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], InteractionsController.prototype, "adminDeleteComment", null);
exports.InteractionsController = InteractionsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [interactions_service_1.InteractionsService])
], InteractionsController);
//# sourceMappingURL=interactions.controller.js.map
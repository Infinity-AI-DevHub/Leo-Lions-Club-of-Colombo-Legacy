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
exports.AdminCommentsQueryDto = exports.PublicShareDto = exports.PublicCommentDto = exports.PublicReactionDto = exports.PublicInteractionQueryDto = exports.TARGET_TYPES = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
exports.TARGET_TYPES = ['PROJECT', 'EVENT', 'GALLERY_ALBUM', 'MAGAZINE', 'POLL', 'NOTICE'];
class PublicInteractionQueryDto {
    targetType;
    targetId;
    visitorToken;
}
exports.PublicInteractionQueryDto = PublicInteractionQueryDto;
__decorate([
    (0, class_validator_1.IsIn)(exports.TARGET_TYPES),
    __metadata("design:type", Object)
], PublicInteractionQueryDto.prototype, "targetType", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PublicInteractionQueryDto.prototype, "targetId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], PublicInteractionQueryDto.prototype, "visitorToken", void 0);
class PublicReactionDto {
    targetType;
    targetId;
    visitorToken;
    reactionType;
}
exports.PublicReactionDto = PublicReactionDto;
__decorate([
    (0, class_validator_1.IsIn)(exports.TARGET_TYPES),
    __metadata("design:type", Object)
], PublicReactionDto.prototype, "targetType", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PublicReactionDto.prototype, "targetId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], PublicReactionDto.prototype, "visitorToken", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['LIKE', 'DISLIKE']),
    __metadata("design:type", String)
], PublicReactionDto.prototype, "reactionType", void 0);
class PublicCommentDto {
    targetType;
    targetId;
    visitorToken;
    authorName;
    comment;
}
exports.PublicCommentDto = PublicCommentDto;
__decorate([
    (0, class_validator_1.IsIn)(exports.TARGET_TYPES),
    __metadata("design:type", Object)
], PublicCommentDto.prototype, "targetType", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PublicCommentDto.prototype, "targetId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], PublicCommentDto.prototype, "visitorToken", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], PublicCommentDto.prototype, "authorName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], PublicCommentDto.prototype, "comment", void 0);
class PublicShareDto {
    targetType;
    targetId;
    visitorToken;
}
exports.PublicShareDto = PublicShareDto;
__decorate([
    (0, class_validator_1.IsIn)(exports.TARGET_TYPES),
    __metadata("design:type", Object)
], PublicShareDto.prototype, "targetType", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PublicShareDto.prototype, "targetId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], PublicShareDto.prototype, "visitorToken", void 0);
class AdminCommentsQueryDto {
    targetType;
    search;
}
exports.AdminCommentsQueryDto = AdminCommentsQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(exports.TARGET_TYPES),
    __metadata("design:type", Object)
], AdminCommentsQueryDto.prototype, "targetType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdminCommentsQueryDto.prototype, "search", void 0);
//# sourceMappingURL=interactions.dto.js.map
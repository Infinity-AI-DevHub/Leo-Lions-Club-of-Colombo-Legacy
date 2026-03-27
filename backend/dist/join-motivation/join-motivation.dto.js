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
exports.MotivationAdminSessionsQueryDto = exports.MotivationStatusQueryDto = exports.MotivationEndSessionDto = exports.MotivationTrackEventDto = exports.MotivationStartSessionDto = exports.MOTIVATION_EVENT_TYPES = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
exports.MOTIVATION_EVENT_TYPES = [
    'page_view',
    'page_time_30s',
    'page_time_60s',
    'scroll_50',
    'scroll_80',
    'leadership_view',
    'project_view',
    'event_view',
    'gallery_open',
    'join_page_view',
    'join_cta_click',
    'learn_more_click',
    'join_form_start',
    'join_form_submit',
    'contact_submit',
    'return_visit',
    'first_visit',
];
class MotivationStartSessionDto {
    visitorToken;
    sessionToken;
    pagePath;
    referrer;
    deviceType;
    browserInfo;
}
exports.MotivationStartSessionDto = MotivationStartSessionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], MotivationStartSessionDto.prototype, "visitorToken", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], MotivationStartSessionDto.prototype, "sessionToken", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MotivationStartSessionDto.prototype, "pagePath", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MotivationStartSessionDto.prototype, "referrer", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MotivationStartSessionDto.prototype, "deviceType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MotivationStartSessionDto.prototype, "browserInfo", void 0);
class MotivationTrackEventDto {
    visitorToken;
    sessionToken;
    pagePath;
    eventType;
    eventLabel;
    metadata;
}
exports.MotivationTrackEventDto = MotivationTrackEventDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], MotivationTrackEventDto.prototype, "visitorToken", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], MotivationTrackEventDto.prototype, "sessionToken", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MotivationTrackEventDto.prototype, "pagePath", void 0);
__decorate([
    (0, class_validator_1.IsIn)(exports.MOTIVATION_EVENT_TYPES),
    __metadata("design:type", Object)
], MotivationTrackEventDto.prototype, "eventType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MotivationTrackEventDto.prototype, "eventLabel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], MotivationTrackEventDto.prototype, "metadata", void 0);
class MotivationEndSessionDto {
    visitorToken;
    sessionToken;
}
exports.MotivationEndSessionDto = MotivationEndSessionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], MotivationEndSessionDto.prototype, "visitorToken", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], MotivationEndSessionDto.prototype, "sessionToken", void 0);
class MotivationStatusQueryDto {
    visitorToken;
    sessionToken;
}
exports.MotivationStatusQueryDto = MotivationStatusQueryDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], MotivationStatusQueryDto.prototype, "visitorToken", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], MotivationStatusQueryDto.prototype, "sessionToken", void 0);
class MotivationAdminSessionsQueryDto {
    minScore;
    maxScore;
    from;
    to;
    converted;
    level;
    sortBy;
    sortDir;
    page;
    pageSize;
}
exports.MotivationAdminSessionsQueryDto = MotivationAdminSessionsQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], MotivationAdminSessionsQueryDto.prototype, "minScore", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], MotivationAdminSessionsQueryDto.prototype, "maxScore", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MotivationAdminSessionsQueryDto.prototype, "from", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MotivationAdminSessionsQueryDto.prototype, "to", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBooleanString)(),
    __metadata("design:type", String)
], MotivationAdminSessionsQueryDto.prototype, "converted", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MotivationAdminSessionsQueryDto.prototype, "level", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MotivationAdminSessionsQueryDto.prototype, "sortBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['ASC', 'DESC', 'asc', 'desc']),
    __metadata("design:type", String)
], MotivationAdminSessionsQueryDto.prototype, "sortDir", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], MotivationAdminSessionsQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(200),
    __metadata("design:type", Number)
], MotivationAdminSessionsQueryDto.prototype, "pageSize", void 0);
//# sourceMappingURL=join-motivation.dto.js.map
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
exports.EndSessionDto = exports.TrackEventDto = exports.StartSessionDto = void 0;
const class_validator_1 = require("class-validator");
const EVENT_TYPES = [
    'page_view',
    'page_time_30s',
    'page_time_60s',
    'scroll_50',
    'scroll_80',
    'cta_click',
    'project_open',
    'event_open',
    'gallery_open',
    'video_engaged',
    'contact_submit',
    'membership_submit',
    'return_visit',
];
class StartSessionDto {
    visitorToken;
    sessionToken;
    referrer;
    deviceType;
    browserInfo;
    pagePath;
}
exports.StartSessionDto = StartSessionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], StartSessionDto.prototype, "visitorToken", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], StartSessionDto.prototype, "sessionToken", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StartSessionDto.prototype, "referrer", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StartSessionDto.prototype, "deviceType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StartSessionDto.prototype, "browserInfo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StartSessionDto.prototype, "pagePath", void 0);
class TrackEventDto {
    visitorToken;
    sessionToken;
    pagePath;
    eventType;
    eventLabel;
    metadata;
}
exports.TrackEventDto = TrackEventDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], TrackEventDto.prototype, "visitorToken", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], TrackEventDto.prototype, "sessionToken", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrackEventDto.prototype, "pagePath", void 0);
__decorate([
    (0, class_validator_1.IsIn)(EVENT_TYPES),
    __metadata("design:type", Object)
], TrackEventDto.prototype, "eventType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrackEventDto.prototype, "eventLabel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], TrackEventDto.prototype, "metadata", void 0);
class EndSessionDto {
    visitorToken;
    sessionToken;
}
exports.EndSessionDto = EndSessionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], EndSessionDto.prototype, "visitorToken", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], EndSessionDto.prototype, "sessionToken", void 0);
//# sourceMappingURL=engagement.dto.js.map
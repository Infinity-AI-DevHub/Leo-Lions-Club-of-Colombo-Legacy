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
exports.MotivationPageStat = exports.MotivationEvent = exports.MotivationSession = exports.MotivationVisitor = void 0;
const typeorm_1 = require("typeorm");
let MotivationVisitor = class MotivationVisitor {
    id;
    visitorToken;
    firstSeenAt;
    lastSeenAt;
    totalSessions;
    lifetimeMotivationScore;
    highestMotivationScore;
    createdAt;
    updatedAt;
};
exports.MotivationVisitor = MotivationVisitor;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MotivationVisitor.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 120 }),
    __metadata("design:type", String)
], MotivationVisitor.prototype, "visitorToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], MotivationVisitor.prototype, "firstSeenAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], MotivationVisitor.prototype, "lastSeenAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], MotivationVisitor.prototype, "totalSessions", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], MotivationVisitor.prototype, "lifetimeMotivationScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], MotivationVisitor.prototype, "highestMotivationScore", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MotivationVisitor.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], MotivationVisitor.prototype, "updatedAt", void 0);
exports.MotivationVisitor = MotivationVisitor = __decorate([
    (0, typeorm_1.Entity)('motivation_visitors')
], MotivationVisitor);
let MotivationSession = class MotivationSession {
    id;
    visitor;
    visitorId;
    sessionToken;
    startedAt;
    endedAt;
    durationSeconds;
    totalMotivationScore;
    motivationLevel;
    pagesVisitedCount;
    actionsCount;
    joinCtaClicks;
    joinPageVisited;
    joinFormStarted;
    joinFormSubmitted;
    referrer;
    deviceType;
    browserInfo;
    lastActivityAt;
    createdAt;
    updatedAt;
};
exports.MotivationSession = MotivationSession;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MotivationSession.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => MotivationVisitor, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'visitorId' }),
    __metadata("design:type", MotivationVisitor)
], MotivationSession.prototype, "visitor", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MotivationSession.prototype, "visitorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 120 }),
    __metadata("design:type", String)
], MotivationSession.prototype, "sessionToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], MotivationSession.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], MotivationSession.prototype, "endedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], MotivationSession.prototype, "durationSeconds", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], MotivationSession.prototype, "totalMotivationScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'Curious Visitor', length: 64 }),
    __metadata("design:type", String)
], MotivationSession.prototype, "motivationLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], MotivationSession.prototype, "pagesVisitedCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], MotivationSession.prototype, "actionsCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], MotivationSession.prototype, "joinCtaClicks", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], MotivationSession.prototype, "joinPageVisited", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], MotivationSession.prototype, "joinFormStarted", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], MotivationSession.prototype, "joinFormSubmitted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MotivationSession.prototype, "referrer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MotivationSession.prototype, "deviceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MotivationSession.prototype, "browserInfo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], MotivationSession.prototype, "lastActivityAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MotivationSession.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], MotivationSession.prototype, "updatedAt", void 0);
exports.MotivationSession = MotivationSession = __decorate([
    (0, typeorm_1.Entity)('motivation_sessions')
], MotivationSession);
let MotivationEvent = class MotivationEvent {
    id;
    visitor;
    visitorId;
    session;
    sessionId;
    pagePath;
    eventType;
    eventLabel;
    pointsAwarded;
    motivationLevelAfter;
    metadataJson;
    occurredAt;
    createdAt;
};
exports.MotivationEvent = MotivationEvent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MotivationEvent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => MotivationVisitor, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'visitorId' }),
    __metadata("design:type", MotivationVisitor)
], MotivationEvent.prototype, "visitor", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MotivationEvent.prototype, "visitorId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => MotivationSession, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'sessionId' }),
    __metadata("design:type", MotivationSession)
], MotivationEvent.prototype, "session", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MotivationEvent.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MotivationEvent.prototype, "pagePath", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 80 }),
    __metadata("design:type", String)
], MotivationEvent.prototype, "eventType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MotivationEvent.prototype, "eventLabel", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], MotivationEvent.prototype, "pointsAwarded", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'Curious Visitor', length: 64 }),
    __metadata("design:type", String)
], MotivationEvent.prototype, "motivationLevelAfter", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], MotivationEvent.prototype, "metadataJson", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], MotivationEvent.prototype, "occurredAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MotivationEvent.prototype, "createdAt", void 0);
exports.MotivationEvent = MotivationEvent = __decorate([
    (0, typeorm_1.Entity)('motivation_events')
], MotivationEvent);
let MotivationPageStat = class MotivationPageStat {
    id;
    pagePath;
    totalVisits;
    totalScoreGenerated;
    avgScoreGenerated;
    totalJoinCtaClicks;
    totalJoinFormStarts;
    totalJoinFormSubmissions;
    totalTimeSpent;
    updatedAt;
};
exports.MotivationPageStat = MotivationPageStat;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MotivationPageStat.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 200 }),
    __metadata("design:type", String)
], MotivationPageStat.prototype, "pagePath", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], MotivationPageStat.prototype, "totalVisits", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], MotivationPageStat.prototype, "totalScoreGenerated", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], MotivationPageStat.prototype, "avgScoreGenerated", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], MotivationPageStat.prototype, "totalJoinCtaClicks", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], MotivationPageStat.prototype, "totalJoinFormStarts", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], MotivationPageStat.prototype, "totalJoinFormSubmissions", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], MotivationPageStat.prototype, "totalTimeSpent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], MotivationPageStat.prototype, "updatedAt", void 0);
exports.MotivationPageStat = MotivationPageStat = __decorate([
    (0, typeorm_1.Entity)('motivation_page_stats')
], MotivationPageStat);
//# sourceMappingURL=join-motivation.entities.js.map
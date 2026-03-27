"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinMotivationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const join_motivation_controller_1 = require("./join-motivation.controller");
const join_motivation_service_1 = require("./join-motivation.service");
const join_motivation_entities_1 = require("./join-motivation.entities");
let JoinMotivationModule = class JoinMotivationModule {
};
exports.JoinMotivationModule = JoinMotivationModule;
exports.JoinMotivationModule = JoinMotivationModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([join_motivation_entities_1.MotivationVisitor, join_motivation_entities_1.MotivationSession, join_motivation_entities_1.MotivationEvent, join_motivation_entities_1.MotivationPageStat])],
        controllers: [join_motivation_controller_1.JoinMotivationController],
        providers: [join_motivation_service_1.JoinMotivationService],
        exports: [join_motivation_service_1.JoinMotivationService],
    })
], JoinMotivationModule);
//# sourceMappingURL=join-motivation.module.js.map
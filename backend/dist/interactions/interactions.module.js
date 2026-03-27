"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("../entities");
const interactions_controller_1 = require("./interactions.controller");
const interactions_service_1 = require("./interactions.service");
let InteractionsModule = class InteractionsModule {
};
exports.InteractionsModule = InteractionsModule;
exports.InteractionsModule = InteractionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                entities_1.ContentReaction,
                entities_1.ContentComment,
                entities_1.ContentShare,
                entities_1.Project,
                entities_1.Event,
                entities_1.GalleryAlbum,
                entities_1.BlogPost,
                entities_1.Poll,
                entities_1.Notice,
            ]),
        ],
        controllers: [interactions_controller_1.InteractionsController],
        providers: [interactions_service_1.InteractionsService],
        exports: [interactions_service_1.InteractionsService],
    })
], InteractionsModule);
//# sourceMappingURL=interactions.module.js.map
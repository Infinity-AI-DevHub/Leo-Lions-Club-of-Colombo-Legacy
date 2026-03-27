"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("../entities");
const cms_controller_1 = require("./cms.controller");
const cms_service_1 = require("./cms.service");
let CmsModule = class CmsModule {
};
exports.CmsModule = CmsModule;
exports.CmsModule = CmsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                entities_1.SiteSettings,
                entities_1.HomepageContent,
                entities_1.AboutContent,
                entities_1.LeadershipMember,
                entities_1.Project,
                entities_1.Event,
                entities_1.GalleryAlbum,
                entities_1.GalleryImage,
                entities_1.MembershipContent,
                entities_1.Poll,
                entities_1.PollVote,
                entities_1.Notice,
                entities_1.BlogCategory,
                entities_1.BlogPost,
                entities_1.ContactInfo,
                entities_1.ContactLead,
                entities_1.SocialLink,
            ]),
        ],
        controllers: [cms_controller_1.CmsController],
        providers: [cms_service_1.CmsService],
        exports: [cms_service_1.CmsService],
    })
], CmsModule);
//# sourceMappingURL=cms.module.js.map
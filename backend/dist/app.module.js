"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const serve_static_1 = require("@nestjs/serve-static");
const typeorm_1 = require("@nestjs/typeorm");
const path_1 = require("path");
const entities_1 = require("./entities");
const auth_module_1 = require("./auth/auth.module");
const cms_module_1 = require("./cms/cms.module");
const upload_module_1 = require("./upload/upload.module");
const engagement_module_1 = require("./engagement/engagement.module");
const interactions_module_1 = require("./interactions/interactions.module");
const join_motivation_entities_1 = require("./join-motivation/join-motivation.entities");
const join_motivation_module_1 = require("./join-motivation/join-motivation.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: 'localhost',
                port: 8889,
                username: 'root',
                password: 'root',
                database: 'leo_lions_legacy',
                entities: [
                    entities_1.AdminUser,
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
                    entities_1.Visitor,
                    entities_1.VisitorSession,
                    entities_1.VisitorEvent,
                    entities_1.PageEngagementStat,
                    entities_1.ContentReaction,
                    entities_1.ContentComment,
                    entities_1.ContentShare,
                    join_motivation_entities_1.MotivationVisitor,
                    join_motivation_entities_1.MotivationSession,
                    join_motivation_entities_1.MotivationEvent,
                    join_motivation_entities_1.MotivationPageStat,
                ],
                synchronize: true,
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'uploads'),
                serveRoot: '/uploads',
            }),
            auth_module_1.AuthModule,
            cms_module_1.CmsModule,
            upload_module_1.UploadModule,
            engagement_module_1.EngagementModule,
            interactions_module_1.InteractionsModule,
            join_motivation_module_1.JoinMotivationModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
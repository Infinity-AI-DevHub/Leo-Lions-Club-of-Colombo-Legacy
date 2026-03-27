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
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const fs_1 = require("fs");
const path_1 = require("path");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const upload_service_1 = require("./upload.service");
function sanitizeFolder(input) {
    if (!input)
        return 'general';
    const cleaned = input
        .toLowerCase()
        .replace(/[^a-z0-9/-]/g, '')
        .replace(/\/+/g, '/')
        .replace(/^\/|\/$/g, '');
    return cleaned || 'general';
}
let UploadController = class UploadController {
    uploadService;
    constructor(uploadService) {
        this.uploadService = uploadService;
    }
    uploadImage(file, folder) {
        return {
            success: true,
            url: this.uploadService.buildPublicUrl(sanitizeFolder(folder || 'general'), file.filename),
            originalName: file.originalname,
        };
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)('image'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, _file, callback) => {
                const folder = sanitizeFolder(req.query.folder?.toString() || 'general');
                const fullPath = (0, path_1.join)(process.cwd(), 'uploads', folder);
                if (!(0, fs_1.existsSync)(fullPath)) {
                    (0, fs_1.mkdirSync)(fullPath, { recursive: true });
                }
                callback(null, fullPath);
            },
            filename: (req, file, callback) => {
                const safeFolder = sanitizeFolder(req.query.folder?.toString() || 'general');
                const baseName = file.originalname
                    .replace(/\.[^/.]+$/, '')
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '')
                    .slice(0, 40) || 'image';
                const randomName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                callback(null, `${safeFolder}-${baseName}-${randomName}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Query)('folder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "uploadImage", null);
exports.UploadController = UploadController = __decorate([
    (0, common_1.Controller)('upload'),
    __metadata("design:paramtypes", [upload_service_1.UploadService])
], UploadController);
//# sourceMappingURL=upload.controller.js.map
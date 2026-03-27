"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
let UploadService = class UploadService {
    sanitizeFolder(input) {
        if (!input)
            return 'general';
        const cleaned = input
            .toLowerCase()
            .replace(/[^a-z0-9/-]/g, '')
            .replace(/\/+/g, '/')
            .replace(/^\/|\/$/g, '');
        return cleaned || 'general';
    }
    ensureUploadPath(folder) {
        const safeFolder = this.sanitizeFolder(folder);
        const fullPath = (0, path_1.join)(process.cwd(), 'uploads', safeFolder);
        if (!(0, fs_1.existsSync)(fullPath)) {
            (0, fs_1.mkdirSync)(fullPath, { recursive: true });
        }
        return { safeFolder, fullPath };
    }
    buildPublicUrl(folder, filename) {
        const safeFolder = this.sanitizeFolder(folder);
        return `/uploads/${safeFolder}/${filename}`;
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)()
], UploadService);
//# sourceMappingURL=upload.service.js.map
import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadService {
  sanitizeFolder(input?: string) {
    if (!input) return 'general';
    const cleaned = input
      .toLowerCase()
      .replace(/[^a-z0-9/-]/g, '')
      .replace(/\/+/g, '/')
      .replace(/^\/|\/$/g, '');
    return cleaned || 'general';
  }

  ensureUploadPath(folder: string) {
    const safeFolder = this.sanitizeFolder(folder);
    const fullPath = join(process.cwd(), 'uploads', safeFolder);
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath, { recursive: true });
    }
    return { safeFolder, fullPath };
  }

  buildPublicUrl(folder: string, filename: string) {
    const safeFolder = this.sanitizeFolder(folder);
    return `/uploads/${safeFolder}/${filename}`;
  }
}

import { Controller, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UploadService } from './upload.service';

function sanitizeFolder(input?: string) {
  if (!input) return 'general';
  const cleaned = input
    .toLowerCase()
    .replace(/[^a-z0-9/-]/g, '')
    .replace(/\/+/g, '/')
    .replace(/^\/|\/$/g, '');
  return cleaned || 'general';
}

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, _file, callback) => {
          const folder = sanitizeFolder(req.query.folder?.toString() || 'general');
          const fullPath = join(process.cwd(), 'uploads', folder);
          if (!existsSync(fullPath)) {
            mkdirSync(fullPath, { recursive: true });
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
          callback(null, `${safeFolder}-${baseName}-${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File, @Query('folder') folder?: string) {
    return {
      success: true,
      url: this.uploadService.buildPublicUrl(sanitizeFolder(folder || 'general'), file.filename),
      originalName: file.originalname,
    };
  }
}

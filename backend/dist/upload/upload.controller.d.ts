import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadImage(file: Express.Multer.File, folder?: string): {
        success: boolean;
        url: string;
        originalName: string;
    };
}

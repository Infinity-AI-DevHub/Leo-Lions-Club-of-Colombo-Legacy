export declare class UploadService {
    sanitizeFolder(input?: string): string;
    ensureUploadPath(folder: string): {
        safeFolder: string;
        fullPath: string;
    };
    buildPublicUrl(folder: string, filename: string): string;
}

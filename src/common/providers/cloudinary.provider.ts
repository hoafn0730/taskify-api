import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryProvider {
    constructor(private configService: ConfigService) {
        cloudinary.config({
            cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
        });
    }

    async uploadFile(file: string | Express.Multer.File): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            const uploadPath = typeof file === 'string' ? file : file.path;
            cloudinary.uploader.upload(
                uploadPath,
                {
                    overwrite: true,
                    invalidate: true,
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) return reject(new Error(error.message));
                    resolve(result!);
                },
            );
        });
    }

    async deleteFile(publicId: string): Promise<{ result: string }> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) return reject(new Error(error.message));
                resolve(result);
            });
        });
    }

    extractPublicId(url: string): string | null {
        try {
            const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
            return match ? match[1] : null;
        } catch (error) {
            console.error('Error extracting public_id:', error);
            return null;
        }
    }
}

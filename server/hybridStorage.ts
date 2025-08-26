import { r2Storage } from "./cloudflareR2";
import { cloudflareImages } from "./cloudflareImages";
import { ObjectStorageService } from "./objectStorage";

// File size thresholds (in bytes)
const SMALL_FILE_THRESHOLD = 5 * 1024 * 1024; // 5MB
const MAX_REPLIT_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// File types that should always use Replit storage (small assets)
const REPLIT_STORAGE_TYPES = [
  'profile-picture',
  'sigil',
  'spirit-guide',
  'avatar',
  'icon'
];

// File types that should use Cloudflare Images/Stream
const CLOUDFLARE_MEDIA_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
  'video/quicktime'
];

export interface UploadResult {
  url: string;
  key?: string;
  cloudflareId?: string;
  provider: 'replit' | 'cloudflare-r2' | 'cloudflare-images' | 'cloudflare-stream';
  size: number;
  type: string;
}

export class HybridStorageService {
  private replitStorage: ObjectStorageService;

  constructor() {
    this.replitStorage = new ObjectStorageService();
  }

  /**
   * Upload a file using the most appropriate storage service
   */
  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    contentType: string,
    userId: string,
    category: string = 'general'
  ): Promise<UploadResult> {
    const fileSize = fileBuffer.length;
    const fileExtension = this.getFileExtension(fileName);

    // Small assets (profile pics, sigils, etc.) always go to Replit
    if (REPLIT_STORAGE_TYPES.includes(category) || fileSize <= SMALL_FILE_THRESHOLD) {
      try {
        const uploadUrl = await this.replitStorage.getObjectEntityUploadURL();
        
        // Upload to Replit storage
        const response = await fetch(uploadUrl, {
          method: 'PUT',
          body: fileBuffer,
          headers: {
            'Content-Type': contentType,
          },
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        const objectPath = this.replitStorage.normalizeObjectEntityPath(uploadUrl);

        return {
          url: objectPath,
          provider: 'replit',
          size: fileSize,
          type: contentType,
        };
      } catch (error) {
        console.error('Replit storage upload failed:', error);
        throw error;
      }
    }

    // Media files go to Cloudflare Images/Stream for optimization
    if (CLOUDFLARE_MEDIA_TYPES.includes(contentType)) {
      try {
        if (contentType.startsWith('image/')) {
          const result = await cloudflareImages.uploadImage(fileBuffer, {
            userId,
            category,
            originalName: fileName,
          });

          return {
            url: cloudflareImages.getOptimizedImageUrl(result.result.id),
            cloudflareId: result.result.id,
            provider: 'cloudflare-images',
            size: fileSize,
            type: contentType,
          };
        } else if (contentType.startsWith('video/')) {
          const result = await cloudflareImages.uploadVideo(fileBuffer, {
            userId,
            category,
            originalName: fileName,
          });

          return {
            url: result.result.playback.hls,
            cloudflareId: result.result.uid,
            provider: 'cloudflare-stream',
            size: fileSize,
            type: contentType,
          };
        }
      } catch (error) {
        console.error('Cloudflare media upload failed, falling back to R2:', error);
        // Fall back to R2 if Cloudflare Images/Stream fails
      }
    }

    // Large files and everything else goes to Cloudflare R2
    try {
      const key = r2Storage.generateFileKey(userId, fileExtension, category);
      const url = await r2Storage.uploadFile(fileBuffer, key, contentType);

      return {
        url,
        key,
        provider: 'cloudflare-r2',
        size: fileSize,
        type: contentType,
      };
    } catch (error) {
      console.error('Cloudflare R2 upload failed:', error);
      throw new Error('All storage providers failed');
    }
  }

  /**
   * Get a signed upload URL for direct client uploads
   */
  async getUploadUrl(
    userId: string,
    fileName: string,
    contentType: string,
    category: string = 'general'
  ): Promise<{
    uploadUrl: string;
    provider: 'replit' | 'cloudflare-r2';
    maxSize: number;
  }> {
    // Small assets use Replit storage
    if (REPLIT_STORAGE_TYPES.includes(category)) {
      const uploadUrl = await this.replitStorage.getObjectEntityUploadURL();
      return {
        uploadUrl,
        provider: 'replit',
        maxSize: MAX_REPLIT_FILE_SIZE,
      };
    }

    // Everything else uses Cloudflare R2
    const fileExtension = this.getFileExtension(fileName);
    const key = r2Storage.generateFileKey(userId, fileExtension, category);
    const uploadUrl = await r2Storage.getUploadUrl(key);

    return {
      uploadUrl,
      provider: 'cloudflare-r2',
      maxSize: 100 * 1024 * 1024, // 100MB for R2
    };
  }

  /**
   * Delete a file from the appropriate storage service
   */
  async deleteFile(fileUrl: string, cloudflareId?: string, provider?: string): Promise<void> {
    try {
      if (provider === 'cloudflare-images' && cloudflareId) {
        await cloudflareImages.deleteImage(cloudflareId);
      } else if (provider === 'cloudflare-stream' && cloudflareId) {
        await cloudflareImages.deleteVideo(cloudflareId);
      } else if (provider === 'cloudflare-r2') {
        // Extract key from URL and delete from R2
        const key = this.extractKeyFromR2Url(fileUrl);
        if (key) {
          await r2Storage.deleteFile(key);
        }
      } else if (provider === 'replit' || fileUrl.startsWith('/objects/')) {
        // Delete from Replit storage (handled by existing ACL system)
        const objectFile = await this.replitStorage.getObjectEntityFile(fileUrl);
        // Note: Replit storage deletion would need to be implemented in ObjectStorageService
        console.log('Replit storage deletion not implemented yet');
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw error;
    }
  }

  /**
   * Generate optimized image URLs for different use cases
   */
  getOptimizedImageUrl(
    imageUrl: string,
    cloudflareId?: string,
    options?: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'auto' | 'webp' | 'avif';
    }
  ): string {
    // If it's a Cloudflare Images URL, return optimized version
    if (cloudflareId && imageUrl.includes('imagedelivery.net')) {
      return cloudflareImages.getOptimizedImageUrl(cloudflareId, {
        width: options?.width,
        height: options?.height,
        quality: options?.quality || 85,
        format: options?.format || 'auto',
        fit: 'cover',
      });
    }

    // For other providers, return original URL
    return imageUrl;
  }

  /**
   * Get file extension from filename
   */
  private getFileExtension(fileName: string): string {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts.pop()!.toLowerCase() : 'bin';
  }

  /**
   * Extract storage key from Cloudflare R2 URL
   */
  private extractKeyFromR2Url(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      return pathParts.slice(1).join('/'); // Remove leading slash
    } catch {
      return null;
    }
  }

  /**
   * Determine if a file should use Replit storage based on category and size
   */
  shouldUseReplitStorage(category: string, fileSize: number): boolean {
    return REPLIT_STORAGE_TYPES.includes(category) || fileSize <= SMALL_FILE_THRESHOLD;
  }

  /**
   * Get storage provider recommendations for a file
   */
  getStorageRecommendation(
    fileName: string,
    contentType: string,
    fileSize: number,
    category: string
  ): {
    provider: 'replit' | 'cloudflare-r2' | 'cloudflare-images' | 'cloudflare-stream';
    reason: string;
  } {
    if (REPLIT_STORAGE_TYPES.includes(category)) {
      return {
        provider: 'replit',
        reason: 'Small asset category (profile pictures, sigils, etc.)',
      };
    }

    if (fileSize <= SMALL_FILE_THRESHOLD) {
      return {
        provider: 'replit',
        reason: 'File size under 5MB threshold',
      };
    }

    if (contentType.startsWith('image/') && CLOUDFLARE_MEDIA_TYPES.includes(contentType)) {
      return {
        provider: 'cloudflare-images',
        reason: 'Image file - optimized delivery and transformations',
      };
    }

    if (contentType.startsWith('video/') && CLOUDFLARE_MEDIA_TYPES.includes(contentType)) {
      return {
        provider: 'cloudflare-stream',
        reason: 'Video file - streaming optimization',
      };
    }

    return {
      provider: 'cloudflare-r2',
      reason: 'Large file or general storage',
    };
  }
}

export const hybridStorage = new HybridStorageService();
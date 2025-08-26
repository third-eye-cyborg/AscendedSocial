import fetch from "node-fetch";
import FormData from "form-data";

export interface CloudflareImageUploadResponse {
  result: {
    id: string;
    filename: string;
    uploaded: string;
    requireSignedURLs: boolean;
    variants: string[];
  };
  success: boolean;
  errors: any[];
  messages: any[];
}

export interface CloudflareStreamUploadResponse {
  result: {
    uid: string;
    thumbnail: string;
    thumbnailTimestampPct: number;
    readyToStream: boolean;
    status: {
      state: string;
      pctComplete: number;
      errorReasonCode?: string;
      errorReasonText?: string;
    };
    meta: {
      name: string;
    };
    created: string;
    modified: string;
    size: number;
    preview: string;
    allowedOrigins: string[];
    requireSignedURLs: boolean;
    uploaded: string;
    uploadExpiry?: string;
    maxSizeBytes?: number;
    maxDurationSeconds?: number;
    duration?: number;
    input: {
      width: number;
      height: number;
    };
    playback: {
      hls: string;
      dash: string;
    };
    watermark?: {
      uid: string;
    };
  };
  success: boolean;
  errors: any[];
  messages: any[];
}

// Cloudflare Images and Stream Service
export class CloudflareImagesService {
  private apiKey: string;
  private accountId: string;
  private baseUrl: string;

  constructor() {
    if (!process.env.CLOUDFLARE_IMAGES_API_KEY || !process.env.CLOUDFLARE_ACCOUNT_ID) {
      throw new Error("Missing required Cloudflare Images environment variables");
    }

    this.apiKey = process.env.CLOUDFLARE_IMAGES_API_KEY;
    this.accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    this.baseUrl = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}`;
  }

  /**
   * Upload an image to Cloudflare Images
   */
  async uploadImage(imageBuffer: Buffer, metadata?: Record<string, string>): Promise<CloudflareImageUploadResponse> {
    try {
      const formData = new FormData();
      formData.append("file", imageBuffer, "image");
      
      if (metadata) {
        Object.entries(metadata).forEach(([key, value]) => {
          formData.append(`metadata[${key}]`, value);
        });
      }

      const response = await fetch(`${this.baseUrl}/images/v1`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Cloudflare Images API error: ${response.status} ${response.statusText}`);
      }

      return await response.json() as CloudflareImageUploadResponse;
    } catch (error) {
      console.error("Error uploading image to Cloudflare:", error);
      throw new Error("Failed to upload image to Cloudflare Images");
    }
  }

  /**
   * Upload a video to Cloudflare Stream
   */
  async uploadVideo(videoBuffer: Buffer, metadata?: Record<string, string>): Promise<CloudflareStreamUploadResponse> {
    try {
      const formData = new FormData();
      formData.append("file", videoBuffer, "video");
      
      if (metadata) {
        Object.entries(metadata).forEach(([key, value]) => {
          formData.append(`meta[${key}]`, value);
        });
      }

      const response = await fetch(`${this.baseUrl}/stream`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Cloudflare Stream API error: ${response.status} ${response.statusText}`);
      }

      return await response.json() as CloudflareStreamUploadResponse;
    } catch (error) {
      console.error("Error uploading video to Cloudflare Stream:", error);
      throw new Error("Failed to upload video to Cloudflare Stream");
    }
  }

  /**
   * Get optimized image URL with transformations
   */
  getOptimizedImageUrl(imageId: string, options?: {
    width?: number;
    height?: number;
    fit?: "scale-down" | "contain" | "cover" | "crop" | "pad";
    format?: "auto" | "avif" | "webp" | "json";
    quality?: number;
  }): string {
    const baseUrl = `https://imagedelivery.net/${this.accountId}/${imageId}`;
    
    if (!options) {
      return `${baseUrl}/public`;
    }

    const params = [];
    if (options.width) params.push(`w=${options.width}`);
    if (options.height) params.push(`h=${options.height}`);
    if (options.fit) params.push(`fit=${options.fit}`);
    if (options.format) params.push(`format=${options.format}`);
    if (options.quality) params.push(`quality=${options.quality}`);

    return `${baseUrl}/${params.join(",")}`;
  }

  /**
   * Get video streaming URLs
   */
  getVideoStreamUrls(videoId: string): {
    hls: string;
    dash: string;
    thumbnail: string;
  } {
    return {
      hls: `https://customer-${this.accountId}.cloudflarestream.com/${videoId}/manifest/video.m3u8`,
      dash: `https://customer-${this.accountId}.cloudflarestream.com/${videoId}/manifest/video.mpd`,
      thumbnail: `https://customer-${this.accountId}.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg`,
    };
  }

  /**
   * Delete an image from Cloudflare Images
   */
  async deleteImage(imageId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/images/v1/${imageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete image: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error deleting image from Cloudflare:", error);
      throw new Error("Failed to delete image from Cloudflare Images");
    }
  }

  /**
   * Delete a video from Cloudflare Stream
   */
  async deleteVideo(videoId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/stream/${videoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete video: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error deleting video from Cloudflare Stream:", error);
      throw new Error("Failed to delete video from Cloudflare Stream");
    }
  }
}

export const cloudflareImages = new CloudflareImagesService();
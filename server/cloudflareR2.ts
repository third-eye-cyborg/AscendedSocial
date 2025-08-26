import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Upload } from "@aws-sdk/lib-storage";
import { randomUUID } from "crypto";

// Cloudflare R2 Storage Service
export class CloudflareR2Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    if (!process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || !process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || !process.env.CLOUDFLARE_ACCOUNT_ID) {
      throw new Error("Missing required Cloudflare R2 environment variables");
    }

    // Cloudflare R2 is S3-compatible, so we use AWS SDK
    this.s3Client = new S3Client({
      region: "auto", // R2 uses "auto" as region
      endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      },
    });

    // Default bucket name - can be configured
    this.bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || "ascended-social-storage";
  }

  /**
   * Upload a file to R2 storage
   */
  async uploadFile(file: Buffer | Uint8Array | string, key: string, contentType?: string): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file,
        ContentType: contentType || "application/octet-stream",
      });

      await this.s3Client.send(command);
      return `https://${this.bucketName}.${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`;
    } catch (error) {
      console.error("Error uploading to R2:", error);
      throw new Error("Failed to upload file to R2 storage");
    }
  }

  /**
   * Upload large files using multipart upload
   */
  async uploadLargeFile(file: Buffer | Uint8Array, key: string, contentType?: string): Promise<string> {
    try {
      const upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.bucketName,
          Key: key,
          Body: file,
          ContentType: contentType || "application/octet-stream",
        },
      });

      await upload.done();
      return `https://${this.bucketName}.${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`;
    } catch (error) {
      console.error("Error uploading large file to R2:", error);
      throw new Error("Failed to upload large file to R2 storage");
    }
  }

  /**
   * Get a signed URL for direct client uploads
   */
  async getUploadUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      console.error("Error generating upload URL:", error);
      throw new Error("Failed to generate upload URL");
    }
  }

  /**
   * Get a signed URL for file downloads
   */
  async getDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      console.error("Error generating download URL:", error);
      throw new Error("Failed to generate download URL");
    }
  }

  /**
   * Delete a file from R2 storage
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
    } catch (error) {
      console.error("Error deleting file from R2:", error);
      throw new Error("Failed to delete file from R2 storage");
    }
  }

  /**
   * Check if a file exists in R2 storage
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate a unique key for file storage
   */
  generateFileKey(userId: string, fileExtension: string, category: string = "general"): string {
    const timestamp = new Date().toISOString().split("T")[0];
    const uuid = randomUUID();
    return `users/${userId}/${category}/${timestamp}/${uuid}.${fileExtension}`;
  }

  /**
   * Generate key for visions content
   */
  generateVisionKey(userId: string, visionId: string, fileExtension: string): string {
    return `visions/${userId}/${visionId}.${fileExtension}`;
  }

  /**
   * Generate key for community content
   */
  generateCommunityKey(communityId: string, fileExtension: string): string {
    const timestamp = new Date().toISOString().split("T")[0];
    const uuid = randomUUID();
    return `communities/${communityId}/${timestamp}/${uuid}.${fileExtension}`;
  }
}

export const r2Storage = new CloudflareR2Service();
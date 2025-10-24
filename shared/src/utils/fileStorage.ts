import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const mkdir = promisify(fs.mkdir);

export interface UploadOptions {
  folder?: string;
  filename?: string;
  contentType?: string;
  isPublic?: boolean;
}

export interface UploadResult {
  url: string;
  key: string;
  size: number;
  contentType: string;
}

export interface StorageProvider {
  upload(file: Buffer, options: UploadOptions): Promise<UploadResult>;
  delete(key: string): Promise<void>;
  getSignedUrl(key: string, expiresIn?: number): Promise<string>;
}

/**
 * AWS S3 Storage Provider
 */
class S3StorageProvider implements StorageProvider {
  private s3: AWS.S3;
  private bucket: string;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1',
    });
    this.bucket = process.env.AWS_S3_BUCKET || 'amigo-learning';
  }

  async upload(file: Buffer, options: UploadOptions): Promise<UploadResult> {
    const folder = options.folder || 'uploads';
    const filename = options.filename || `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const key = `${folder}/${filename}`;

    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ContentType: options.contentType || 'application/octet-stream',
      ACL: options.isPublic ? 'public-read' : 'private',
    };

    await this.s3.putObject(params).promise();

    const url = options.isPublic
      ? `https://${this.bucket}.s3.amazonaws.com/${key}`
      : await this.getSignedUrl(key);

    return {
      url,
      key,
      size: file.length,
      contentType: options.contentType || 'application/octet-stream',
    };
  }

  async delete(key: string): Promise<void> {
    await this.s3
      .deleteObject({
        Bucket: this.bucket,
        Key: key,
      })
      .promise();
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    return this.s3.getSignedUrlPromise('getObject', {
      Bucket: this.bucket,
      Key: key,
      Expires: expiresIn,
    });
  }
}

/**
 * Local File System Storage Provider (for development)
 */
class LocalStorageProvider implements StorageProvider {
  private baseDir: string;
  private baseUrl: string;

  constructor() {
    this.baseDir = path.join(process.cwd(), 'public', 'uploads');
    this.baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // Ensure upload directory exists
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await mkdir(this.baseDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, ignore error
    }
  }

  async upload(file: Buffer, options: UploadOptions): Promise<UploadResult> {
    const folder = options.folder || 'uploads';
    const filename = options.filename || `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    
    const folderPath = path.join(this.baseDir, folder);
    await mkdir(folderPath, { recursive: true });
    
    const filePath = path.join(folderPath, filename);
    const key = `${folder}/${filename}`;

    await writeFile(filePath, file);

    const url = `${this.baseUrl}/uploads/${key}`;

    return {
      url,
      key,
      size: file.length,
      contentType: options.contentType || 'application/octet-stream',
    };
  }

  async delete(key: string): Promise<void> {
    const filePath = path.join(this.baseDir, key);
    try {
      await unlink(filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  async getSignedUrl(key: string): Promise<string> {
    // Local storage doesn't need signed URLs
    return `${this.baseUrl}/uploads/${key}`;
  }
}

/**
 * File Storage Service
 * Automatically uses S3 in production and local storage in development
 */
class FileStorageService {
  private provider: StorageProvider;

  constructor() {
    const useS3 = process.env.USE_S3_STORAGE === 'true' || process.env.NODE_ENV === 'production';
    this.provider = useS3 ? new S3StorageProvider() : new LocalStorageProvider();
    
    console.log(`Using ${useS3 ? 'S3' : 'Local'} storage provider`);
  }

  /**
   * Upload a file
   */
  async uploadFile(
    file: Buffer,
    originalFilename: string,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    const ext = path.extname(originalFilename);
    const basename = path.basename(originalFilename, ext);
    const sanitizedBasename = basename.replace(/[^a-zA-Z0-9-_]/g, '-');
    const filename = options.filename || `${sanitizedBasename}-${Date.now()}${ext}`;

    return this.provider.upload(file, {
      ...options,
      filename,
    });
  }

  /**
   * Upload course video
   */
  async uploadVideo(
    file: Buffer,
    originalFilename: string,
    courseId: string
  ): Promise<UploadResult> {
    return this.uploadFile(file, originalFilename, {
      folder: `courses/${courseId}/videos`,
      contentType: 'video/mp4',
      isPublic: false,
    });
  }

  /**
   * Upload course thumbnail
   */
  async uploadThumbnail(
    file: Buffer,
    originalFilename: string,
    courseId: string
  ): Promise<UploadResult> {
    return this.uploadFile(file, originalFilename, {
      folder: `courses/${courseId}/thumbnails`,
      contentType: 'image/jpeg',
      isPublic: true,
    });
  }

  /**
   * Upload course resource (PDF, documents, etc.)
   */
  async uploadResource(
    file: Buffer,
    originalFilename: string,
    courseId: string,
    lessonId?: string
  ): Promise<UploadResult> {
    const folder = lessonId
      ? `courses/${courseId}/lessons/${lessonId}/resources`
      : `courses/${courseId}/resources`;

    const contentType = this.getContentType(originalFilename);

    return this.uploadFile(file, originalFilename, {
      folder,
      contentType,
      isPublic: false,
    });
  }

  /**
   * Upload user avatar
   */
  async uploadAvatar(
    file: Buffer,
    originalFilename: string,
    userId: string
  ): Promise<UploadResult> {
    return this.uploadFile(file, originalFilename, {
      folder: `users/${userId}/avatar`,
      contentType: 'image/jpeg',
      isPublic: true,
    });
  }

  /**
   * Delete a file
   */
  async deleteFile(key: string): Promise<void> {
    return this.provider.delete(key);
  }

  /**
   * Get signed URL for private files
   */
  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    return this.provider.getSignedUrl(key, expiresIn);
  }

  /**
   * Get content type from filename
   */
  private getContentType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const contentTypes: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.ppt': 'application/vnd.ms-powerpoint',
      '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.mp4': 'video/mp4',
      '.mp3': 'audio/mpeg',
      '.zip': 'application/zip',
      '.txt': 'text/plain',
    };

    return contentTypes[ext] || 'application/octet-stream';
  }

  /**
   * Validate file size
   */
  validateFileSize(fileSize: number, maxSize: number): boolean {
    return fileSize <= maxSize;
  }

  /**
   * Validate file type
   */
  validateFileType(filename: string, allowedTypes: string[]): boolean {
    const ext = path.extname(filename).toLowerCase();
    return allowedTypes.includes(ext);
  }
}

// Export singleton instance
export const fileStorage = new FileStorageService();

// Export validation constants
export const FILE_SIZE_LIMITS = {
  VIDEO: 500 * 1024 * 1024, // 500MB
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  AUDIO: 50 * 1024 * 1024, // 50MB
};

export const ALLOWED_FILE_TYPES = {
  VIDEO: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'],
  IMAGE: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
  DOCUMENT: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'],
  AUDIO: ['.mp3', '.wav', '.ogg', '.m4a'],
};
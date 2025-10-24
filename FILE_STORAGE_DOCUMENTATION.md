# File Storage System Documentation

## Overview

The file storage system provides a flexible solution for managing course content including videos, images, documents, and other resources. It supports both local storage (for development) and AWS S3 (for production).

## Features

- ✅ **Multiple Storage Providers**
  - AWS S3 for production
  - Local file system for development
- ✅ **File Type Support**
  - Videos (.mp4, .avi, .mov, .wmv, .flv, .webm)
  - Images (.jpg, .jpeg, .png, .gif, .webp, .svg)
  - Documents (.pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt)
  - Audio (.mp3, .wav, .ogg, .m4a)
- ✅ **File Validation**
  - Size limits per file type
  - File type validation
  - Secure file handling
- ✅ **Signed URLs** for private content
- ✅ **Organized File Structure** by course/lesson/user
- ✅ **Automatic Content Type Detection**

## File Size Limits

| File Type | Max Size |
|-----------|----------|
| Videos | 500 MB |
| Images | 5 MB |
| Documents | 10 MB |
| Audio | 50 MB |

## Setup

### Development Setup (Local Storage)

1. **Configure environment variables** in `.env`:
   ```env
   USE_S3_STORAGE=false
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

2. **Files are stored** in `public/uploads/` directory
3. **No additional configuration required**

### Production Setup (AWS S3)

#### Step 1: Create S3 Bucket

1. Log in to AWS Console
2. Go to S3 service
3. Click "Create bucket"
4. Configure:
   - Bucket name: `amigo-learning` (or your choice)
   - Region: `us-east-1` (or your choice)
   - Block public access: Configure based on needs
   - Versioning: Enable (recommended)

#### Step 2: Create IAM User

1. Go to IAM service
2. Create new user with programmatic access
3. Attach policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::amigo-learning/*",
        "arn:aws:s3:::amigo-learning"
      ]
    }
  ]
}
```

#### Step 3: Configure Environment Variables

```env
USE_S3_STORAGE=true
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=amigo-learning
```

#### Step 4: Configure CORS (if needed)

In S3 bucket permissions, add CORS configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://yourdomain.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

## API Endpoints

### Admin Endpoints

#### Upload Video

**Endpoint:** `POST /api/upload/video`  
**Content-Type:** `multipart/form-data`  
**Access:** Admin/Instructor

**Request:**
```typescript
const formData = new FormData();
formData.append('file', videoFile);
formData.append('courseId', '507f1f77bcf86cd799439011');

const response = await fetch('/api/upload/video', {
  method: 'POST',
  body: formData,
});
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://amigo-learning.s3.amazonaws.com/courses/123/videos/video-1234567890.mp4",
    "key": "courses/123/videos/video-1234567890.mp4",
    "size": 52428800,
    "contentType": "video/mp4"
  }
}
```

---

#### Upload Thumbnail

**Endpoint:** `POST /api/upload/thumbnail`  
**Content-Type:** `multipart/form-data`  
**Access:** Admin/Instructor

**Request:**
```typescript
const formData = new FormData();
formData.append('file', imageFile);
formData.append('courseId', '507f1f77bcf86cd799439011');

const response = await fetch('/api/upload/thumbnail', {
  method: 'POST',
  body: formData,
});
```

---

#### Upload Resource

**Endpoint:** `POST /api/upload/resource`  
**Content-Type:** `multipart/form-data`  
**Access:** Admin/Instructor

**Request:**
```typescript
const formData = new FormData();
formData.append('file', documentFile);
formData.append('courseId', '507f1f77bcf86cd799439011');
formData.append('lessonId', '507f1f77bcf86cd799439012'); // Optional

const response = await fetch('/api/upload/resource', {
  method: 'POST',
  body: formData,
});
```

---

#### Delete File

**Endpoint:** `DELETE /api/files/delete`  
**Access:** Admin

**Request:**
```typescript
const response = await fetch('/api/files/delete', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    key: 'courses/123/videos/video-1234567890.mp4',
  }),
});
```

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

### User Endpoints

#### Upload Avatar

**Endpoint:** `POST /api/upload/avatar`  
**Content-Type:** `multipart/form-data`  
**Access:** Authenticated User

**Request:**
```typescript
const formData = new FormData();
formData.append('file', avatarFile);

const response = await fetch('/api/upload/avatar', {
  method: 'POST',
  headers: {
    'x-user-id': userId, // From auth token
  },
  body: formData,
});
```

---

#### Get Signed URL

**Endpoint:** `POST /api/files/signed-url`  
**Access:** Authenticated User

**Request:**
```typescript
const response = await fetch('/api/files/signed-url', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    key: 'courses/123/videos/video-1234567890.mp4',
    expiresIn: 3600, // Optional, defaults to 3600 seconds (1 hour)
  }),
});
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://amigo-learning.s3.amazonaws.com/courses/123/videos/video-1234567890.mp4?X-Amz-...",
    "expiresIn": 3600
  }
}
```

## Usage Examples

### Upload Course Video

```typescript
import { fileStorage } from '@amigo/shared';

async function uploadCourseVideo(
  videoFile: File,
  courseId: string
) {
  const bytes = await videoFile.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await fileStorage.uploadVideo(
    buffer,
    videoFile.name,
    courseId
  );

  console.log('Video uploaded:', result.url);
  return result;
}
```

### Upload Course Thumbnail

```typescript
async function uploadCourseThumbnail(
  imageFile: File,
  courseId: string
) {
  const bytes = await imageFile.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await fileStorage.uploadThumbnail(
    buffer,
    imageFile.name,
    courseId
  );

  return result;
}
```

### Upload Lesson Resource

```typescript
async function uploadLessonResource(
  file: File,
  courseId: string,
  lessonId: string
) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await fileStorage.uploadResource(
    buffer,
    file.name,
    courseId,
    lessonId
  );

  return result;
}
```

### Get Video Streaming URL

```typescript
async function getVideoStreamingUrl(videoKey: string) {
  // Get signed URL valid for 2 hours
  const url = await fileStorage.getSignedUrl(videoKey, 7200);
  return url;
}
```

### Delete File

```typescript
async function deleteCourseVideo(videoKey: string) {
  await fileStorage.deleteFile(videoKey);
  console.log('Video deleted');
}
```

## File Organization Structure

Files are organized in a logical folder structure:

```
uploads/
├── courses/
│   ├── {courseId}/
│   │   ├── videos/
│   │   │   └── video-{timestamp}.mp4
│   │   ├── thumbnails/
│   │   │   └── thumbnail-{timestamp}.jpg
│   │   ├── resources/
│   │   │   └── resource-{timestamp}.pdf
│   │   └── lessons/
│   │       └── {lessonId}/
│   │           └── resources/
│   │               └── resource-{timestamp}.pdf
├── users/
│   └── {userId}/
│       └── avatar/
│           └── avatar-{timestamp}.jpg
```

## Frontend Integration

### React Component Example

```typescript
'use client';

import { useState } from 'react';

export function VideoUpload({ courseId }: { courseId: string }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (file: File) => {
    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('courseId', courseId);

    try {
      const response = await fetch('/api/upload/video', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('Upload successful:', data.data);
        // Update course with video URL
      } else {
        console.error('Upload failed:', data.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
        disabled={uploading}
      />
      {uploading && <p>Uploading... {progress}%</p>}
    </div>
  );
}
```

### Drag & Drop Upload

```typescript
export function DragDropUpload() {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];

    if (file) {
      // Upload file
      await handleUpload(file);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={isDragging ? 'border-blue-500' : 'border-gray-300'}
    >
      Drag and drop files here
    </div>
  );
}
```

## Video Streaming

For video streaming, use signed URLs with appropriate expiration times:

```typescript
// Get streaming URL for video player
const streamingUrl = await fetch('/api/files/signed-url', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    key: videoKey,
    expiresIn: 7200, // 2 hours
  }),
}).then(res => res.json());

// Use in video player
<video src={streamingUrl.data.url} controls />
```

## Best Practices

### 1. File Validation

Always validate files before upload:

```typescript
// Check file size
if (!fileStorage.validateFileSize(file.size, FILE_SIZE_LIMITS.VIDEO)) {
  throw new Error('File too large');
}

// Check file type
if (!fileStorage.validateFileType(file.name, ALLOWED_FILE_TYPES.VIDEO)) {
  throw new Error('Invalid file type');
}
```

### 2. Progress Tracking

Implement upload progress for large files:

```typescript
const xhr = new XMLHttpRequest();
xhr.upload.addEventListener('progress', (e) => {
  const percent = (e.loaded / e.total) * 100;
  setProgress(percent);
});
```

### 3. Error Handling

Handle upload failures gracefully:

```typescript
try {
  await uploadFile(file);
} catch (error) {
  if (error.message.includes('size')) {
    // Show size error
  } else if (error.message.includes('type')) {
    // Show type error
  } else {
    // Show generic error
  }
}
```

### 4. Cleanup

Delete old files when updating:

```typescript
// When updating course thumbnail
if (course.thumbnailKey) {
  await fileStorage.deleteFile(course.thumbnailKey);
}
const newThumbnail = await fileStorage.uploadThumbnail(...);
```

### 5. Security

- Validate file types on both client and server
- Use signed URLs for private content
- Implement proper authentication
- Set appropriate CORS policies
- Use virus scanning for uploaded files (optional)

## Alternative Storage Providers

### Cloudinary

For image/video optimization:

```typescript
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload with transformation
const result = await cloudinary.uploader.upload(file, {
  folder: 'courses',
  transformation: [
    { width: 1920, height: 1080, crop: 'limit' },
    { quality: 'auto' },
  ],
});
```

### Azure Blob Storage

Alternative to S3:

```typescript
import { BlobServiceClient } from '@azure/storage-blob';

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);
```

## Troubleshooting

### Issue: Files not uploading

**Solution:**
- Check file size limits
- Verify file type is allowed
- Check network connectivity
- Verify AWS credentials (if using S3)

### Issue: Signed URLs not working

**Solution:**
- Check AWS credentials
- Verify bucket permissions
- Check CORS configuration
- Ensure file exists in S3

### Issue: Local storage not working

**Solution:**
- Check `public/uploads` directory exists
- Verify write permissions
- Check `NEXT_PUBLIC_APP_URL` is set correctly

## Future Enhancements

- [ ] Image optimization/resizing
- [ ] Video transcoding
- [ ] CDN integration
- [ ] Direct browser-to-S3 uploads
- [ ] Chunked upload for large files
- [ ] Upload resumption
- [ ] Virus scanning
- [ ] Duplicate file detection
- [ ] Batch upload support
- [ ] Upload analytics

---

**Last Updated:** October 23, 2025  
**File Storage Version:** 1.0.0
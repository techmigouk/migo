# Cloudinary Setup Guide

Complete integration for all course media (videos, images, thumbnails, project files).

## Step 1: Create Cloudinary Account

1. Go to: https://cloudinary.com/users/register_free
2. Sign up with your email
3. Verify your email
4. You'll get:
   - **Free Tier**: 25 GB storage + 25 GB bandwidth/month
   - **Credit**: 2,000 transformations/month

## Step 2: Get Your Credentials

1. Log in to Cloudinary Dashboard: https://console.cloudinary.com/
2. Go to **Dashboard** > **Account**
3. Copy these three values:
   - **Cloud Name** (e.g., `dxyz123abc`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123`)

## Step 3: Add Environment Variables

### Admin (.env.local)
Create/update `admin/.env.local`:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### Front (.env.local)
Create/update `front/.env.local`:

```env
# Cloudinary Configuration (for API routes)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### User (.env.local)
Create/update `user/.env.local`:

```env
# Cloudinary Configuration (for video playback)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
```

## Step 4: What Gets Uploaded to Cloudinary

✅ **Course Thumbnails** - Optimized images, auto-format (WebP)
✅ **Intro Videos** - Adaptive streaming (HLS), auto quality
✅ **Project Media** - Images/videos for course projects
✅ **Instructor Avatars** - Profile images
✅ **Category Icons** - Category images

## Features You Get

### For Images:
- Automatic format conversion (WebP for modern browsers)
- Responsive images (different sizes for mobile/desktop)
- Lazy loading
- CDN delivery worldwide

### For Videos:
- **Adaptive bitrate streaming** (HD, SD, auto-adjust)
- **HLS/DASH** formats for smooth playback
- **Thumbnail generation** automatic
- **Progress tracking** (resume where left off)
- **No buffering** for users
- **CDN delivery** worldwide

## Folder Structure in Cloudinary

```
techmigo/
├── courses/
│   ├── thumbnails/
│   ├── intro-videos/
│   ├── project-media/
│   └── lesson-videos/
├── instructors/
│   └── avatars/
└── categories/
    └── icons/
```

## Usage in Code

### Upload Image/Video:
```typescript
const formData = new FormData();
formData.append('file', file);
formData.append('type', 'video'); // or 'image'

const response = await fetch('/api/upload-cloudinary', {
  method: 'POST',
  body: formData,
});

const data = await response.json();
console.log('Uploaded URL:', data.url);
```

### Play Video:
```tsx
import { CldVideoPlayer } from 'next-cloudinary';

<CldVideoPlayer
  width="1920"
  height="1080"
  src={videoPublicId}
  colors={{
    accent: '#F59E0B', // Amber color to match your brand
    base: '#1F2937', // Dark gray background
    text: '#FFFFFF'
  }}
/>
```

## Free Tier Limits

- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000/month
- **Videos**: Unlimited uploads (within storage limit)

### What This Means:
- ~50 course videos (500MB each) = 25 GB storage
- ~50,000 video views/month = 25 GB bandwidth
- **Plenty for starting out!**

## When to Upgrade

Upgrade to **Advanced plan ($224/month)** when:
- You have 200+ videos
- 100,000+ monthly views
- Need advanced features (DRM, analytics)

But start with **FREE** - it's more than enough!

## Cost Calculator

Current usage estimate:
- 50 videos × 500MB = 25 GB storage ✅ FREE
- 10,000 views/month × 2.5MB = 25 GB bandwidth ✅ FREE

**You're covered for months on the free tier!**

## Next Steps

1. ✅ Sign up for Cloudinary
2. ✅ Add credentials to .env.local files
3. ✅ Restart all servers (admin, front, user)
4. ✅ Test upload in admin panel
5. ✅ Upload a test video
6. ✅ View it in user dashboard

## Support

Cloudinary Docs: https://cloudinary.com/documentation
Support: support@cloudinary.com

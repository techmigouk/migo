# Cloudinary Integration - Quick Start Guide

## ✅ What's Been Implemented

### 1. **Backend API** (`admin/app/api/upload-cloudinary/route.ts`)
- ✅ Image upload with auto-optimization (WebP, quality:auto)
- ✅ Video upload with HLS streaming (adaptive bitrate)
- ✅ Automatic folder organization (thumbnails, intro-videos, project-media)
- ✅ File type validation and size limits

### 2. **Admin UI Updates** (`admin/components/courses/course-library.tsx`)
- ✅ Intro video: Upload to Cloudinary OR paste YouTube URL
- ✅ Thumbnail: Uploads to Cloudinary (replaced Vercel Blob)
- ✅ Project media: Uploads to Cloudinary (images/videos)
- ✅ Visual indicators showing which service is being used

### 3. **User Dashboard** (`user/app/page.tsx`)
- ✅ Smart video player: Detects Cloudinary vs YouTube URLs
- ✅ Cloudinary videos: Native HTML5 player with HLS support
- ✅ YouTube videos: Iframe embed with branding reduction
- ✅ Automatic poster image generation for Cloudinary videos

---

## 🚀 Next Steps to Complete Setup

### Step 1: Get Cloudinary Credentials
1. Sign up for free: https://cloudinary.com
2. Go to Dashboard: https://cloudinary.com/console
3. Copy these values:
   - **Cloud Name** (e.g., `dxxxxxxx`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

### Step 2: Add Environment Variables
Create or update `.env.local` in each workspace:

**`admin/.env.local`**
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**`front/.env.local`**
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**`user/.env.local`**
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

### Step 3: Restart Development Servers
```powershell
# Stop all servers (Ctrl+C)
# Then restart
pnpm dev
```

---

## 📁 File Organization

Cloudinary will automatically create this structure:

```
cloudinary.com/your-cloud-name/
└── techmigo/
    └── courses/
        ├── thumbnails/          # Course thumbnail images
        ├── intro-videos/        # Course introduction videos
        └── project-media/       # Project images and videos
```

---

## 🎬 How It Works

### **Uploading Intro Videos**
Admin has 2 options:
1. **Paste YouTube URL**: Works as before, shows YouTube iframe
2. **Upload Video**: Click "Upload Video to Cloudinary" button
   - Supports: MP4, MOV, AVI, WebM (max 100MB)
   - Auto-converts to HLS for adaptive streaming
   - Users see clean HTML5 player (no branding!)

### **Uploading Thumbnails**
- Click thumbnail area to select image
- Auto-uploads to Cloudinary
- Auto-optimizes (WebP conversion, quality:auto)
- CDN-delivered for fast loading

### **Uploading Project Media**
- Supports images (PNG, JPG, WebP) and videos (MP4, MOV, etc.)
- Videos get HLS streaming
- Images get auto-optimization
- Max 50MB for videos, 5MB for images

---

## 💰 Free Tier Limits

| Resource | Free Tier | Paid Upgrade |
|----------|-----------|--------------|
| Storage | 25 GB | $0.18/GB/month |
| Bandwidth | 25 GB/month | $0.08/GB |
| Transformations | Unlimited | Unlimited |
| Video processing | Included | Included |

**Estimate for small project:**
- 100 courses × 200MB video = 20GB storage ✅ Fits in free tier
- 1000 views/month × 200MB = 200GB bandwidth ⚠️ Need paid plan (~$16/month)

---

## 🧪 Testing the Integration

### 1. **Test Video Upload**
1. Go to Admin Dashboard → Courses
2. Create or edit a course
3. Scroll to "Intro Video" section
4. Click "Upload Video to Cloudinary"
5. Select a video file (MP4 recommended)
6. Wait for upload (shows "Uploading..." then "✓ Cloudinary video uploaded")

### 2. **Test Thumbnail Upload**
1. In course form, click thumbnail area
2. Select an image
3. Should upload instantly to Cloudinary
4. Preview shows optimized image

### 3. **Test User View**
1. Save the course
2. Go to User Dashboard (http://localhost:3002)
3. Click "Enroll Now" on the course
4. Verify video plays without YouTube branding
5. For Cloudinary videos: clean HTML5 player with controls
6. For YouTube URLs: embedded iframe (some branding visible)

---

## 🐛 Troubleshooting

### "Upload failed: Invalid credentials"
- Check `.env.local` has correct API Key and Secret
- Restart dev server after adding env variables
- Verify no spaces or quotes in env values

### "Upload failed: File too large"
- Images: max 5MB
- Videos: max 100MB (free tier)
- Compress before uploading or upgrade plan

### "Video not playing"
- Check browser console for errors
- Verify video URL is accessible (try opening in new tab)
- For HLS (.m3u8), browser must support it (most modern browsers do)

### "No upload button showing"
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check admin console for JavaScript errors

---

## 🔄 Migration from Vercel Blob

**Current state:**
- Thumbnails: ✅ Now use Cloudinary
- Intro videos: ✅ Now support Cloudinary OR YouTube
- Project media: ✅ Now use Cloudinary

**Old Vercel Blob uploads:**
- Will continue to work (URLs still valid)
- Can manually re-upload to Cloudinary when editing courses
- No automatic migration needed

**If you want to migrate old uploads:**
1. Create a script to fetch all courses
2. Download files from Vercel Blob URLs
3. Re-upload to Cloudinary
4. Update course records with new URLs
5. (I can help write this script if needed!)

---

## 📊 Monitoring Usage

Check your Cloudinary dashboard:
- https://cloudinary.com/console/media_library
- View all uploaded files
- Monitor storage and bandwidth usage
- See transformation analytics

---

## 🎯 Features You Get with Cloudinary

✅ **For Videos:**
- HLS adaptive streaming (auto-adjusts quality based on connection)
- No YouTube branding or suggested videos
- Automatic format optimization (VP9, H.265)
- Thumbnail generation
- Video analytics (views, play rate)

✅ **For Images:**
- Automatic WebP/AVIF conversion
- Responsive image serving
- Quality auto-optimization
- Lazy loading support
- CDN delivery worldwide

✅ **For Admin:**
- Media library browser
- Bulk operations
- Folder organization
- Access control
- Upload presets

---

## 📝 Next Enhancements (Optional)

Want to add these features? Let me know!

1. **Video transcoding progress**: Show upload percentage
2. **Cloudinary media library widget**: Browse/select existing videos
3. **Video thumbnails**: Auto-generate multiple thumbnail options
4. **Subtitle/caption upload**: Add .vtt files for accessibility
5. **Video preview before upload**: Show video preview in admin
6. **Batch upload**: Upload multiple videos at once
7. **Advanced video editor**: Trim, crop, add watermarks in Cloudinary
8. **Usage dashboard**: Show Cloudinary usage stats in admin

---

## 🆘 Need Help?

Common questions answered in `CLOUDINARY_SETUP.md`

For detailed API reference: https://cloudinary.com/documentation/upload_videos

For pricing calculator: https://cloudinary.com/pricing

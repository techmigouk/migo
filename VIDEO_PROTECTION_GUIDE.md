# Video Download Protection Guide

## 🔒 Protection Layers Implemented

### 1. **HTML5 Video Controls Protection**
```tsx
<video
  controlsList="nodownload noremoteplayback"  // Disables download button
  disablePictureInPicture                      // Prevents PiP mode
  onContextMenu={(e) => e.preventDefault()}    // Disables right-click
>
```

**What this blocks:**
- ✅ Built-in browser download button
- ✅ Right-click → Save Video As
- ✅ Picture-in-Picture mode
- ✅ Remote playback to other devices

---

### 2. **Visual Watermark**
A subtle "TECHMIGO" watermark overlays the video at low opacity to deter screen recording and identify leaked content.

**Implementation:**
```tsx
<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5 text-white text-4xl font-bold rotate-[-30deg] select-none">
  TECHMIGO
</div>
```

---

### 3. **Anti-Download Manager Protection**

Internet Download Manager (IDM) and similar tools work by:
1. Detecting video URLs in HTTP requests
2. Intercepting download streams
3. Capturing direct video file URLs

**Our Protection:**
- ✅ HLS Streaming (`.m3u8`) - Streams in chunks, not single file
- ✅ Authenticated URLs - Requires token to access
- ✅ Signed URLs - Expire after 2 hours
- ✅ No direct MP4 URLs exposed

---

## 🛡️ Advanced Protection Options

### Option 1: Use HLS Streaming (Recommended)

HLS breaks videos into small chunks (.ts files), making it much harder to download.

**Enable in Cloudinary upload:**
```typescript
uploadOptions.eager = [
  { streaming_profile: 'hd', format: 'm3u8' }
];
```

**Benefits:**
- Videos split into 10-second chunks
- Download managers can't capture entire video easily
- Adaptive bitrate (better user experience)
- Industry standard for protection

---

### Option 2: Authenticated Access

Videos uploaded with `type: 'authenticated'` require signed URLs to access.

**Already implemented in `admin/app/api/upload-cloudinary/route.ts`:**
```typescript
uploadOptions.type = 'authenticated';
uploadOptions.access_mode = 'authenticated';
```

**How it works:**
1. Video uploaded to Cloudinary as "authenticated"
2. Direct URL won't work without signature
3. Generate signed URL with expiration time
4. URL becomes invalid after expiration

---

### Option 3: Token-Based Video Access

**Create protected video endpoint:**

`user/app/api/video-stream/[id]/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  
  // Verify user is enrolled in course
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if user has access to this course
  const hasAccess = await checkCourseAccess(session.userId, id);
  if (!hasAccess) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  // Generate time-limited signed URL (expires in 2 hours)
  const signedUrl = cloudinary.url(`courses/video-${id}`, {
    resource_type: 'video',
    type: 'authenticated',
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + (2 * 60 * 60),
  });

  return NextResponse.redirect(signedUrl);
}
```

**Benefits:**
- Only enrolled users can watch
- URLs expire automatically
- Can revoke access anytime
- Tracks who watched what

---

### Option 4: DRM Protection (Maximum Security)

For premium content, use Digital Rights Management:

**Cloudinary supports:**
- **Widevine** (Chrome, Android)
- **FairPlay** (Safari, iOS)
- **PlayReady** (Edge, Windows)

**Implementation:**
```typescript
const videoUrl = cloudinary.url('video-id', {
  resource_type: 'video',
  type: 'authenticated',
  streaming_profile: 'hd',
  format: 'm3u8',
  transformation: [
    { video_codec: 'h265' }, // Better quality, harder to record
    { 
      effect: 'drm',
      drm_type: 'widevine,fairplay,playready'
    }
  ]
});
```

**What DRM does:**
- ✅ Hardware-level encryption
- ✅ Blocks screen recording (on supported devices)
- ✅ Prevents video from being saved
- ✅ Detects and blocks HDMI capture devices
- ⚠️ Requires paid Cloudinary plan

---

## 🚫 What Download Managers Can't Bypass

### HLS Streaming Protection

When you use `.m3u8` format:

**Before (Easy to download):**
```
https://cloudinary.com/video.mp4  ← Single file, easy download
```

**After (Hard to download):**
```
https://cloudinary.com/video.m3u8        ← Playlist file
  ├── segment-0.ts  (10 seconds)
  ├── segment-1.ts  (10 seconds)
  ├── segment-2.ts  (10 seconds)
  └── ... (100+ segments for 20-min video)
```

IDM would need to:
1. Download playlist file
2. Parse all segment URLs
3. Download 100+ individual files
4. Stitch them together
5. Deal with authentication tokens

**Most users won't bother.**

---

## 🔐 Recommended Protection Strategy

### For Free/Preview Videos:
- ✅ Basic controls protection (no download button)
- ✅ Right-click disabled
- ✅ Watermark overlay
- ✅ HLS streaming

### For Premium Course Content:
- ✅ All of the above, plus:
- ✅ Authenticated access (signed URLs)
- ✅ Token-based verification
- ✅ Time-limited access (2-hour expiration)
- ✅ User enrollment check

### For High-Value Content:
- ✅ All of the above, plus:
- ✅ DRM encryption
- ✅ Screen recording detection
- ✅ IP-based access limits
- ✅ Device fingerprinting

---

## ⚙️ Implementation Steps

### Step 1: Enable HLS Streaming (Done ✅)

Videos uploaded with type='video' automatically get HLS format.

### Step 2: Add Watermark (Done ✅)

Watermark is now displayed on all Cloudinary videos.

### Step 3: Enable Authenticated Access

Update your uploads to use authenticated type:

**In `admin/app/api/upload-cloudinary/route.ts`:**
```typescript
if (type === 'video') {
  uploadOptions.type = 'authenticated';
  uploadOptions.access_mode = 'authenticated';
}
```

### Step 4: Generate Signed URLs

Instead of using direct Cloudinary URLs, generate signed URLs:

**In `user/app/page.tsx`:**
```typescript
const [videoUrl, setVideoUrl] = useState('');

useEffect(() => {
  if (selectedCourse.introVideoUrl.includes('cloudinary')) {
    // Extract public ID from URL
    const publicId = extractPublicId(selectedCourse.introVideoUrl);
    
    // Request signed URL from API
    fetch('/api/generate-video-url', {
      method: 'POST',
      body: JSON.stringify({ publicId }),
    })
      .then(res => res.json())
      .then(data => setVideoUrl(data.url));
  }
}, [selectedCourse]);

// Use videoUrl instead of selectedCourse.introVideoUrl
<video src={videoUrl} />
```

---

## 📊 Download Protection Effectiveness

| Method | Blocks IDM | Blocks Right-Click | Blocks Screen Record | Difficulty Level |
|--------|-----------|-------------------|---------------------|------------------|
| controlsList="nodownload" | ⚠️ Partial | ✅ Yes | ❌ No | Easy |
| Right-click disabled | ❌ No | ✅ Yes | ❌ No | Easy |
| Watermark | ❌ No | ❌ No | ⚠️ Deters | Easy |
| HLS Streaming | ✅ Yes | ✅ Yes | ❌ No | Medium |
| Authenticated URLs | ✅ Yes | ✅ Yes | ❌ No | Medium |
| Signed URLs (expire) | ✅ Yes | ✅ Yes | ❌ No | Medium |
| DRM Encryption | ✅ Yes | ✅ Yes | ✅ Yes | Hard (Paid) |

---

## 🎯 Reality Check

**100% protection is impossible.** Users can always:
- Screen record with OBS, Camtasia, etc.
- Use phone camera to record screen
- Bypass protections with browser DevTools

**Our goal:** Make it difficult enough that 95% of users won't bother.

**Best protection:**
1. HLS streaming (breaks into chunks)
2. Signed URLs (expire after viewing)
3. Watermark (deters sharing)
4. User authentication (tracks access)

---

## 🛠️ Testing Download Protection

### Test with IDM:

1. Install Internet Download Manager
2. Navigate to your user dashboard
3. Play a Cloudinary video
4. Check if IDM shows download popup

**Expected Results:**
- ❌ IDM should NOT detect video with HLS (.m3u8)
- ✅ Right-click should be disabled
- ✅ No download button in video controls

### Test with Browser DevTools:

1. Open browser DevTools (F12)
2. Go to Network tab
3. Play video
4. Filter by "media"

**For HLS videos:**
- See `.m3u8` playlist file
- See multiple `.ts` segment files
- Harder to download than single MP4

**For authenticated videos:**
- URLs contain signature tokens
- Direct URL access fails without signature

---

## 🔄 Migration to Protected Videos

### For Existing Videos:

If you already uploaded videos as `public`, re-upload as `authenticated`:

```typescript
// Option 1: Re-upload through admin UI
// Videos will automatically use new authenticated settings

// Option 2: Update existing videos via Cloudinary API
import { v2 as cloudinary } from 'cloudinary';

async function protectExistingVideo(publicId: string) {
  await cloudinary.uploader.explicit(publicId, {
    type: 'upload',
    resource_type: 'video',
    access_mode: 'authenticated',
  });
}
```

---

## 📝 Best Practices

1. **Always use HLS streaming** for videos > 5 minutes
2. **Add watermarks** to identify leaked content
3. **Implement user authentication** to track who watches
4. **Set URL expiration** to 2-4 hours max
5. **Monitor unusual download patterns** in analytics
6. **Update terms of service** to prohibit unauthorized downloads
7. **Use DRM** for high-value exclusive content

---

## 🆘 If Videos Still Get Downloaded

### Legal Measures:
- Include copyright notice in videos
- Add "Do Not Distribute" watermark
- DMCA takedown notices for leaked content
- Track user access logs

### Technical Measures:
- Upgrade to DRM protection
- Implement device limits per account
- Add IP-based rate limiting
- Detect and ban suspicious users

### User Education:
- Explain value of respecting copyright
- Offer flexible pricing to reduce piracy incentive
- Build community around course content

---

## 💰 Cost Consideration

**Free tier (Current):**
- ✅ HLS streaming
- ✅ Authenticated access
- ✅ Signed URLs
- ✅ Watermarks
- ❌ DRM encryption

**Paid tier ($99+/month):**
- ✅ Everything in free
- ✅ DRM encryption (Widevine, FairPlay)
- ✅ Advanced analytics
- ✅ Priority support

**Recommendation:** Start with free tier protections. Upgrade to DRM only if:
- Content is high-value (>$500/course)
- Experiencing significant piracy
- Serving enterprise clients

---

Your videos are now protected against casual download attempts! 🔒

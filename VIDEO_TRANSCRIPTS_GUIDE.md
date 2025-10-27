# Video Transcripts & Subtitles Setup Guide

## 🎯 Overview

Your Cloudinary video player now supports subtitles/captions automatically. When you upload a video, you can also upload a matching `.vtt` (WebVTT) file for transcripts.

---

## 📝 What Are VTT Files?

VTT (Web Video Text Tracks) files contain timed text for video subtitles, captions, or transcripts.

**Example: `intro-video.vtt`**
```vtt
WEBVTT

00:00:00.000 --> 00:00:05.000
Welcome to this comprehensive course on web development.

00:00:05.000 --> 00:00:10.000
In this course, you'll learn React, Next.js, and TypeScript.

00:00:10.000 --> 00:00:15.000
We'll build real-world projects together step by step.
```

---

## 🚀 How to Add Transcripts to Your Videos

### Option 1: Auto-Generate with AI (Recommended)

Use AI tools to automatically transcribe your videos:

#### **1. Using Cloudinary (Built-in)**
```javascript
// When uploading video to Cloudinary, enable auto-transcription
const formData = new FormData();
formData.append('file', videoFile);
formData.append('type', 'video');
formData.append('generate_subtitles', 'true'); // Enable auto-transcription

// Cloudinary will generate VTT file automatically
// Access at: https://res.cloudinary.com/your-cloud/video/upload/your-video.vtt
```

#### **2. Using OpenAI Whisper API**
```javascript
const openai = require('openai');

async function transcribeVideo(videoFile) {
  const transcription = await openai.audio.transcriptions.create({
    file: videoFile,
    model: "whisper-1",
    response_format: "vtt"
  });
  
  return transcription; // Returns VTT format
}
```

#### **3. Using Online Tools (Free)**

**YouTube Auto-Captions:**
1. Upload video to YouTube (unlisted)
2. Wait for auto-captions to generate
3. Download as `.vtt` file
4. Upload to Cloudinary with same filename

**Rev.com** (Paid, $1.50/min):
- https://www.rev.com/automated-transcription
- Upload video → Get VTT in 5 minutes
- Very accurate

**Otter.ai** (Free tier available):
- https://otter.ai
- 600 minutes/month free
- Export as VTT

**Happy Scribe** (Free trial):
- https://www.happyscribe.com
- Auto-transcribe and export VTT

---

### Option 2: Manual VTT Creation

Create VTT files manually using these tools:

**Subtitle Edit** (Free, Windows/Mac/Linux):
- Download: https://www.nikse.dk/subtitleedit
- Import video → Type captions → Export as VTT

**Aegisub** (Free, Cross-platform):
- Download: https://aegisub.org
- Professional subtitle editor

**Online VTT Creator**:
- https://www.happyscribe.com/subtitle-tools/online-subtitle-editor
- https://subtitletools.com/subtitle-editor

---

## 📤 Uploading VTT Files to Cloudinary

### Method 1: Upload with Same Filename

When you upload a video, also upload the VTT file with the same name:

```
Video: intro-video.mp4 → https://cloudinary.com/.../intro-video.mp4
VTT:   intro-video.vtt → https://cloudinary.com/.../intro-video.vtt
```

The video player automatically looks for `.vtt` files with matching names.

### Method 2: API Upload

Update the Cloudinary upload API to handle VTT files:

```typescript
// In admin/app/api/upload-cloudinary/route.ts
if (file.type === 'text/vtt' || fileName.endsWith('.vtt')) {
  const result = await cloudinary.uploader.upload(buffer, {
    resource_type: 'raw',
    folder: 'techmigo/courses/subtitles',
    public_id: fileName.replace('.vtt', ''),
    format: 'vtt'
  });
}
```

---

## 🎨 VTT Format Guide

### Basic Structure
```vtt
WEBVTT

[Timestamp] --> [Timestamp]
[Caption text]

[Blank line before next caption]
```

### Example with Styling
```vtt
WEBVTT

NOTE This is a comment

00:00:00.000 --> 00:00:03.000
<v Instructor>Hello and welcome!</v>

00:00:03.000 --> 00:00:06.000 line:90% position:50%
This is positioned text

00:00:06.000 --> 00:00:10.000
<c.highlight>Important point:</c>
Multiple lines are supported
```

### Timestamp Format
- `HH:MM:SS.mmm` (hours:minutes:seconds.milliseconds)
- Examples:
  - `00:00:00.000` (start)
  - `00:01:30.500` (1 min 30.5 seconds)
  - `01:15:45.000` (1 hour 15 min 45 sec)

---

## 🔧 Integration with Admin Dashboard

### Step 1: Add VTT Upload Field

Update `admin/components/courses/course-library.tsx`:

```tsx
// Add state for VTT file
const [subtitleFile, setSubtitleFile] = useState<string>('')

// Add upload handler
const handleSubtitleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return
  
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', 'subtitle')
  
  const response = await fetch('/api/upload-cloudinary', {
    method: 'POST',
    body: formData,
  })
  
  const data = await response.json()
  if (data.success) {
    setSubtitleFile(data.url)
    alert('Subtitle uploaded successfully!')
  }
}

// Add UI below video upload
<div className="mt-3">
  <Label className="text-gray-300">Subtitles/Captions (Optional)</Label>
  <input
    type="file"
    accept=".vtt,.srt"
    onChange={handleSubtitleUpload}
    className="mt-2"
  />
  {subtitleFile && (
    <p className="text-xs text-green-500 mt-1">✓ Subtitles uploaded</p>
  )}
</div>
```

### Step 2: Update Course Model

Add subtitle field to Course schema:

```typescript
// In shared/src/models/Course.ts
{
  introVideoUrl: { type: String },
  introVideoSubtitles: { type: String }, // VTT file URL
}
```

### Step 3: Update Video Player

The player is already configured to look for VTT files automatically!

---

## 🎬 Automatic Transcription Workflow

### Full Automation with Cloudinary

1. **Upload video** to Cloudinary
2. **Trigger transcription** using Cloudinary AI
3. **Auto-generate VTT** from transcription
4. **Store VTT URL** in database
5. **Display in video player** automatically

**Implementation:**

```typescript
// admin/app/api/upload-cloudinary/route.ts
async function uploadVideoWithTranscription(file: File) {
  // 1. Upload video
  const videoResult = await cloudinary.uploader.upload(file, {
    resource_type: 'video',
    folder: 'techmigo/courses/intro-videos',
    eager: [
      { streaming_profile: 'hd', format: 'm3u8' },
      { 
        transcription: { 
          language: 'en',
          format: 'vtt'
        }
      }
    ]
  });
  
  // 2. Get transcription URL
  const vttUrl = videoResult.eager[1].url;
  
  return {
    videoUrl: videoResult.secure_url,
    subtitleUrl: vttUrl
  };
}
```

---

## 🎨 Enhanced Video Player Features

Your video player now has:

✅ **HD Quality Indicator** - Shows when hovering
✅ **Subtitle Support** - Automatic VTT detection
✅ **Smooth Gradients** - Professional appearance
✅ **Caption Toggle** - Built-in browser controls
✅ **Multiple Languages** - Support for multiple VTT tracks
✅ **Mobile Optimized** - Works on all devices

---

## 🧪 Testing Subtitles

### Test VTT File

Create `test-subtitles.vtt`:

```vtt
WEBVTT

00:00:00.000 --> 00:00:05.000
This is a test subtitle.

00:00:05.000 --> 00:00:10.000
If you can see this, subtitles are working!

00:00:10.000 --> 00:00:15.000
Great job setting up your video player!
```

### Upload and Test

1. Upload a test video to Cloudinary
2. Upload the VTT file with the same base name
3. View course in user dashboard
4. Click the **CC** button in video controls
5. Select "English" to enable subtitles

---

## 📊 Subtitle Best Practices

### 1. **Timing**
- Keep captions on screen 1-5 seconds
- Sync with audio precisely
- Leave 0.5s gap between captions

### 2. **Text Length**
- Max 2 lines per caption
- Max 42 characters per line
- Break at natural pauses

### 3. **Readability**
- Use sentence case
- Add speaker names for clarity: `<v Speaker>`
- Describe important sounds: `[music playing]`

### 4. **Accessibility**
- Include sound effects: `[door closes]`
- Indicate tone: `[sarcastically]`
- Describe music: `[upbeat jazz music]`

---

## 🔄 Converting SRT to VTT

If you have `.srt` files (common format), convert to VTT:

### Online Converter
- https://subtitletools.com/convert-to-vtt-online
- Upload SRT → Download VTT

### Command Line (FFmpeg)
```bash
ffmpeg -i subtitles.srt subtitles.vtt
```

### JavaScript Conversion
```javascript
function srtToVtt(srtContent) {
  return 'WEBVTT\n\n' + srtContent
    .replace(/\{\\.*?\}/g, '')
    .replace(/\d\n/g, '')
    .replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2');
}
```

---

## 💡 Advanced: Multiple Language Support

Support multiple subtitle languages:

```html
<video controls>
  <source src="video.mp4" type="video/mp4" />
  
  <!-- English subtitles (default) -->
  <track kind="subtitles" src="video-en.vtt" srclang="en" label="English" default />
  
  <!-- Spanish subtitles -->
  <track kind="subtitles" src="video-es.vtt" srclang="es" label="Español" />
  
  <!-- French subtitles -->
  <track kind="subtitles" src="video-fr.vtt" srclang="fr" label="Français" />
</video>
```

Users can switch languages from the CC menu!

---

## 🆘 Troubleshooting

### Subtitles Not Showing

**Check 1: File exists**
- Verify VTT file uploaded to Cloudinary
- Check URL is accessible (open in browser)

**Check 2: CORS headers**
- Cloudinary automatically handles CORS
- VTT file must be on same domain or allow cross-origin

**Check 3: VTT format**
- Must start with `WEBVTT`
- Check timestamps are valid
- Validate at: https://quuz.org/webvtt/

**Check 4: Browser support**
- All modern browsers support VTT
- Enable captions via CC button in player controls

### Common VTT Errors

```vtt
❌ WRONG
00:00:00 --> 00:00:05
Missing milliseconds

✅ CORRECT
00:00:00.000 --> 00:00:05.000
Includes .000 milliseconds
```

---

## 🎁 Bonus: AI-Powered Transcript Generation API

Want to auto-generate transcripts when videos are uploaded? I can help you:

1. Integrate OpenAI Whisper API
2. Auto-generate VTT files on upload
3. Store alongside videos in Cloudinary
4. Display in player automatically

Let me know if you want this feature! 🚀

---

## 📚 Resources

- **VTT Specification**: https://www.w3.org/TR/webvtt1/
- **Cloudinary Video Docs**: https://cloudinary.com/documentation/video_manipulation_and_delivery
- **WebVTT Validator**: https://quuz.org/webvtt/
- **Subtitle Edit Tool**: https://www.nikse.dk/subtitleedit
- **OpenAI Whisper**: https://platform.openai.com/docs/guides/speech-to-text

---

Your video player is now ready for professional subtitle support! 🎉

# AI Auto-Transcription Setup Guide

## 🤖 Automatic Subtitle Generation with OpenAI Whisper

Your platform now supports **AI-powered automatic subtitle generation**! When you upload a video, you can click a button to automatically generate subtitles.

---

## 🚀 Setup Steps

### 1. Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the API key (starts with `sk-...`)

### 2. Add API Key to Environment Variables

Add to `admin/.env.local`:

```env
# OpenAI API Key for Whisper transcription
OPENAI_API_KEY=sk-your-api-key-here
```

### 3. Restart Admin Server

```powershell
cd c:\Users\CCMendel\migo\admin
pnpm dev
```

---

## 🎬 How to Use

### In Admin Dashboard:

1. **Upload a video** to a course (or use existing Cloudinary video)
2. You'll see a new button: **"🤖 Generate AI Subtitles (Whisper)"**
3. Click the button
4. Wait 1-5 minutes (depending on video length)
5. Subtitles automatically uploaded to Cloudinary!

### Subtitle File Location:

Subtitles are saved in Cloudinary at:
```
techmigo/courses/subtitles/[video-public-id].vtt
```

They'll automatically load when users watch the video!

---

## 💰 Pricing

**OpenAI Whisper API:**
- **$0.006 per minute** of audio
- Example: 10-minute video = $0.06
- Example: 1-hour course = $0.36

**Very affordable** for professional transcription!

**Free alternatives:**
- YouTube auto-captions (upload to YouTube, download VTT)
- AssemblyAI (also has API, $0.00025/min for basic tier)

---

## ✨ Features

### What You Get:

✅ **Automatic speech-to-text** transcription
✅ **WebVTT format** (ready for HTML5 video)
✅ **Timestamps** synchronized with video
✅ **High accuracy** (OpenAI Whisper is industry-leading)
✅ **Multiple languages** supported (90+ languages)
✅ **Automatic upload** to Cloudinary
✅ **One-click generation** from admin dashboard

### Language Support:

Change the language in `admin/app/api/generate-transcription/route.ts`:

```typescript
const transcription = await openai.audio.transcriptions.create({
  file: videoFile,
  model: 'whisper-1',
  response_format: 'vtt',
  language: 'es', // Spanish
  // language: 'fr', // French
  // language: 'de', // German
  // language: 'auto', // Auto-detect
});
```

Supported languages: English, Spanish, French, German, Italian, Portuguese, Dutch, Polish, Russian, Japanese, Chinese, Korean, Arabic, Hindi, and 80+ more!

---

## 🎨 How It Works

### Behind the Scenes:

1. **Admin clicks "Generate Subtitles"**
   - Video URL sent to `/api/generate-transcription`

2. **API downloads video from Cloudinary**
   - Fetches the MP4 file

3. **Sends to OpenAI Whisper API**
   - OpenAI processes audio
   - Returns VTT file with timestamps

4. **Uploads VTT to Cloudinary**
   - Saves in `subtitles/` folder
   - Same filename as video

5. **User watches video**
   - Video player automatically finds `.vtt` file
   - Captions available via CC button

---

## 📝 Manual VTT Upload (Alternative)

Don't want to use AI? You can manually upload VTT files:

### 1. Create VTT File

```vtt
WEBVTT

00:00:00.000 --> 00:00:05.000
Welcome to this course!

00:00:05.000 --> 00:00:10.000
In this lesson, we'll learn about...

00:00:10.000 --> 00:00:15.000
Let's get started!
```

### 2. Upload to Cloudinary

Use Cloudinary dashboard or API to upload the `.vtt` file with the same name as your video.

---

## 🔧 Advanced Configuration

### Longer Videos (>25MB):

OpenAI Whisper has a 25MB file size limit. For longer videos:

**Option 1: Compress video before transcription**
```typescript
// In generate-transcription API
// Add video compression step
```

**Option 2: Extract audio only**
```typescript
// Convert MP4 to MP3 first
// Send smaller audio file to Whisper
```

**Option 3: Split into chunks**
```typescript
// Split long video into segments
// Transcribe each segment
// Merge VTT files
```

### Custom Prompts:

Improve accuracy with custom prompts:

```typescript
const transcription = await openai.audio.transcriptions.create({
  file: videoFile,
  model: 'whisper-1',
  response_format: 'vtt',
  language: 'en',
  prompt: 'This is a web development course. Technical terms: React, Next.js, TypeScript, MongoDB, API, Cloudinary.',
});
```

The prompt helps Whisper understand technical terms and jargon.

---

## 🐛 Troubleshooting

### "File size too large"
- Compress video before upload
- Or extract audio only (MP3) and transcribe that

### "API key invalid"
- Check `.env.local` has correct `OPENAI_API_KEY`
- Restart admin server after adding env variable
- Verify key starts with `sk-`

### "Transcription failed"
- Check video URL is accessible (try opening in browser)
- Verify video format is supported (MP4, MOV, AVI)
- Check OpenAI API quota/billing

### Subtitles not showing
- Check VTT file was uploaded to Cloudinary
- Verify VTT filename matches video filename
- Click CC button in video player to enable captions

---

## 📊 Batch Processing

Want to generate subtitles for all courses at once?

### Create Batch Script:

```typescript
// scripts/generate-all-subtitles.ts
async function generateAllSubtitles() {
  const courses = await CourseModel.find({ introVideoUrl: { $exists: true } });
  
  for (const course of courses) {
    if (course.introVideoUrl.includes('cloudinary')) {
      console.log(`Generating subtitles for: ${course.title}`);
      
      await fetch('/api/generate-transcription', {
        method: 'POST',
        body: JSON.stringify({ videoUrl: course.introVideoUrl }),
      });
      
      // Wait 30 seconds between requests to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  }
  
  console.log('All subtitles generated!');
}
```

---

## 🎁 Bonus Features

### Add Translation:

After generating English subtitles, translate to other languages:

```typescript
// Use OpenAI to translate VTT
const translation = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [{
    role: 'user',
    content: `Translate this VTT subtitle to Spanish:\n\n${vttContent}`
  }]
});
```

### Add Speaker Labels:

```typescript
// Generate with speaker identification
response_format: 'verbose_json', // Instead of vtt
// Then parse JSON and add speaker labels
```

### Custom Styling:

Edit VTT files to add styling:

```vtt
WEBVTT

STYLE
::cue {
  background-color: rgba(0,0,0,0.8);
  color: white;
  font-size: 1.2em;
}

00:00:00.000 --> 00:00:05.000
<c.highlight>Important point!</c>
```

---

## 🎯 Best Practices

1. **Generate subtitles AFTER uploading video** (not during)
2. **Review AI-generated subtitles** for accuracy (especially technical terms)
3. **Edit VTT files** if needed before publishing
4. **Use custom prompts** for better accuracy with jargon
5. **Keep videos under 1 hour** for faster processing
6. **Test captions** before publishing course

---

## 🆘 Support

- **OpenAI Whisper Docs**: https://platform.openai.com/docs/guides/speech-to-text
- **VTT Format Spec**: https://www.w3.org/TR/webvtt1/
- **Cloudinary Video Docs**: https://cloudinary.com/documentation/video_manipulation_and_delivery

---

Your videos now have professional AI-generated subtitles! 🎉

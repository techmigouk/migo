# 📝 Transcript Feature - Testing Guide

## ✅ Fixed Issues

1. **Subtitle URL Construction**: Now properly constructs Cloudinary subtitle URLs
2. **Public ID Extraction**: Extracts video public ID from both `cloudinary://` and HTTPS URLs
3. **Track Elements**: Only renders `<track>` elements when subtitle URL exists
4. **Error Handling**: Gracefully handles missing subtitle files (won't break video playback)

---

## 🧪 How to Test

### Step 1: Upload a Video

1. Go to **Admin Dashboard** → **Courses** → **Add/Edit Course**
2. Upload a video using "Upload Video to Cloudinary" button
3. Note the video URL (should be Cloudinary URL)

### Step 2: Add Transcript (Choose One Method)

#### Method A: Upload Text Transcript (FREE)
1. Click the **"📝 Upload Text"** button
2. Paste your transcript in the prompt
3. Wait for success message

**Example Plain Text:**
```
Welcome to this course on web development!
Today we'll learn about React and Next.js.
Let's start by understanding components.
First, we need to set up our environment.
Then we'll create our first component.
```

**Example Timestamped Text:**
```
[00:00] Welcome to this course on web development!
[00:05] Today we'll learn about React and Next.js.
[00:12] Let's start by understanding components.
[00:20] First, we need to set up our environment.
[00:30] Then we'll create our first component.
```

#### Method B: AI Auto-Generate (Requires OpenAI API Key)
1. Click the **"🤖 AI Auto-Generate"** button
2. Confirm the dialog
3. Wait 1-5 minutes for processing
4. Get success message with subtitle URL

### Step 3: View on User Dashboard

1. Go to **User Dashboard** (http://localhost:3001 or your deployed URL)
2. Find the course with the video
3. Click to preview/view the course
4. Play the video
5. Look for **CC** (Closed Captions) button in video controls
6. Click CC button to enable/disable subtitles

---

## 🔍 Debugging

### Check if Subtitle Exists in Cloudinary

**URL Pattern:**
```
https://res.cloudinary.com/{cloudName}/raw/upload/techmigo/courses/subtitles/{publicId}.vtt
```

**Example:**
```
Video URL: https://res.cloudinary.com/ddy4ffmlp/video/upload/intro-react-course.mp4
Subtitle URL: https://res.cloudinary.com/ddy4ffmlp/raw/upload/techmigo/courses/subtitles/intro-react-course.vtt
```

**Test in Browser:**
1. Copy the subtitle URL
2. Paste in browser address bar
3. Should download/show the .vtt file
4. If 404 error → subtitle not uploaded correctly

### Check Browser Console

Open browser console (F12) and look for:
- ✅ `Subtitle file not found (optional): https://...` - Normal if no subtitle exists
- ❌ Other errors - May indicate a problem

### Verify VTT File Format

A valid VTT file should look like this:

```vtt
WEBVTT

00:00:00.000 --> 00:00:05.000
Welcome to this course on web development!

00:00:05.000 --> 00:00:12.000
Today we'll learn about React and Next.js.

00:00:12.000 --> 00:00:20.000
Let's start by understanding components.
```

### Common Issues

**❌ Issue: CC button doesn't appear**
- Solution: Subtitle file doesn't exist or URL is wrong
- Check: Open subtitle URL in browser to verify it exists

**❌ Issue: Subtitles don't show when CC is enabled**
- Solution: VTT file format may be incorrect
- Check: Download the .vtt file and verify format

**❌ Issue: "Upload Text" button does nothing**
- Solution: Check browser console for errors
- Check: Make sure you entered text in the prompt

**❌ Issue: AI generation fails**
- Solution: Add `OPENAI_API_KEY` to `admin/.env.local`
- Check: Verify API key is correct and has credits

---

## 📂 File Locations

### Cloudinary Folder Structure
```
techmigo/
  courses/
    videos/
      intro-react-course.mp4
      intro-python-course.mp4
    subtitles/
      intro-react-course.vtt
      intro-python-course.vtt
```

### API Endpoints

**Upload Text Transcript:**
```
POST /api/upload-transcript
Body: {
  text: "Your transcript here...",
  publicId: "video-public-id",
  format: "plain" | "timestamped",
  segmentDuration: 5
}
```

**AI Generate Subtitles:**
```
POST /api/generate-transcription
Body: {
  videoUrl: "https://...",
  publicId: "video-public-id"
}
```

---

## 🎨 Subtitle Customization

### Change Caption Duration (Plain Text Mode)

Edit `segmentDuration` parameter (default: 5 seconds):

```typescript
// In upload-transcript API call
body: JSON.stringify({ 
  text: text.trim(),
  publicId,
  format: 'plain',
  segmentDuration: 7  // Change from 5 to 7 seconds
})
```

### Change Caption Styling

Subtitles use browser's default styling. To customize, add CSS to VTT file:

```vtt
WEBVTT

STYLE
::cue {
  background-color: rgba(0, 0, 0, 0.9);
  color: #FFD700;
  font-size: 1.5em;
  font-family: Arial, sans-serif;
}

00:00:00.000 --> 00:00:05.000
Welcome to this course!
```

### Add Multiple Language Tracks

Update the video player to include multiple languages:

```tsx
<track
  kind="subtitles"
  src={getSubtitleUrl(videoUrl, 'en')}
  srcLang="en"
  label="English"
/>
<track
  kind="subtitles"
  src={getSubtitleUrl(videoUrl, 'es')}
  srcLang="es"
  label="Spanish"
/>
```

---

## ✨ Tips for Best Results

### For Manual Transcripts:

1. **Use timestamped format** for precise control:
   ```
   [00:00] First caption
   [00:05] Second caption
   ```

2. **Keep captions short** (1-2 lines max per timestamp)

3. **Time important moments** accurately

### For AI Transcripts:

1. **Ensure clear audio** - background noise reduces accuracy

2. **Use technical prompts** if video contains jargon:
   ```typescript
   prompt: 'Web development course. Terms: React, Next.js, TypeScript, API'
   ```

3. **Review and edit** generated subtitles before publishing

---

## 📊 Quick Reference

| Feature | Button | Time | Cost |
|---------|--------|------|------|
| Upload Text (Plain) | 📝 Upload Text | Instant | FREE |
| Upload Text (Timestamped) | 📝 Upload Text | Instant | FREE |
| AI Auto-Generate | 🤖 AI Auto-Generate | 1-5 min | $0.006/min |

---

## 🆘 Still Not Working?

1. **Check Cloudinary dashboard** - Verify subtitle file exists in `techmigo/courses/subtitles/`
2. **Check browser console** - Look for CORS or 404 errors
3. **Test subtitle URL directly** - Open in browser to verify it exists
4. **Verify public ID** - Make sure it matches between video and subtitle
5. **Try different browser** - Some browsers have better subtitle support

---

Your transcript feature is now fully functional! 🎉

import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Convert plain text transcript to WebVTT format
 * @param text - Plain text transcript
 * @param segmentDuration - Duration in seconds for each caption segment (default: 5)
 */
function convertTextToVTT(text: string, segmentDuration: number = 5): string {
  const lines = text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  let vttContent = 'WEBVTT\n\n';
  let currentTime = 0;

  for (const line of lines) {
    // Estimate duration based on text length (roughly 150 words per minute)
    const wordCount = line.split(' ').length;
    const estimatedDuration = Math.max(segmentDuration, (wordCount / 150) * 60);

    const startTime = formatTime(currentTime);
    const endTime = formatTime(currentTime + estimatedDuration);

    vttContent += `${startTime} --> ${endTime}\n${line}\n\n`;

    currentTime += estimatedDuration;
  }

  return vttContent;
}

/**
 * Format seconds to WebVTT timestamp (HH:MM:SS.mmm)
 */
function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
}

/**
 * Parse custom timestamped format like:
 * [00:00] First line
 * [00:05] Second line
 */
function parseTimestampedText(text: string): string {
  const lines = text.split('\n').filter(line => line.trim());
  let vttContent = 'WEBVTT\n\n';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const timestampMatch = line.match(/^\[(\d{2}):(\d{2})\]\s*(.+)$/);

    if (timestampMatch) {
      const [, minutes, seconds, caption] = timestampMatch;
      const startSeconds = parseInt(minutes) * 60 + parseInt(seconds);

      // Calculate end time (next timestamp or +5 seconds)
      let endSeconds = startSeconds + 5;
      if (i + 1 < lines.length) {
        const nextMatch = lines[i + 1].match(/^\[(\d{2}):(\d{2})\]/);
        if (nextMatch) {
          endSeconds = parseInt(nextMatch[1]) * 60 + parseInt(nextMatch[2]);
        }
      }

      const startTime = formatTime(startSeconds);
      const endTime = formatTime(endSeconds);

      vttContent += `${startTime} --> ${endTime}\n${caption}\n\n`;
    }
  }

  return vttContent;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, publicId, format = 'plain', segmentDuration = 5 } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Transcript text is required' },
        { status: 400 }
      );
    }

    if (!publicId) {
      return NextResponse.json(
        { error: 'Video public ID is required' },
        { status: 400 }
      );
    }

    // Convert text to VTT based on format
    let vttContent: string;
    if (format === 'timestamped') {
      // Format: [00:00] Text here
      vttContent = parseTimestampedText(text);
    } else {
      // Plain text - auto-generate timestamps
      vttContent = convertTextToVTT(text, segmentDuration);
    }

    // Upload VTT to Cloudinary
    const uploadResponse = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'techmigo/courses/subtitles',
          public_id: publicId,
          format: 'vtt',
          overwrite: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(Buffer.from(vttContent));
    });

    const subtitleUrl = uploadResponse.secure_url;

    return NextResponse.json({
      success: true,
      subtitleUrl,
      message: 'Transcript uploaded successfully!',
      format: format === 'timestamped' ? 'timestamped' : 'auto-timed',
    });
  } catch (error: any) {
    console.error('Transcript upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload transcript' },
      { status: 500 }
    );
  }
}

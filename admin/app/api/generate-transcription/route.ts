import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { videoUrl, publicId } = await request.json();

    if (!videoUrl) {
      return NextResponse.json(
        { success: false, error: 'No video URL provided' },
        { status: 400 }
      );
    }

    console.log('Generating transcription for:', videoUrl);

    // Download the video from Cloudinary
    const videoResponse = await fetch(videoUrl);
    const videoBlob = await videoResponse.blob();
    
    // Convert blob to File object (OpenAI requires File type)
    const videoFile = new File([videoBlob], 'video.mp4', { type: 'video/mp4' });

    // Generate transcription using OpenAI Whisper
    console.log('Calling OpenAI Whisper API...');
    const transcription = await openai.audio.transcriptions.create({
      file: videoFile,
      model: 'whisper-1',
      response_format: 'vtt', // WebVTT format
      language: 'en', // Change this based on your needs
    });

    console.log('Transcription generated successfully');

    // Upload VTT file to Cloudinary
    const vttFileName = publicId ? `${publicId}.vtt` : 'subtitle.vtt';
    
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          public_id: vttFileName,
          folder: 'techmigo/courses/subtitles',
          format: 'vtt',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(Buffer.from(transcription));
    });

    const result = uploadResult as any;

    return NextResponse.json({
      success: true,
      subtitleUrl: result.secure_url,
      transcription: transcription,
      message: 'Subtitles generated and uploaded successfully!',
    });

  } catch (error: any) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate transcription' },
      { status: 500 }
    );
  }
}

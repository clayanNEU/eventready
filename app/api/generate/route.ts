import { NextRequest, NextResponse } from 'next/server';
import { generateFlyer } from '@/lib/fal-client';
import { readData } from '@/lib/data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventName, date, time, location, theme, referenceFlyerId } = body;

    // Get brand data
    const data = readData();
    const brand = data.brand;

    // Build the prompt
    const colorString = brand.colors.join(', ');
    let prompt = `Create a professional event flyer for "${eventName}".
Event Details:
- Date: ${date}
- Time: ${time}
- Location: ${location}
- Theme/Vibe: ${theme}

Brand Style: ${brand.style}
Brand Colors: ${colorString}

The design should be eye-catching, modern, and perfect for social media sharing (Instagram, Partiful).
Include clear, readable text with the event name prominently displayed.
${referenceFlyerId ? 'Maintain the overall design aesthetic and layout of the reference image while updating it with the new event details.' : 'Create a bold, energetic design that captures attention.'}`;

    // Get reference flyer if specified
    let referenceImageUrl: string | undefined;
    if (referenceFlyerId) {
      const referenceFlyer = data.flyers.find(f => f.id === referenceFlyerId);
      if (referenceFlyer) {
        const imageUrl = referenceFlyer.imageUrl;

        // Check if it's a data URL (base64) - FLUX doesn't support these
        if (imageUrl.startsWith('data:')) {
          console.warn('Reference image is a data URL, skipping reference feature');
          // Don't use reference - just enhance the prompt with style notes
          if (referenceFlyer.notes) {
            prompt += `\n\nStyle inspiration: ${referenceFlyer.notes}`;
          }
        } else if (imageUrl.startsWith('http')) {
          // Already absolute URL
          referenceImageUrl = imageUrl;
        } else {
          // Convert relative path to absolute URL
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
          referenceImageUrl = `${baseUrl}${imageUrl}`;
        }
      }
    }

    // Generate flyer using FLUX
    const result = await generateFlyer({
      prompt,
      referenceImageUrl,
      seed: brand.seed,
      imageSize: 'portrait_4_3',
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error generating flyer:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate flyer' },
      { status: 500 }
    );
  }
}

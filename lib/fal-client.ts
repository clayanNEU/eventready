import { fal } from '@fal-ai/client';

export interface GenerateFlyerInput {
  prompt: string;
  referenceImageUrl?: string;
  imageSize?: 'portrait_4_3' | 'portrait_16_9' | 'square_hd';
  seed?: number;
}

export async function generateFlyer(input: GenerateFlyerInput) {
  const apiKey = process.env.FAL_API_KEY;
  if (!apiKey) {
    throw new Error('FAL_API_KEY environment variable is not set');
  }

  // Configure the fal client
  fal.config({
    credentials: apiKey,
  });

  // If we have a reference image, use edit-image endpoint
  if (input.referenceImageUrl) {
    const result = await fal.subscribe('fal-ai/alpha-image-232/edit-image', {
      input: {
        prompt: input.prompt,
        image_url: input.referenceImageUrl,
        image_size: input.imageSize || 'portrait_4_3',
        seed: input.seed,
        enable_prompt_expansion: true,
      },
    });
    return result;
  }

  // Otherwise use text-to-image endpoint
  const result = await fal.subscribe('fal-ai/alpha-image-232/text-to-image', {
    input: {
      prompt: input.prompt,
      image_size: input.imageSize || 'portrait_4_3',
      seed: input.seed,
      enable_prompt_expansion: true,
    },
  });
  return result;
}

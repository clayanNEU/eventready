import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'logo' or 'flyer'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Try to save to filesystem (works locally)
    try {
      const ext = file.name.split('.').pop();
      const filename = `${uuidv4()}.${ext}`;
      const uploadDir = type === 'logo' ? 'logos' : 'flyers';
      const dirPath = path.join(process.cwd(), 'public', 'uploads', uploadDir);
      const filepath = path.join(dirPath, filename);

      // Ensure directory exists
      await mkdir(dirPath, { recursive: true });
      await writeFile(filepath, buffer);

      const url = `/uploads/${uploadDir}/${filename}`;
      return NextResponse.json({ url });
    } catch (fsError) {
      // Filesystem write failed (e.g., on Vercel) - use data URL instead
      console.warn('File write failed, using data URL:', fsError);

      // Convert to base64 data URL
      const base64 = buffer.toString('base64');
      const mimeType = file.type || 'image/png';
      const dataUrl = `data:${mimeType};base64,${base64}`;

      return NextResponse.json({ url: dataUrl });
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}

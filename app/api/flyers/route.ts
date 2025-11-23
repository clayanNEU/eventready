import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data.flyers);
  } catch (error) {
    console.error('Error reading flyers:', error);
    return NextResponse.json({ error: 'Failed to read flyers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = readData();

    const newFlyer = {
      id: uuidv4(),
      imageUrl: body.imageUrl,
      isFavorite: body.isFavorite || false,
      eventName: body.eventName,
      date: body.date,
      notes: body.notes || '',
      createdAt: new Date().toISOString(),
    };

    data.flyers.push(newFlyer);
    writeData(data);

    return NextResponse.json(newFlyer);
  } catch (error) {
    console.error('Error creating flyer:', error);
    return NextResponse.json({ error: 'Failed to create flyer' }, { status: 500 });
  }
}

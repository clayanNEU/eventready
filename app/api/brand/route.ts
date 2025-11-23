import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data.brand);
  } catch (error) {
    console.error('Error reading brand data:', error);
    return NextResponse.json({ error: 'Failed to read brand data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = readData();

    data.brand = {
      ...data.brand,
      ...body,
    };

    writeData(data);
    return NextResponse.json(data.brand);
  } catch (error) {
    console.error('Error updating brand data:', error);
    return NextResponse.json({ error: 'Failed to update brand data' }, { status: 500 });
  }
}

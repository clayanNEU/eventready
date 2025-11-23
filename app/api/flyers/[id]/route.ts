import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = readData();

    const flyerIndex = data.flyers.findIndex(f => f.id === id);
    if (flyerIndex === -1) {
      return NextResponse.json({ error: 'Flyer not found' }, { status: 404 });
    }

    data.flyers[flyerIndex] = {
      ...data.flyers[flyerIndex],
      ...body,
    };

    writeData(data);
    return NextResponse.json(data.flyers[flyerIndex]);
  } catch (error) {
    console.error('Error updating flyer:', error);
    return NextResponse.json({ error: 'Failed to update flyer' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = readData();

    data.flyers = data.flyers.filter(f => f.id !== id);
    writeData(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting flyer:', error);
    return NextResponse.json({ error: 'Failed to delete flyer' }, { status: 500 });
  }
}

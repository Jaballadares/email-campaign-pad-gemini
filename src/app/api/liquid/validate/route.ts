import { NextResponse } from 'next/server';
import { Liquid } from 'liquidjs';

const engine = new Liquid();

export async function POST(request: Request) {
  const { content } = await request.json();

  try {
    await engine.parse(content);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

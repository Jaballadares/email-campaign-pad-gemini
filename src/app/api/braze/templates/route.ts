
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function PUT(request: Request) {
  const { content } = await request.json();

  const BRAZE_API_KEY = process.env.BRAZE_API_KEY;
  const BRAZE_TEMPLATE_ID = process.env.BRAZE_TEMPLATE_ID;
  const BRAZE_API_ENDPOINT = 'https://rest.iad-05.braze.com';

  if (!BRAZE_API_KEY || !BRAZE_TEMPLATE_ID) {
    return NextResponse.json({ success: false, error: 'Braze API key or template ID not configured.' }, { status: 500 });
  }

  try {
    await axios.put(
      `${BRAZE_API_ENDPOINT}/email/templates/${BRAZE_TEMPLATE_ID}`,
      {
        html_body: content,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${BRAZE_API_KEY}`,
        },
      }
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Braze API Error:', error.response?.data || error.message);
    return NextResponse.json({ success: false, error: 'Failed to update Braze template.' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { addJob } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { supplier, itemCount } = body;

    if (!supplier || typeof itemCount !== 'number') {
      return NextResponse.json(
        { error: 'Invalid payload. Required: supplier (string), itemCount (number)' },
        { status: 400 }
      );
    }

    const newJob = addJob(supplier, itemCount);

    return NextResponse.json({ success: true, job: newJob });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

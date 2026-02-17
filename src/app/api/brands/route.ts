import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ApiResponse } from '@/lib/types';

const brandSchema = z.object({
  name: z.string().min(1).max(100),
  domain: z.string().optional(),
  description: z.string().max(500).optional(),
  keywords: z.array(z.string()).default([]),
});

// In production, these would be stored in Firestore
// This is a placeholder that demonstrates the API contract
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = brandSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const brand = {
      id: crypto.randomUUID(),
      ...parsed.data,
      userId: 'demo-user', // Replace with auth user ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json<ApiResponse>({
      success: true,
      data: brand,
      message: 'Brand created successfully',
    });
  } catch (error) {
    console.error('[Brands API] Error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Placeholder - in production, fetch from Firestore for authenticated user
  return NextResponse.json<ApiResponse>({
    success: true,
    data: [],
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { getUsers } from '@/app/(main)/master-data/pengguna/data/action';
import { auth } from '@/lib/auth';
import type { ExtendedAPIError } from '@/types/error';
import type { User } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;
    const sortBy = searchParams.get('sortBy') || undefined;
    let sortDirection = searchParams.get('sortDirection') || undefined;
    if (sortDirection !== 'asc' && sortDirection !== 'desc') {
      sortDirection = undefined;
    }
    const role = searchParams.get('role') || undefined;
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    const { users, total } = await getUsers({
      limit,
      offset,
      sortBy,
      sortDirection,
      role,
      status,
      email: search,
      name: search,
    });

    return NextResponse.json({
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role, username } = body;

    // 🧩 Validasi input dasar
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // 🚀 Create user via BetterAuth
    const result = await auth.api.createUser({
      body: {
        email,
        password,
        name,
        role: role || 'user',
        data: {
          username,
        },
      },
    });

    if ('error' in result) {
      const errorResponse: ExtendedAPIError = {
        ...result,
        code: 'CREATE_USER_FAILED',
        timestamp: new Date().toISOString(),
      };

      return NextResponse.json(errorResponse, {
        status: 400,
      });
    }

    // ✅ Jika sukses
    return NextResponse.json(result, { status: 201 });
  } catch (authError) {
    console.error('Auth API error:', authError);
    return NextResponse.json(
      { error: 'Authentication service error' },
      { status: 500 }
    );
  }
}

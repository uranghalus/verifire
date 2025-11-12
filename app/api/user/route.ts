import { NextRequest, NextResponse } from 'next/server';
import { getUsers } from '@/app/(main)/master-data/pengguna/data/action';

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
    const search = searchParams.get('search') || undefined; // Terima parameter search

    // Pass all filters and sort to getUsers
    const { users, total } = await getUsers({
      limit,
      offset,
      sortBy,
      sortDirection,
      role,
      status,
      email: search, // Search bisa untuk email
      name: search, // Dan juga untuk name
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

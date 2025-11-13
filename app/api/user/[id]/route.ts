import { auth } from '@/lib/auth';
import { authClient } from '@/lib/auth-client';
import prisma from '@/lib/prisma';
import { ExtendedAPIError } from '@/types/error';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// LINK Update
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await context.params; // ✅ FIX di sini
    const body = await request.json();
    const { name, email, role } = body;

    // Validasi
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const validRoles = ['admin', 'superadmin', 'inspektor', 'manager', 'user'];
    if (role && !validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const data = await auth.api.adminUpdateUser({
      body: {
        userId,
        data: { name, email, role },
      },
      headers: await headers(),
      asResponse: true,
    });
    console.log('Better Auth update result:', data);
    if (!data) {
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'User updated successfully',
      user: { id: userId, name, email, role },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
// LINK Delete
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    console.log('Deleting user with ID:', userId);

    if (!userId) {
      const errorResponse: ExtendedAPIError = {
        message: 'User ID is required',
        code: 'VALIDATION_ERROR',
        timestamp: new Date().toISOString(),
      };

      return NextResponse.json(errorResponse, {
        status: 400,
      });
    }

    // Implementasi delete user dengan Better Auth
    try {
      const result = await auth.api.removeUser({
        body: {
          userId: userId,
        },
        headers: await headers(),
      });

      console.log('Better Auth delete response:', result);

      if ('error' in result) {
        const errorResponse: ExtendedAPIError = {
          message:
            typeof result.error === 'string'
              ? result.error
              : 'Failed to delete user',
          code: 'DELETE_USER_FAILED',
          timestamp: new Date().toISOString(),
          details: result as Record<string, unknown>,
        };

        return NextResponse.json(errorResponse, {
          status: 400,
        });
      }

      // Juga hapus data terkait di Prisma (opsional)
      try {
        await prisma.account.deleteMany({
          where: { userId },
        });

        await prisma.session.deleteMany({
          where: { userId },
        });

        console.log('Related data deleted successfully');
      } catch (dbError) {
        console.warn('Warning: Could not delete related data:', dbError);
        // Continue even if related data deletion fails
      }

      return NextResponse.json({
        message: 'User deleted successfully',
        deletedUserId: userId,
      });
    } catch (authError) {
      console.error('Auth API error:', authError);

      const errorResponse: ExtendedAPIError = {
        message: 'Authentication service error',
        code: 'AUTH_SERVICE_ERROR',
        timestamp: new Date().toISOString(),
        details: {
          message:
            authError instanceof Error
              ? authError.message
              : 'Unknown auth error',
        },
      };

      return NextResponse.json(errorResponse, {
        status: 500,
      });
    }
  } catch (error) {
    console.error('Error deleting user:', error);

    const errorResponse: ExtendedAPIError = {
      message: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
      timestamp: new Date().toISOString(),
      details: {
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    };

    return NextResponse.json(errorResponse, {
      status: 500,
    });
  }
}

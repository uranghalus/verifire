import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// Extended Error Interface
interface ExtendedAPIError {
  error: string;
  code: string;
  timestamp: string;
  details?: unknown;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params adalah Promise
) {
  try {
    const { id: userId } = await params; // ✅ Unwrap params
    const body = await request.json();
    const { banned, banReason, banExpiresIn } = body;

    if (!userId) {
      const errorResponse: ExtendedAPIError = {
        error: 'User ID is required',
        code: 'VALIDATION_ERROR',
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (banned) {
      // ✅ Ban user
      try {
        const result = await auth.api.banUser({
          body: {
            userId,
            banReason: banReason || 'No reason provided',
            banExpiresIn: banExpiresIn || 60 * 60 * 24 * 7, // default: 7 hari
          },
          headers: await headers(),
        });

        if ('error' in result) {
          const errorResponse: ExtendedAPIError = {
            error: (result.error as string) || 'Failed to ban user',
            code: 'BAN_USER_FAILED',
            timestamp: new Date().toISOString(),
            details: result.error,
          };
          return NextResponse.json(errorResponse, { status: 400 });
        }

        return NextResponse.json({
          message: 'User banned successfully',
        });
      } catch (authError) {
        console.error('Ban user error:', authError);
        const errorResponse: ExtendedAPIError = {
          error: 'Authentication service error during ban',
          code: 'AUTH_SERVICE_ERROR',
          timestamp: new Date().toISOString(),
          details:
            authError instanceof Error ? authError.message : 'Unknown error',
        };
        return NextResponse.json(errorResponse, { status: 500 });
      }
    } else {
      // ✅ Unban user
      try {
        const result = await auth.api.unbanUser({
          body: {
            userId,
          },
          headers: await headers(),
        });

        if ('error' in result) {
          const errorResponse: ExtendedAPIError = {
            error: (result.error as string) || 'Failed to unban user',
            code: 'UNBAN_USER_FAILED',
            timestamp: new Date().toISOString(),
            details: result.error,
          };
          return NextResponse.json(errorResponse, { status: 400 });
        }

        return NextResponse.json({
          message: 'User unbanned successfully',
        });
      } catch (authError) {
        console.error('Unban user error:', authError);
        const errorResponse: ExtendedAPIError = {
          error: 'Authentication service error during unban',
          code: 'AUTH_SERVICE_ERROR',
          timestamp: new Date().toISOString(),
          details:
            authError instanceof Error ? authError.message : 'Unknown error',
        };
        return NextResponse.json(errorResponse, { status: 500 });
      }
    }
  } catch (error) {
    console.error('Error in ban/unban route:', error);
    const errorResponse: ExtendedAPIError = {
      error: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
      timestamp: new Date().toISOString(),
      details: error instanceof Error ? error.message : 'Unknown error',
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

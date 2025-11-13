import { APIError as BetterAuthAPIError } from 'better-auth';

export type ExtendedAPIError = Partial<BetterAuthAPIError> & {
  code?: string;
  timestamp?: string;
  details?: Record<string, unknown>;
};

import { AuthError } from '@supabase/supabase-js';

export function handleAuthError(error: Error | AuthError) {
  if (error instanceof AuthError) {
    switch (error.status) {
      case 500:
        console.error('Database connection error. Retrying...', error);
        // Implement exponential backoff retry
        return;
      case 400:
        if (error.message.includes('schema')) {
          console.error('Schema initialization error:', error);
          // Could trigger schema reinitialization here
        }
        break;
      default:
        console.error('Auth error:', error);
    }
  }
}

export function isAuthError(error: any): error is AuthError {
  return error && error.__isAuthError === true;
}
import { supabase } from '../supabase';
import { FallbackDataProvider } from './fallback';

const fallback = FallbackDataProvider.getInstance();

export async function checkConnection(): Promise<boolean> {
  try {
    // First check if we can connect to Supabase
    const { data, error } = await supabase.auth.getSession();

    if (error && error.message !== 'Auth session missing!') {
      console.error('Connection check failed:', error);
      return false;
    }

    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Connection check failed:', error.message);
    } else {
      console.error('Connection check failed with unknown error');
    }
    return false;
  }
}

let onlineStatus = true;

export function getConnectionStatus(): boolean {
  return onlineStatus;
}

export function setConnectionStatus(status: boolean): void {
  onlineStatus = status;
}

export async function getDataProvider() {
  const isOnline = await checkConnection();
  setConnectionStatus(isOnline);
  return isOnline ? supabase : fallback;
}
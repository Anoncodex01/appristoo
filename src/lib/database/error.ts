import { PostgrestError } from '@supabase/supabase-js';

export async function handleError(error: PostgrestError): Promise<void> {
  console.error('Database error:', error);

  if (error.code === '42P01') { // Table doesn't exist
    console.log('Attempting to initialize schema...');
    await initializeSchema();
    return;
  }

  throw error;
}

async function initializeSchema(): Promise<void> {
  const maxRetries = 3;
  const baseDelay = 1000;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/init_schema`,
        {
          method: 'POST',
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          }
        }
      );

      if (response.ok) {
        console.log('Schema initialized successfully');
        return;
      }

      const delay = baseDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    } catch (e) {
      console.error(`Schema initialization attempt ${i + 1} failed:`, e);
      if (i === maxRetries - 1) throw e;
    }
  }
}
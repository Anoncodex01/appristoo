import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';


async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function signIn(email: string, password: string) {
  const normalizedEmail = email?.toLowerCase().trim();
  
  if (!normalizedEmail || !password) {
    throw new Error('Email and password are required');
  }

  try {
    let retries = 3;
    let lastError;

    while (retries > 0) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password
      });
    
      if (error) {
        lastError = error;
        retries--;
        if (retries > 0) {
          await delay(1000);
          continue;
        }
        break;
      }

      return data;
    }

    throw new Error('An error occurred during sign in. Please try again.');
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error('An error occurred during sign out. Please try again.');
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error && error.name !== 'AuthSessionMissingError') {
    console.error('Error getting current user:', error);
  }
  
  return user;
}

export async function setupInitialAdmin() {
  try {
    const { data: { user: existingUser } } = await supabase.auth.getUser();
    if (existingUser) {
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: 'admin@apristo.com',
      password: 'admin123',
      options: {
        data: { role: 'ADMIN' }
      }
    });

    if (error) throw error;
    if (!data.user) throw new Error('Failed to create admin user');

    await delay(1000); // Wait for auth to settle

    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: data.user.id,
        role: 'ADMIN'
      });

    if (roleError) throw roleError;
  } catch (error) {
    console.error('Error in setupInitialAdmin:', error);
    throw error;
  }
}
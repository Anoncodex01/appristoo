import { supabase } from '../lib/supabase';

export interface CreateUserData {
  email: string;
  password: string;
  role: 'ADMIN' | 'EDITOR';
}

export interface User {
  id: string;
  email: string;
  role?: string;
}

export async function createUser(data: CreateUserData): Promise<void> {
  const { data: { user }, error: signUpError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password
  });

  if (signUpError) throw signUpError;
  if (!user) throw new Error('Failed to create user');

  const { error: roleError } = await supabase
    .from('user_roles')
    .insert({
      user_id: user.id,
      role: data.role
    });

  if (roleError) throw roleError;
}

export async function getUsers(): Promise<User[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Check if user is admin
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (roleData?.role !== 'ADMIN') {
    throw new Error('Unauthorized - Admin access required');
  }

  const { data: users, error } = await supabase
    .from('user_roles')
    .select(`
      user_id,
      role,
      users:user_id (
        email
      )
    `);

  if (error) throw error;

  return users.map(u => ({
    id: u.user_id,
    email: u.users.email,
    role: u.role
  }));
}

export async function getCurrentUserRole(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (error) return null;
  return data.role;
}

export async function updateUserRole(userId: string, role: 'ADMIN' | 'EDITOR') {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('user_roles')
    .upsert({
      user_id: userId,
      role,
      created_by: user.id
    }, {
      onConflict: 'user_id'
    });

  if (error) throw error;
}
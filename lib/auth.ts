import { createClient } from './supabase/server';

export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

export async function isAdmin() {
  try {
    const user = await getCurrentUser();
    if (!user) return false;

    // Check if user email is in admin list
    const adminEmails = process.env.ADMIN_EMAIL?.split(',').map(email => email.trim().toLowerCase()) || [];
    const userEmail = (user.email || '').toLowerCase();
    return adminEmails.includes(userEmail);
  } catch (error) {
    console.error('Failed to check admin status:', error);
    return false;
  }
}

export async function requireAdmin() {
  const isAdminUser = await isAdmin();
  if (!isAdminUser) {
    throw new Error('Unauthorized: Admin access required');
  }
}


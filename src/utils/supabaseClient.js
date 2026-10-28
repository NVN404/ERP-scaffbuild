import { createClient } from '@supabase/supabase-js';

// Configuration keys
const STORAGE_URL_KEY = 'scaffbuild_supabase_url';
const STORAGE_KEY_KEY = 'scaffbuild_supabase_anon_key';

// User's default project credentials
const DEFAULT_URL = 'https://broslcfmpukjnfdcyfxx.supabase.co';
const DEFAULT_KEY = 'sb_publishable_oKUV9G9SpjjdKpxso7IkHw_Q4EbTcoi';

// Default / fallback values (from env or stored in localStorage or default project)
export function getSupabaseConfig() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_URL_KEY) || '' : '';
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_KEY) || '' : '';

  const url = storedUrl || envUrl || DEFAULT_URL;
  const anonKey = storedKey || envKey || DEFAULT_KEY;

  const isConfigured = Boolean(url && anonKey && url.startsWith('http'));

  return { url, anonKey, isConfigured };
}

export function saveSupabaseConfig({ url, anonKey }) {
  if (typeof window !== 'undefined') {
    if (url) localStorage.setItem(STORAGE_URL_KEY, url.trim());
    else localStorage.removeItem(STORAGE_URL_KEY);

    if (anonKey) localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
    else localStorage.removeItem(STORAGE_KEY_KEY);
  }
  initSupabaseClient();
}

let supabaseInstance = null;

export function initSupabaseClient() {
  const { url, anonKey, isConfigured } = getSupabaseConfig();
  if (isConfigured) {
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        }
      });
      return supabaseInstance;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      supabaseInstance = null;
    }
  }
  supabaseInstance = null;
  return null;
}

// Initial instance
initSupabaseClient();

export function getSupabase() {
  if (!supabaseInstance) {
    initSupabaseClient();
  }
  return supabaseInstance;
}

// Test connection
export async function testSupabaseConnection(testUrl, testKey) {
  const url = testUrl || getSupabaseConfig().url;
  const key = testKey || getSupabaseConfig().anonKey;
  if (!url || !key) return { success: false, message: 'URL and Anon Key are required.' };

  try {
    const tempClient = createClient(url, key);
    const { data, error } = await tempClient.auth.getSession();
    if (error && error.status !== 400 && !error.message?.includes('session')) {
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Connected successfully to Supabase Auth & Database!' };
  } catch (err) {
    return { success: false, message: err.message || 'Connection failed. Check your Supabase URL.' };
  }
}

// Fetch profile row from public.profiles table
export async function fetchUserProfile(userId) {
  const client = getSupabase();
  if (!client || !userId) return null;
  try {
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) return null;
    return data;
  } catch (e) {
    return null;
  }
}

// Helper to map Supabase Auth User object & profiles table row into the App's User format
export function mapSupabaseUserToAppUser(user, profileRow = null) {
  if (!user) return null;
  const meta = user.user_metadata || {};
  const role = profileRow?.role || meta.role || 'client';

  let avatar = '🏢';
  if (role === 'owner') avatar = '👑';
  if (role === 'worker') avatar = '👷';

  return {
    id: user.id,
    authId: user.id,
    email: profileRow?.email || user.email,
    role: role, // 'owner', 'client', 'worker'
    name: profileRow?.name || meta.name || user.email?.split('@')[0] || 'User',
    title: meta.title || (role === 'owner' ? 'Managing Director' : role === 'client' ? 'Site Procurement Head' : 'Site Foreman'),
    companyName: profileRow?.company_name || meta.companyName || (role === 'owner' ? 'ScaffBuild Shuttering & Scaffolding' : 'Client Construction Co.'),
    phone: profileRow?.phone || meta.phone || user.phone || '',
    gstin: profileRow?.gstin || meta.gstin || '',
    trade: profileRow?.trade || meta.trade || (role === 'worker' ? 'Shuttering Foreman' : ''),
    workerCode: profileRow?.worker_code || meta.workerCode || (role === 'worker' ? `WRK-${user.id.slice(0, 4).toUpperCase()}` : ''),
    avatar: avatar,
    skills: meta.skills || (role === 'worker' ? ['Slab Staging', 'Cuplock Erection'] : []),
    sites: meta.sites || (role === 'client' ? [
      {
        id: `site_${user.id.slice(0, 5)}`,
        name: meta.initialSiteName || 'Main Construction Site',
        location: meta.initialSiteLocation || 'City Project Yard',
        city: 'Mumbai',
        state: 'Maharashtra',
        siteEngineer: profileRow?.name || meta.name || 'Site In-Charge',
        phone: profileRow?.phone || meta.phone || '',
        active: true,
        slabAreaSqft: 12000
      }
    ] : []),
    assignedSites: meta.assignedSites || (role === 'worker' ? ['Main Construction Site'] : [])
  };
}

// Sign Up with Role and Profile Metadata
export async function signUpUser({ email, password, role, name, phone, companyName, gstin, trade, siteName, siteLocation }) {
  const client = getSupabase();
  if (!client) {
    throw new Error('Supabase is not configured. Please enter your Supabase Project URL & Anon Key.');
  }

  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        name,
        phone,
        companyName: companyName || `${name} Projects`,
        gstin: gstin || '',
        trade: trade || '',
        initialSiteName: siteName || 'Active Site',
        initialSiteLocation: siteLocation || ''
      }
    }
  });

  if (error) throw error;
  return data;
}

// Sign In with Email and Password
export async function signInUser({ email, password }) {
  const client = getSupabase();
  if (!client) {
    throw new Error('Supabase is not configured. Please enter your Supabase Project URL & Anon Key.');
  }

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
}

// Sign In with Magic Link / OTP Email
export async function signInWithOtp({ email }) {
  const client = getSupabase();
  if (!client) throw new Error('Supabase is not configured.');

  const { data, error } = await client.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin
    }
  });

  if (error) throw error;
  return data;
}

// Sign In with Google OAuth
export async function signInWithGoogle() {
  const client = getSupabase();
  if (!client) throw new Error('Supabase is not configured.');

  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  });

  if (error) throw error;
  return data;
}

// Sign Out
export async function signOutUser() {
  const client = getSupabase();
  if (client) {
    try {
      await client.auth.signOut();
    } catch (e) {
      console.warn('Signout error:', e);
    }
  }
  localStorage.removeItem('scaffbuild_current_user');
}

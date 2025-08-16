'use client';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ixrecmfguwautitoatcc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4cmVjbWZndXdhdXRpdG9hdGNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwOTUxODMsImV4cCI6MjA3MDY3MTE4M30.ImkR-P4lGGIR0_e31Fu6tGLGM1DPE-15mcN-Q9iFR1w';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true }
});

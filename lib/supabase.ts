import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bvcosowtekdgitrdiwek.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2Y29zb3d0ZWtkZ2l0cmRpd2VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5OTIyOTUsImV4cCI6MjA4ODU2ODI5NX0.1YYsh07wMbexQn8Pt0JSkikeULgxs7hRRSFp8uEdDJc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

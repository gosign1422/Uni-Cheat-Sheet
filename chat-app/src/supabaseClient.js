import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kajvhoznuxmilwezohgu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthanZob3pudXhtaWx3ZXpvaGd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NDMwNjUsImV4cCI6MjA1OTIxOTA2NX0.IoPJrHBRF3zlDdWP0FdKEgJbUtWRP6xm9_q-Pd6xBNs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 
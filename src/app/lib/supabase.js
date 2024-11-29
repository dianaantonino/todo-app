import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://usjoxcmcvfujgtymkyom.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzam94Y21jdmZ1amd0eW1reW9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4NTcyNDIsImV4cCI6MjA0ODQzMzI0Mn0._9_dWUqQck4b3rC8wewYjjcvdrtW-BYwpojCMPvGZ4Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

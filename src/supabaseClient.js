// src/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

// 🛑 REMPLACEZ CES VALEURS par vos clés Supabase réelles
const supabaseUrl = 'https://nsbbemlzhpyngeorvrrk.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zYmJlbWx6aHB5bmdlb3J2cnJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMDA0OTEsImV4cCI6MjA3Njc3NjQ5MX0.5MhJ98Q8SJQ3OwvzZZ9xcsg8C9FdYrvnFcRdsfatC7A';

// Crée et exporte le client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
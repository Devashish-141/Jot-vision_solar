import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function listAllTables() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  console.log('Listing all tables in public schema for:', process.env.NEXT_PUBLIC_SUPABASE_URL);

  // We can use a raw SQL query via the supabase client if we have the right permissions,
  // or just use the management API if we had it.
  // But we can try to RPC a helper function if it exists.
  
  // Alternatively, let's try to fetch from a known table and check the headers/context.
  // Actually, let's try to query 'information_schema.tables'
  
  const { data, error } = await supabase
    .from('jobs') // Known table
    .select('id')
    .limit(1);

  if (error) {
    console.error('Error fetching jobs:', error);
  } else {
    console.log('Successfully connected to "jobs". The database is active.');
  }
}

listAllTables();

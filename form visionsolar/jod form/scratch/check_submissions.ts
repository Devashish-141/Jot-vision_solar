import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function checkSubmissions() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  console.log('Checking submissions for:', process.env.NEXT_PUBLIC_SUPABASE_URL);

  const { data, error } = await supabase
    .from('form_submissions')
    .select('*, responses:submission_responses(*)')
    .limit(5);

  if (error) {
    console.error('Error fetching submissions:', error);
  } else {
    console.log('Successfully fetched submissions:', JSON.stringify(data, null, 2));
  }
}

checkSubmissions();

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function checkTables() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  console.log('Checking connection to:', process.env.NEXT_PUBLIC_SUPABASE_URL);

  const { data, error } = await supabase
    .from('forms')
    .select('id')
    .limit(1);

  if (error) {
    console.error('Error fetching forms:', error);
  } else {
    console.log('Success! Table "forms" found. Data:', data);
  }

  const { data: data2, error: error2 } = await supabase
    .from('form_elements')
    .select('id')
    .limit(1);

  if (error2) {
    console.error('Error fetching form_elements:', error2);
  } else {
    console.log('Success! Table "form_elements" found. Data:', data2);
  }
}

checkTables();

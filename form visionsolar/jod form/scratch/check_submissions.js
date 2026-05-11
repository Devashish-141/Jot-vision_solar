const { createClient } = require('@supabase/supabase-client');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data, error } = await supabase
    .from('submission_responses')
    .select('*, form_submissions(*)')
    .limit(10);
  
  if (error) console.error(error);
  else console.log(JSON.stringify(data, null, 2));
}

check();

import { createClient } from './src/lib/supabase/client';

async function checkBuckets() {
  const supabase = createClient();
  const { data, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error('Error listing buckets:', error);
    return;
  }
  console.log('Buckets:', data);
}

checkBuckets();

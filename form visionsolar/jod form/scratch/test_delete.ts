import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testAnonymousCreateAndDelete() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  console.log('1. Creating a new form...');
  const { data: formData, error: formError } = await supabase
    .from('forms')
    .insert({
      title: 'Test Anonymous Form',
      is_published: true,
      access_type: 'public'
    })
    .select()
    .single();

  if (formError) {
    console.error('Error creating form:', formError);
    return;
  }
  
  console.log('Created form:', formData.id, 'with created_by:', formData.created_by);

  console.log('2. Attempting to delete the form...');
  const { error: deleteError, count, status } = await supabase
    .from('forms')
    .delete({ count: 'exact' })
    .eq('id', formData.id);

  console.log('Delete result:', { status, count, deleteError });
}

testAnonymousCreateAndDelete();

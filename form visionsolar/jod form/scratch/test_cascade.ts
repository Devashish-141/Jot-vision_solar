import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { formService } from './src/lib/supabase/form-service'; // Might not work if path aliases, let's just use raw queries

dotenv.config({ path: '.env.local' });

async function testCascadeDelete() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  console.log('Creating a dummy form...');
  const { data: form, error: formError } = await supabase
    .from('forms')
    .insert({ title: 'Test Form to Delete', is_published: true })
    .select()
    .single();

  if (formError) {
    console.error('Error creating form:', formError);
    return;
  }
  
  console.log('Created form:', form.id);

  console.log('Creating an element...');
  const { error: elError } = await supabase
    .from('form_elements')
    .insert({
      form_id: form.id,
      element_id: 'test_el',
      element_type: 'text',
      sort_order: 0
    });

  if (elError) {
    console.error('Error creating element:', elError);
    return;
  }

  console.log('Attempting to delete the form...');
  const { error: deleteError, data: deleteData, status } = await supabase
    .from('forms')
    .delete()
    .eq('id', form.id)
    .select();

  console.log('Delete result:', { deleteError, status });

  if (deleteError) {
    console.log('FAILED to delete. Probably foreign key constraint without cascade.');
  } else {
    console.log('DELETED successfully.');
  }
}

testCascadeDelete();

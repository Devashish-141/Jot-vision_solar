import { createClient } from '../src/lib/supabase/client';

async function testDeletion() {
  const supabase = createClient();
  
  // 1. List all forms
  const { data: forms, error: listError } = await supabase
    .from('forms')
    .select('id, title');
    
  if (listError) {
    console.error("Error listing forms:", listError);
    return;
  }
  
  console.log("Current forms in DB:", forms);
  
  if (forms && forms.length > 0) {
    const targetId = forms[0].id;
    console.log(`Attempting to delete form: ${forms[0].title} (${targetId})`);
    
    const { error: deleteError } = await supabase
      .from('forms')
      .delete()
      .eq('id', targetId);
      
    if (deleteError) {
      console.error("DELETE ERROR:", deleteError);
      console.log("Code:", deleteError.code);
      console.log("Message:", deleteError.message);
      console.log("Detail:", deleteError.detail);
    } else {
      console.log("Delete command succeeded (or no rows matched).");
    }
  } else {
    console.log("No forms to delete.");
  }
}

testDeletion();

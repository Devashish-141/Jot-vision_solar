import { createClient } from './client';

const DUMMY_ID = '00000000-0000-0000-0000-000000000000';

export const formService = {
  /**
   * Save a form and its elements to Supabase
   */
  async saveForm(title: string, instances: any[]) {
    const supabase = createClient();

    // Create a new form record
    const { data: formData, error: formError } = await supabase
      .from('forms')
      .insert({
        title: title || 'Untitled Form',
        is_published: true,
        access_type: 'public'
      })
      .select()
      .single();

    if (formError) throw formError;

    // Insert all elements
    const elementsToInsert = instances.map((inst, index) => ({
      form_id: formData.id,
      element_id: inst.elementId,
      element_type: inst.elementId,
      custom_label: inst.customLabel,
      properties: inst.properties || {},
      sort_order: index
    }));

    if (elementsToInsert.length > 0) {
      const { error: elementsError } = await supabase
        .from('form_elements')
        .insert(elementsToInsert);

      if (elementsError) throw elementsError;
    }

    // Persist the form ID in localStorage for preview page to use
    if (typeof window !== 'undefined') {
      localStorage.setItem('vs_current_form_id', formData.id);
    }

    return formData;
  },

  /**
   * Submit a form response to Supabase.
   * If no valid formId is available, it auto-creates a form record first.
   */
  async submitResponse(formId: string, responses: Record<string, any>, instances: any[]) {
    const supabase = createClient();

    let resolvedFormId = formId;

    // Verify form exists if it's not a dummy
    if (resolvedFormId && resolvedFormId !== DUMMY_ID) {
      const { data: formExists } = await supabase
        .from('forms')
        .select('id')
        .eq('id', resolvedFormId)
        .maybeSingle();
      
      if (!formExists) {
        resolvedFormId = DUMMY_ID;
      }
    }

    // If we have a dummy/missing ID, create a default form entry first
    if (!resolvedFormId || resolvedFormId === DUMMY_ID) {
      const { data: formData, error: formError } = await supabase
        .from('forms')
        .insert({
          title: 'Vision Solar Assessment (Auto-Created)',
          is_published: true,
          access_type: 'public'
        })
        .select('id')
        .single();

      if (formError) throw formError;
      resolvedFormId = formData.id;

      // Save it for next time
      if (typeof window !== 'undefined') {
        localStorage.setItem('vs_current_form_id', resolvedFormId);
      }
    }

    // Create the submission record
    const { data: subData, error: subError } = await supabase
      .from('form_submissions')
      .insert({ form_id: resolvedFormId })
      .select()
      .single();

    if (subError) throw subError;

    // Insert individual responses
    const responsesToInsert = Object.entries(responses)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([instanceId, value]) => {
        const instance = instances.find(i => i.id === instanceId);
        return {
          submission_id: subData.id,
          element_type: instance?.elementId || 'unknown',
          // Store the raw instance ID as text in response_value metadata
          response_value: {
            answer: typeof value === 'object' ? value : String(value),
            instance_ref: instanceId,
          }
        };
      });

    if (responsesToInsert.length > 0) {
      const { error: respError } = await supabase
        .from('submission_responses')
        .insert(responsesToInsert);

      if (respError) throw respError;
    }

    return subData;
  },

  /**
   * Get all submissions for a specific form
   */
  async getSubmissions(formId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('form_submissions')
      .select(`
        *,
        responses:submission_responses(*)
      `)
      .eq('form_id', formId)
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Get ALL submissions across ALL forms that contain a signature
   */
  async getAllSignatures() {
    const supabase = createClient();

    // 1. Find all submission IDs that have a signature response
    const { data: sigResponses, error: sigError } = await supabase
      .from('submission_responses')
      .select('submission_id')
      .ilike('element_type', '%signature%');

    if (sigError) throw sigError;
    if (!sigResponses || sigResponses.length === 0) return [];

    const submissionIds = Array.from(new Set(sigResponses.map(r => r.submission_id)));

    // 2. Fetch the full submissions for those IDs
    const { data, error } = await supabase
      .from('form_submissions')
      .select(`
        *,
        form:forms(title),
        responses:submission_responses(*)
      `)
      .in('id', submissionIds)
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Get all forms with their submission counts and global stats
   */
  async getFormsWithStats() {
    const supabase = createClient();

    // Fetch all forms with counts from the submissions table
    // Using a join to get counts per form
    const { data: forms, error: formsError } = await supabase
      .from('forms')
      .select(`
        *,
        submission_count:form_submissions(count)
      `)
      .order('created_at', { ascending: false });

    if (formsError) throw formsError;

    // Format the data and calculate global stats
    const formattedForms = forms.map(f => ({
      ...f,
      responses: f.submission_count?.[0]?.count || 0,
      views: f.views || 0,
      status: f.is_published ? 'Active' : 'Draft',
      lastUpdated: new Date(f.updated_at).toLocaleDateString()
    }));

    const totalSubmissions = formattedForms.reduce((sum, f) => sum + f.responses, 0);
    const totalViews = formattedForms.reduce((sum, f) => sum + (f.views || 0), 0);
    const totalForms = formattedForms.length;
    
    // Calculate accurate submission rate
    const submissionRate = totalViews > 0 
      ? Math.round((totalSubmissions / totalViews) * 1000) / 10 
      : 0;

    return {
      forms: formattedForms,
      stats: {
        totalForms,
        totalSubmissions,
        submissionRate
      }
    };
  },

  /**
   * Increment the view count for a form
   */
  async recordFormView(formId: string) {
    if (!formId || formId === DUMMY_ID) return;
    
    const supabase = createClient();
    
    // Use an RPC if available, otherwise a simple increment via update
    // We'll use update since it's simpler to set up
    const { error } = await supabase.rpc('increment_form_views', { form_id: formId });
    
    if (error) {
      // Fallback if RPC doesn't exist
      const { data: current } = await supabase
        .from('forms')
        .select('views')
        .eq('id', formId)
        .maybeSingle();
      
      await supabase
        .from('forms')
        .update({ views: (current?.views || 0) + 1 })
        .eq('id', formId);
    }
  },

  /**
   * Upload a file to Supabase Storage and return its public URL
   */
  async uploadFile(file: File) {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `submissions/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('form-files')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('form-files')
      .getPublicUrl(filePath);

    return publicUrl;
  },

  /**
   * Delete a form from Supabase
   */
  async deleteForm(id: string | number) {
    const supabase = createClient();
    
    const { error, count } = await supabase
      .from('forms')
      .delete({ count: 'exact' })
      .eq('id', id);

    if (error) throw error;
    if (count === 0) throw new Error("Could not delete form. You may not have permission, or it no longer exists.");
    return true;
  }
};

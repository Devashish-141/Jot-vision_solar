import { createClient } from './client';
import type { Job, Client } from '../types';

export const jobService = {
  /**
   * Fetch all jobs with their associated client data
   */
  async fetchJobs() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        client:clients(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }

    return data as Job[];
  },

  /**
   * Fetch unscheduled jobs
   */
  async fetchUnscheduledJobs() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        client:clients(*)
      `)
      .is('scheduled_date', null)
      .not('status', 'in', '("Completed", "Cancelled", "Archived")')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching unscheduled jobs:', error);
      throw error;
    }

    return data as Job[];
  },

  /**
   * Update a job's status or other fields
   */
  async updateJob(jobId: string, updates: Partial<Job>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', jobId)
      .select()
      .single();

    if (error) {
      console.error('Error updating job:', error);
      throw error;
    }

    return data as Job;
  },

  /**
   * Create a new job
   */
  async createJob(job: Omit<Job, 'id' | 'created_at' | 'updated_at' | 'job_number'>) {
    const supabase = createClient();
    
    // Generate a simple job number for now
    const jobNumber = `VS-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const { data, error } = await supabase
      .from('jobs')
      .insert({ ...job, job_number: jobNumber })
      .select()
      .single();

    if (error) {
      console.error('Error creating job:', error);
      throw error;
    }

    return data as Job;
  },

  /**
   * Save checklist items for a job
   */
  async saveChecklist(jobId: string, items: { text: string; completed: boolean }[]) {
    const supabase = createClient();
    
    // First, delete existing items to replace them (simplest way for now)
    await supabase.from('job_checklist').delete().eq('job_id', jobId);
    
    if (items.length === 0) return;

    const itemsToInsert = items.map((item, index) => ({
      job_id: jobId,
      text: item.text,
      completed: item.completed,
      order: index
    }));

    const { error } = await supabase
      .from('job_checklist')
      .insert(itemsToInsert);

    if (error) {
      console.error('Error saving checklist:', error);
      throw error;
    }
  },

  /**
   * Create a new client
   */
  async createClient(client: Omit<Client, 'id' | 'created_at'>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single();

    if (error) {
      console.error('Error creating client:', error);
      throw error;
    }

    return data as Client;
  },

  /**
   * Fetch all staff locations
   */
  async fetchStaffLocations() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('staff_locations')
      .select(`
        *,
        profile:profiles(*)
      `);

    if (error) {
      console.error('Error fetching staff locations:', error);
      throw error;
    }

    return data;
  },

  /**
   * Fetch a single job by ID with client and checklist
   */
  async fetchJob(jobId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        client:clients(*),
        job_checklist(*)
      `)
      .eq('id', jobId)
      .single();

    if (error) {
      console.error('Error fetching job:', error);
      throw error;
    }

    return data as Job & { job_checklist: Array<{ id: string; text: string; completed: boolean; order: number }> };
  },

  /**
   * Fetch all clients
   */
  async fetchClients() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('last_name', { ascending: true });

    if (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }

    return data as Client[];
  }
};

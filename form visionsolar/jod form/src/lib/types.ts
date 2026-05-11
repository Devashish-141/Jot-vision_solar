import type { JobStatus, JobCategory, UserRole, TeamStatus, InvoiceStatus } from './constants';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  status?: TeamStatus;
}

export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  mobile?: string;
  address?: string;
  created_at: string;
}

export interface Job {
  id: string;
  job_number: string;
  client_id: string;
  client?: Client;
  address: string;
  suburb?: string;
  status: JobStatus;
  category: JobCategory;
  description: string;
  po_number?: string;
  scheduled_date?: string;
  completed_date?: string;
  estimated_hours?: number;
  system_size?: string;
  requires_site_visit?: boolean;
  materials_status?: string;
  invoice_status?: InvoiceStatus;
  total_value?: number;
  assigned_to?: string;
  assigned_staff?: Profile;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  billing_same_as_job?: boolean;
  billing_address?: string;
  created_at: string;
  updated_at: string;
}

export interface JobItem {
  id: string;
  job_id: string;
  item_code: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_percent: number;
  total: number;
}

export interface ChecklistItem {
  id: string;
  job_id: string;
  text: string;
  completed: boolean;
  order: number;
}

export interface JobAttachment {
  id: string;
  job_id: string;
  file_name: string;
  file_type: string;
  file_url: string;
  file_size: number;
  uploaded_by: string;
  created_at: string;
}

export interface StaffLocation {
  id: string;
  profile_id: string;
  profile?: Profile;
  latitude: number;
  longitude: number;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string;
  created_at: string;
}

export interface SavedVersion {
  id: string;
  job_id: string;
  user_name: string;
  action: string;
  created_at: string;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  wind_speed: number;
  rain_probability: number;
  humidity: number;
}

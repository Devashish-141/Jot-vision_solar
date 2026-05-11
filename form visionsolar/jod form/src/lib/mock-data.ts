import type { Profile, Client, Job, JobItem, ChecklistItem, AuditLog, StaffLocation, SavedVersion } from './types';

// ──── Staff / Profiles ────
export const mockProfiles: Profile[] = [
  { id: '1', email: 'rahul@visionsolar.com.au', full_name: 'Rahul Mandal', role: 'Admin', avatar_url: '', status: 'Available' },
  { id: '2', email: 'james@visionsolar.com.au', full_name: 'James Chen', role: 'Technician', avatar_url: '', status: 'On Site' },
  { id: '3', email: 'sarah@visionsolar.com.au', full_name: 'Sarah Mitchell', role: 'Technician', avatar_url: '', status: 'En Route' },
  { id: '4', email: 'tom@visionsolar.com.au', full_name: 'Tom Baker', role: 'Technician', avatar_url: '', status: 'Available' },
  { id: '5', email: 'lisa@visionsolar.com.au', full_name: 'Lisa Nguyen', role: 'Dispatcher', avatar_url: '', status: 'Available' },
];

// ──── Clients ────
export const mockClients: Client[] = [
  { id: 'c1', first_name: 'Michael', last_name: 'Thompson', email: 'michael.t@email.com', phone: '03 9876 5432', mobile: '0412 345 678', address: '42 Lonsdale St, Melbourne VIC 3000', created_at: '2026-01-15T08:00:00Z' },
  { id: 'c2', first_name: 'Emma', last_name: 'Rodriguez', email: 'emma.r@email.com', phone: '03 9123 4567', mobile: '0423 456 789', address: '15 Chapel St, South Yarra VIC 3141', created_at: '2026-02-03T09:30:00Z' },
  { id: 'c3', first_name: 'David', last_name: 'Wilson', email: 'david.w@email.com', phone: '03 9234 5678', mobile: '0434 567 890', address: '88 Bridge Rd, Richmond VIC 3121', created_at: '2026-02-20T14:00:00Z' },
  { id: 'c4', first_name: 'Jennifer', last_name: 'Patel', email: 'jen.patel@email.com', phone: '03 9345 6789', mobile: '0445 678 901', address: '23 High St, Kew VIC 3101', created_at: '2026-03-01T10:15:00Z' },
  { id: 'c5', first_name: 'Robert', last_name: 'Chang', email: 'r.chang@email.com', phone: '03 9456 7890', mobile: '0456 789 012', address: '7 Station St, Box Hill VIC 3128', created_at: '2026-03-10T11:00:00Z' },
  { id: 'c6', first_name: 'Kate', last_name: 'O\'Brien', email: 'kate.ob@email.com', phone: '03 9567 8901', mobile: '0467 890 123', address: '56 Main Rd, Eltham VIC 3095', created_at: '2026-03-15T16:00:00Z' },
];

// ──── Jobs ────
export const mockJobs: Job[] = [
  {
    id: 'j1', job_number: 'VS-1201', client_id: 'c1', client: mockClients[0],
    address: '42 Lonsdale St, Melbourne VIC 3000', suburb: 'Melbourne',
    status: 'Work Order', category: 'Installation',
    description: '6.6kW solar panel system installation - 16x Trina Vertex S panels with Fronius Primo inverter',
    scheduled_date: new Date().toISOString().split('T')[0],
    estimated_hours: 6, system_size: '6.6kW', materials_status: 'Received',
    invoice_status: 'Draft', total_value: 8500, assigned_to: '2', assigned_staff: mockProfiles[1],
    contact_name: 'Michael Thompson', contact_email: 'michael.t@email.com', contact_phone: '0412 345 678',
    billing_same_as_job: true, created_at: '2026-04-10T08:00:00Z', updated_at: '2026-04-17T09:00:00Z',
  },
  {
    id: 'j2', job_number: 'VS-1202', client_id: 'c2', client: mockClients[1],
    address: '15 Chapel St, South Yarra VIC 3141', suburb: 'South Yarra',
    status: 'Quote Sent', category: 'Installation',
    description: '10kW commercial solar system with battery storage - SolarEdge inverter with Tesla Powerwall',
    estimated_hours: 8, system_size: '10kW', materials_status: 'Pending',
    invoice_status: 'Draft', total_value: 18500,
    contact_name: 'Emma Rodriguez', contact_email: 'emma.r@email.com', contact_phone: '0423 456 789',
    billing_same_as_job: true, created_at: '2026-04-12T10:00:00Z', updated_at: '2026-04-16T14:00:00Z',
  },
  {
    id: 'j3', job_number: 'VS-1203', client_id: 'c3', client: mockClients[2],
    address: '88 Bridge Rd, Richmond VIC 3121', suburb: 'Richmond',
    status: 'Lead', category: 'Site Assessment', requires_site_visit: true,
    description: 'Roof assessment for potential 5kW residential installation - check shading and structural integrity',
    estimated_hours: 2, materials_status: 'N/A',
    contact_name: 'David Wilson', contact_email: 'david.w@email.com', contact_phone: '0434 567 890',
    billing_same_as_job: true, created_at: '2026-04-15T09:00:00Z', updated_at: '2026-04-17T10:00:00Z',
  },
  {
    id: 'j4', job_number: 'VS-1204', client_id: 'c4', client: mockClients[3],
    address: '23 High St, Kew VIC 3101', suburb: 'Kew',
    status: 'Work Order', category: 'Installation',
    description: '8.8kW solar panel system with micro-inverters - 22x Jinko Tiger Neo panels',
    scheduled_date: new Date().toISOString().split('T')[0],
    estimated_hours: 7, system_size: '8.8kW', materials_status: 'Received',
    invoice_status: 'Draft', total_value: 12200, assigned_to: '3', assigned_staff: mockProfiles[2],
    contact_name: 'Jennifer Patel', contact_email: 'jen.patel@email.com', contact_phone: '0445 678 901',
    billing_same_as_job: true, created_at: '2026-04-08T11:00:00Z', updated_at: '2026-04-17T08:00:00Z',
  },
  {
    id: 'j5', job_number: 'VS-1205', client_id: 'c5', client: mockClients[4],
    address: '7 Station St, Box Hill VIC 3128', suburb: 'Box Hill',
    status: 'Quote', category: 'Installation',
    description: '5kW residential solar system - budget-friendly option with Canadian Solar panels',
    estimated_hours: 5, system_size: '5kW', materials_status: 'Pending',
    total_value: 6200,
    contact_name: 'Robert Chang', contact_email: 'r.chang@email.com', contact_phone: '0456 789 012',
    billing_same_as_job: true, created_at: '2026-04-14T13:00:00Z', updated_at: '2026-04-16T15:00:00Z',
  },
  {
    id: 'j6', job_number: 'VS-1206', client_id: 'c6', client: mockClients[5],
    address: '56 Main Rd, Eltham VIC 3095', suburb: 'Eltham',
    status: 'Completed', category: 'Installation',
    description: '13.2kW solar panel system with 2x Tesla Powerwall batteries - premium installation',
    scheduled_date: '2026-04-16', completed_date: '2026-04-16',
    estimated_hours: 10, system_size: '13.2kW', materials_status: 'Received',
    invoice_status: 'Draft', total_value: 32000, assigned_to: '2', assigned_staff: mockProfiles[1],
    contact_name: "Kate O'Brien", contact_email: 'kate.ob@email.com', contact_phone: '0467 890 123',
    billing_same_as_job: true, created_at: '2026-03-25T09:00:00Z', updated_at: '2026-04-16T17:00:00Z',
  },
  {
    id: 'j7', job_number: 'VS-1198', client_id: 'c1', client: mockClients[0],
    address: '42 Lonsdale St, Melbourne VIC 3000', suburb: 'Melbourne',
    status: 'Completed', category: 'Service',
    description: 'Annual inverter service and panel cleaning - Fronius Primo 5.0 check',
    scheduled_date: '2026-04-10', completed_date: '2026-04-10',
    estimated_hours: 3, system_size: '6.6kW', materials_status: 'N/A',
    invoice_status: 'Paid', total_value: 450, assigned_to: '4', assigned_staff: mockProfiles[3],
    contact_name: 'Michael Thompson', contact_email: 'michael.t@email.com', contact_phone: '0412 345 678',
    billing_same_as_job: true, created_at: '2026-04-01T08:00:00Z', updated_at: '2026-04-10T15:00:00Z',
  },
  {
    id: 'j8', job_number: 'VS-1199', client_id: 'c3', client: mockClients[2],
    address: '88 Bridge Rd, Richmond VIC 3121', suburb: 'Richmond',
    status: 'Completed', category: 'Service',
    description: 'Emergency inverter fault diagnosis - SolarEdge SE7K showing ground fault error',
    scheduled_date: '2026-04-12', completed_date: '2026-04-12',
    estimated_hours: 4, system_size: '7kW', materials_status: 'Received',
    invoice_status: 'Paid', total_value: 680, assigned_to: '3', assigned_staff: mockProfiles[2],
    contact_name: 'David Wilson', contact_email: 'david.w@email.com', contact_phone: '0434 567 890',
    billing_same_as_job: true, created_at: '2026-04-11T07:00:00Z', updated_at: '2026-04-12T16:00:00Z',
  },
];

// ──── Job Items (for billing) ────
export const mockJobItems: JobItem[] = [
  { id: 'li1', job_id: 'j1', item_code: 'PNL-TRINA-410', description: 'Trina Vertex S 410W Panel', quantity: 16, unit_price: 185, tax_percent: 10, total: 3256 },
  { id: 'li2', job_id: 'j1', item_code: 'INV-FRON-5', description: 'Fronius Primo 5.0-1 Inverter', quantity: 1, unit_price: 1850, tax_percent: 10, total: 2035 },
  { id: 'li3', job_id: 'j1', item_code: 'INST-STD', description: 'Standard Installation Labour', quantity: 1, unit_price: 2800, tax_percent: 10, total: 3080 },
  { id: 'li4', job_id: 'j1', item_code: 'MTR-RAIL', description: 'Mounting Rails & Hardware Kit', quantity: 1, unit_price: 420, tax_percent: 10, total: 462 },
];

// ──── Checklist ────
export const mockChecklist: ChecklistItem[] = [
  { id: 'ck1', job_id: 'j1', text: 'Confirm roof measurements and panel layout', completed: true, order: 1 },
  { id: 'ck2', job_id: 'j1', text: 'Check electrical switchboard capacity', completed: true, order: 2 },
  { id: 'ck3', job_id: 'j1', text: 'Install mounting rails', completed: false, order: 3 },
  { id: 'ck4', job_id: 'j1', text: 'Mount panels and wire strings', completed: false, order: 4 },
  { id: 'ck5', job_id: 'j1', text: 'Install inverter and configure monitoring', completed: false, order: 5 },
  { id: 'ck6', job_id: 'j1', text: 'Final inspection and system commissioning', completed: false, order: 6 },
];

// ──── Staff Locations ────
export const mockStaffLocations: StaffLocation[] = [
  { id: 'sl1', profile_id: '2', profile: mockProfiles[1], latitude: -37.8136, longitude: 144.9631, updated_at: '2026-04-18T09:30:00Z' },
  { id: 'sl2', profile_id: '3', profile: mockProfiles[2], latitude: -37.8400, longitude: 144.9900, updated_at: '2026-04-18T09:28:00Z' },
  { id: 'sl3', profile_id: '4', profile: mockProfiles[3], latitude: -37.7900, longitude: 145.0200, updated_at: '2026-04-18T09:25:00Z' },
];

// ──── Audit Logs ────
export const mockAuditLogs: AuditLog[] = [
  { id: 'al1', user_id: '1', user_name: 'Rahul Mandal', action: 'status_change', entity_type: 'job', entity_id: 'j1', details: 'Changed Job #VS-1201 from Quote to Work Order', created_at: '2026-04-17T09:00:00Z' },
  { id: 'al2', user_id: '1', user_name: 'Rahul Mandal', action: 'assigned', entity_type: 'job', entity_id: 'j1', details: 'Assigned Job #VS-1201 to James Chen', created_at: '2026-04-17T09:05:00Z' },
  { id: 'al3', user_id: '5', user_name: 'Lisa Nguyen', action: 'status_change', entity_type: 'job', entity_id: 'j4', details: 'Changed Job #VS-1204 from Quote Sent to Work Order', created_at: '2026-04-17T08:30:00Z' },
  { id: 'al4', user_id: '2', user_name: 'James Chen', action: 'completed', entity_type: 'job', entity_id: 'j6', details: 'Marked Job #VS-1206 as Completed', created_at: '2026-04-16T17:00:00Z' },
  { id: 'al5', user_id: '1', user_name: 'Rahul Mandal', action: 'created', entity_type: 'job', entity_id: 'j5', details: 'Created new Quote #VS-1205 for Robert Chang', created_at: '2026-04-14T13:00:00Z' },
  { id: 'al6', user_id: '3', user_name: 'Sarah Mitchell', action: 'completed', entity_type: 'job', entity_id: 'j8', details: 'Marked Job #VS-1199 as Completed', created_at: '2026-04-12T16:00:00Z' },
  { id: 'al7', user_id: '1', user_name: 'Rahul Mandal', action: 'quote_sent', entity_type: 'job', entity_id: 'j2', details: 'Sent Quote #VS-1202 to Emma Rodriguez', created_at: '2026-04-12T10:30:00Z' },
];

// ──── Saved Versions ────
export const mockSavedVersions: SavedVersion[] = [
  { id: 'sv1', job_id: 'j1', user_name: 'Rahul Mandal', action: 'Job Created', created_at: '2026-04-10T08:00:00Z' },
  { id: 'sv2', job_id: 'j1', user_name: 'Rahul Mandal', action: 'Quote Generated', created_at: '2026-04-10T08:30:00Z' },
  { id: 'sv3', job_id: 'j1', user_name: 'Lisa Nguyen', action: 'Status changed to Work Order', created_at: '2026-04-12T09:15:00Z' },
  { id: 'sv4', job_id: 'j1', user_name: 'Lisa Nguyen', action: 'Assigned to James Chen', created_at: '2026-04-12T09:20:00Z' },
];

// Helper to get today's jobs
export function getTodaysJobs(): Job[] {
  const today = new Date().toISOString().split('T')[0];
  return mockJobs.filter(j => j.scheduled_date === today);
}

// Helper to get unscheduled jobs
export function getUnscheduledJobs(): Job[] {
  return mockJobs.filter(j =>
    !j.scheduled_date &&
    !['Completed', 'Cancelled', 'Archived'].includes(j.status)
  );
}

// Helper to get completed jobs
export function getCompletedJobs(): Job[] {
  return mockJobs.filter(j =>
    ['Completed', 'Cancelled', 'Archived'].includes(j.status)
  );
}

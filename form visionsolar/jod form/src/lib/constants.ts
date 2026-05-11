// VisionSolar Brand Colors
export const COLORS = {
  visionGreen: '#5C8F5A',
  greenLight: '#7BAE79',
  greenDark: '#3D6E3B',
  solarOrange: '#E3A25B',
  orangeLight: '#F0BC8A',
  orangeDark: '#C47E3E',
  white: '#FFFFFF',
  offWhite: '#F9FAFB',
  lightGray: '#E5E7EB',
  midGray: '#9CA3AF',
  darkGray: '#4B5563',
  charcoal: '#1F2937',
  danger: '#EF4444',
  dangerDark: '#DC2626',
} as const;

// Job Statuses
export const JOB_STATUSES = {
  LEAD: 'Lead',
  QUOTE: 'Quote',
  QUOTE_SENT: 'Quote Sent',
  WORK_ORDER: 'Work Order',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  UNSUCCESSFUL: 'Unsuccessful',
  ARCHIVED: 'Archived',
} as const;

export type JobStatus = (typeof JOB_STATUSES)[keyof typeof JOB_STATUSES];

// Job Categories
export const JOB_CATEGORIES = {
  INSTALLATION: 'Installation',
  SERVICE: 'Service',
  SITE_ASSESSMENT: 'Site Assessment',
} as const;

export type JobCategory = (typeof JOB_CATEGORIES)[keyof typeof JOB_CATEGORIES];

// User Roles
export const USER_ROLES = {
  ADMIN: 'Admin',
  DISPATCHER: 'Dispatcher',
  TECHNICIAN: 'Technician',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Invoice Statuses
export const INVOICE_STATUSES = {
  DRAFT: 'Draft',
  SENT: 'Sent',
  PAID: 'Paid',
  UNPAID: 'Unpaid',
  OVERDUE: 'Overdue',
} as const;

export type InvoiceStatus = (typeof INVOICE_STATUSES)[keyof typeof INVOICE_STATUSES];

// Materials Statuses
export const MATERIALS_STATUSES = {
  PENDING: 'Pending',
  ORDERED: 'Ordered',
  RECEIVED: 'Received',
  NA: 'N/A',
} as const;

// Team Statuses
export const TEAM_STATUSES = {
  ON_SITE: 'On Site',
  EN_ROUTE: 'En Route',
  AVAILABLE: 'Available',
  OFF_DUTY: 'Off Duty',
} as const;

export type TeamStatus = (typeof TEAM_STATUSES)[keyof typeof TEAM_STATUSES];

// Allowed attachment file types
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpg',
  'image/jpeg',
  'audio/mpeg',
  'audio/wav',
] as const;

export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// Navigation items
export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Dispatch Board', href: '/dispatch', icon: 'MapPin' },
  { label: 'History', href: '/history', icon: 'Clock' },
] as const;

// Weather thresholds
export const WEATHER_THRESHOLDS = {
  RAIN_PROBABILITY: 50, // percent
  WIND_SPEED: 25, // km/h
} as const;

// Melbourne coordinates
export const MELBOURNE_COORDS = {
  lat: -37.8136,
  lng: 144.9631,
} as const;

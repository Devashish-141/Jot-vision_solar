import {
  Type, User, Mail, MapPin, Phone, Calendar, Clock,
  PenTool, Edit3, ShoppingCart, AlignLeft, AlignJustify,
  FileText, ChevronDown, CheckCircle2, ListChecks,
  Hash, Image as ImageIcon, UploadCloud, Timer,
  ShieldCheck, Loader2, SendHorizontal, Table,
  Star, BarChart3, Minus, FoldVertical, Columns
} from 'lucide-react';

export type ElementCategory = 'BASIC ELEMENTS' | 'SURVEY ELEMENTS' | 'PAGE ELEMENTS';

export type FormElementDef = {
  id: string;
  type: string;
  label: string;
  category: ElementCategory;
  icon: any; // Lucide Icon component
};

export const formElements: FormElementDef[] = [
  // BASIC ELEMENTS
  { id: 'heading', type: 'Heading', label: 'Heading', category: 'BASIC ELEMENTS', icon: Type },
  { id: 'fullName', type: 'FullName', label: 'Full Name', category: 'BASIC ELEMENTS', icon: User },
  { id: 'email', type: 'Email', label: 'Email', category: 'BASIC ELEMENTS', icon: Mail },
  { id: 'address', type: 'Address', label: 'Address', category: 'BASIC ELEMENTS', icon: MapPin },
  { id: 'phone', type: 'Phone', label: 'Phone', category: 'BASIC ELEMENTS', icon: Phone },
  { id: 'datePicker', type: 'DatePicker', label: 'Date Picker', category: 'BASIC ELEMENTS', icon: Calendar },
  { id: 'signature', type: 'Signature', label: 'Signature', category: 'BASIC ELEMENTS', icon: PenTool },
  { id: 'shortText', type: 'ShortText', label: 'Short Text', category: 'BASIC ELEMENTS', icon: AlignLeft },
  { id: 'longText', type: 'LongText', label: 'Long Text', category: 'BASIC ELEMENTS', icon: AlignJustify },
  { id: 'paragraph', type: 'Paragraph', label: 'Paragraph', category: 'BASIC ELEMENTS', icon: FileText },
  { id: 'dropdown', type: 'Dropdown', label: 'Dropdown', category: 'BASIC ELEMENTS', icon: ChevronDown },
  { id: 'singleChoice', type: 'SingleChoice', label: 'Single Choice', category: 'BASIC ELEMENTS', icon: CheckCircle2 },
  { id: 'multipleChoice', type: 'MultipleChoice', label: 'Multiple Choice', category: 'BASIC ELEMENTS', icon: ListChecks },
  { id: 'number', type: 'Number', label: 'Number', category: 'BASIC ELEMENTS', icon: Hash },
  { id: 'image', type: 'Image', label: 'Image', category: 'BASIC ELEMENTS', icon: ImageIcon },
  { id: 'fileUpload', type: 'FileUpload', label: 'File Upload', category: 'BASIC ELEMENTS', icon: UploadCloud },
  { id: 'time', type: 'Time', label: 'Time', category: 'BASIC ELEMENTS', icon: Timer },
  { id: 'submit', type: 'Submit', label: 'Submit', category: 'BASIC ELEMENTS', icon: SendHorizontal },

  // SURVEY ELEMENTS
  { id: 'starRating', type: 'StarRating', label: 'Star Rating', category: 'SURVEY ELEMENTS', icon: Star },

  // PAGE ELEMENTS
  { id: 'divider', type: 'Divider', label: 'Divider', category: 'PAGE ELEMENTS', icon: Minus },
  { id: 'sectionCollapse', type: 'SectionCollapse', label: 'Section Collapse', category: 'PAGE ELEMENTS', icon: FoldVertical },
  { id: 'pageBreak', type: 'PageBreak', label: 'Page Break', category: 'PAGE ELEMENTS', icon: Columns },
];

export interface FormInstance {
  id: string; // Unique ID for this specific instance in the canvas
  elementId: string; // Links back to FormElementDef
  x?: number; // Optional position if doing absolute, but we'll use a sortable list
  customLabel?: string; // Overrides default tool label
  properties?: Record<string, string>; // Additional properties like sub-labels
}


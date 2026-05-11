'use client';

import React, { useState, useEffect } from 'react';
import { X, Table2, Search, Download, Calendar, User, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formService } from '@/lib/supabase/form-service';
import { toast } from 'sonner';

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatLabel(raw: string) {
  return raw
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, s => s.toUpperCase())
    .trim();
}

function formatValue(elementType: string, value: any): React.ReactNode {
  if (value === null || value === undefined || value === '') return <span className="text-mid-gray/40 italic">—</span>;

  // Unwrap answer wrapper
  const raw = typeof value === 'object' && 'answer' in value ? value.answer : value;

  // Full name object
  if (typeof raw === 'object' && ('firstName' in raw || 'lastName' in raw)) {
    const name = `${raw.firstName || ''} ${raw.lastName || ''}`.trim();
    return <span>{name || '—'}</span>;
  }

  // Signature (base64 image or URL)
  if (elementType.toLowerCase() === 'signature' && typeof raw === 'string' && (raw.startsWith('data:image') || raw.startsWith('http'))) {
    return (
      <div className="mt-1">
        <img
          src={raw}
          alt="Signature"
          className="max-h-16 border border-light-gray rounded-lg bg-white object-contain"
        />
      </div>
    );
  }

  // Date ISO string
  if (elementType === 'datePicker' || (typeof raw === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(raw))) {
    try {
      return <span>{new Date(raw).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>;
    } catch { /* fall through */ }
  }

  // Image (base64 or URL)
  if (elementType.toLowerCase() === 'image' && typeof raw === 'string' && (raw.startsWith('data:image') || raw.startsWith('http'))) {
    return (
      <div className="mt-1">
        <a href={raw} target="_blank" rel="noopener noreferrer">
          <img
            src={raw}
            alt="Uploaded"
            className="max-h-32 border border-light-gray rounded-lg bg-white object-contain hover:ring-2 hover:ring-vision-green transition-all"
          />
        </a>
      </div>
    );
  }

  // File Upload (URL or filename)
  if (elementType.toLowerCase() === 'fileupload' && typeof raw === 'string') {
    const isUrl = raw.startsWith('http');
    if (isUrl) {
      return (
        <a 
          href={raw} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-off-white border border-light-gray rounded-lg text-vision-green hover:bg-vision-green/5 hover:border-vision-green transition-all font-bold text-xs"
        >
          <Download className="w-3.5 h-3.5" />
          Open File
        </a>
      );
    }
    return <span className="text-mid-gray italic">{raw}</span>;
  }

  // Plain string / number
  if (typeof raw === 'string' || typeof raw === 'number') {
    return <span className="break-words whitespace-pre-wrap">{String(raw)}</span>;
  }

  // Fallback: JSON
  return <span className="text-xs font-mono break-all">{JSON.stringify(raw)}</span>;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SubmissionsOverlay({
  formId,
  formTitle,
  onClose,
  isGlobalSignatures = false,
}: {
  formId?: string;
  formTitle: string;
  onClose: () => void;
  isGlobalSignatures?: boolean;
}) {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function loadData() {
      try {
        let data;
        if (isGlobalSignatures) {
          data = await formService.getAllSignatures();
        } else if (formId) {
          data = await formService.getSubmissions(formId);
        } else {
          data = [];
        }
        setSubmissions(data);
        // Expand the first submission by default
        if (data.length > 0) {
          setExpanded(new Set([data[0].id]));
        }
      } catch (error: any) {
        toast.error('Failed to load submissions', { description: error.message });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [formId, isGlobalSignatures]);

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = submissions.filter(sub => {
    const q = search.toLowerCase();
    if (!q) return true;
    return JSON.stringify(sub).toLowerCase().includes(q);
  });

  const exportToCSV = () => {
    if (submissions.length === 0) {
      toast.error('No submissions to export');
      return;
    }

    // 1. Identify all unique field types/labels across all submissions to create headers
    const allFieldTypes = new Set<string>();
    submissions.forEach(sub => {
      sub.responses?.forEach((resp: any) => {
        allFieldTypes.add(resp.element_type);
      });
    });

    const headers = ['Submission ID', 'Submitted At', ...Array.from(allFieldTypes).map(t => formatLabel(t))];

    // 2. Map each submission to a row
    const rows = submissions.map(sub => {
      const row: any[] = [
        sub.id,
        new Date(sub.submitted_at).toLocaleString(),
      ];

      allFieldTypes.forEach(type => {
        const resp = sub.responses?.find((r: any) => r.element_type === type);
        if (!resp) {
          row.push('');
          return;
        }

        const value = resp.response_value?.answer || resp.response_value || '';
        
        // Handle complex objects (like Full Name)
        if (typeof value === 'object') {
          if ('firstName' in value || 'lastName' in value) {
            row.push(`${value.firstName || ''} ${value.lastName || ''}`.trim());
          } else {
            row.push(JSON.stringify(value).replace(/"/g, '""'));
          }
        } else {
          row.push(String(value).replace(/"/g, '""'));
        }
      });

      return row;
    });

    // 3. Construct CSV string
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // 4. Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `submissions_${formTitle.replace(/\s+/g, '_').toLowerCase()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('CSV Exported successfully');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end bg-charcoal/30 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-3xl h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">

        {/* Header */}
        <div className="px-7 py-5 border-b border-light-gray/60 flex items-center justify-between bg-charcoal text-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center">
              <Table2 className="w-5 h-5 text-vision-green" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {isGlobalSignatures ? 'All Collected Signatures' : `${formTitle} Responses`}
              </h2>
              <p className="text-white/60 text-xs font-medium uppercase tracking-widest mt-0.5">
                {submissions.length} Total {isGlobalSignatures ? 'Signatures' : 'Submissions'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-7 py-3 bg-off-white/60 border-b border-light-gray/60 flex items-center gap-3 shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mid-gray" />
            <input
              placeholder="Search responses…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-4 bg-white border border-light-gray rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-vision-green/20 focus:border-vision-green transition-all"
            />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportToCSV}
            className="gap-2 rounded-xl border-light-gray font-bold text-xs shrink-0"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-mid-gray">
              <div className="w-9 h-9 border-4 border-vision-green border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold uppercase tracking-widest">Loading…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center text-mid-gray gap-3 border-2 border-dashed border-light-gray/60 rounded-2xl">
              <Table2 className="w-12 h-12 text-light-gray" />
              <p className="font-bold text-charcoal">No submissions yet</p>
              <p className="text-sm max-w-xs">When users complete your form, their responses will appear here.</p>
            </div>
          ) : (
            filtered.map(sub => {
              const isOpen = expanded.has(sub.id);
              const responses: any[] = sub.responses || [];
              const submittedAt = new Date(sub.submitted_at).toLocaleString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
                hour: 'numeric', minute: '2-digit', hour12: true,
              });

              return (
                <div key={sub.id} className="bg-white border border-light-gray/60 rounded-2xl overflow-hidden shadow-sm">
                  {/* Submission header — always visible */}
                  <button
                    onClick={() => toggleExpand(sub.id)}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-off-white/40 transition-colors text-left"
                  >
                    <div className="flex items-center gap-5 min-w-0">
                      <div className="flex items-center gap-2 text-sm font-bold text-charcoal shrink-0">
                        <Calendar className="w-4 h-4 text-vision-green" />
                        {submittedAt}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-mid-gray shrink-0">
                        <User className="w-3.5 h-3.5" />
                        Anonymous
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <span className="text-[10px] font-mono text-mid-gray/40 hidden sm:block">
                        {sub.id.slice(0, 8)}…
                      </span>
                      <span className="text-xs font-bold text-mid-gray bg-off-white px-2 py-0.5 rounded-full">
                        {responses.length} field{responses.length !== 1 ? 's' : ''}
                      </span>
                      {isOpen
                        ? <ChevronUp className="w-4 h-4 text-mid-gray" />
                        : <ChevronDown className="w-4 h-4 text-mid-gray" />
                      }
                    </div>
                  </button>

                  {/* Expanded field list */}
                  {isOpen && responses.length > 0 && (
                    <div className="border-t border-light-gray/40 px-5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                      {responses.map(resp => (
                        <div key={resp.id} className="flex flex-col gap-1 min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-widest text-mid-gray/60">
                            {formatLabel(resp.element_type)}
                          </p>
                          <div className="text-sm text-charcoal font-medium">
                            {formatValue(resp.element_type, resp.response_value)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {isOpen && responses.length === 0 && (
                    <p className="px-5 py-4 text-sm text-mid-gray border-t border-light-gray/40 italic">
                      No field responses recorded.
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

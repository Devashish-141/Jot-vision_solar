'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, FileText, Upload, FileSignature,
  Star, Inbox, PenLine, Copy, Trash2,
  MoreHorizontal, FolderOpen, Search, LayoutGrid, List,
  Eye, Settings, LayoutList, Type,
  ArrowLeft, X, Table2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { DocumentToFormOverlay } from '@/components/form-builder/document-to-form-overlay';
import { SubmissionsOverlay } from '@/components/form-builder/submissions-overlay';
import { formService } from '@/lib/supabase/form-service';
import { toast } from 'sonner';
import { useEffect } from 'react';

type FormItem = {
  id: string | number;
  title: string;
  submissions: number;
  date: string;
  dateLabel: 'edited' | 'created';
  type: 'folder' | 'form';
  starred: boolean;
};

const MOCK_FORMS: FormItem[] = [
  { id: 2, title: 'Form',                               submissions: 0, date: 'Apr 22, 2026', dateLabel: 'edited',  type: 'form',   starred: false },
  { id: 3, title: 'Form',                               submissions: 0, date: 'Apr 22, 2026', dateLabel: 'edited',  type: 'form',   starred: true  },
  { id: 4, title: 'Form',                               submissions: 0, date: 'Apr 21, 2026', dateLabel: 'edited',  type: 'form',   starred: false },
  { id: 5, title: 'Contact Information Collection Form', submissions: 0, date: 'Apr 21, 2026', dateLabel: 'created', type: 'form',  starred: false },
  { id: 6, title: 'Form',                               submissions: 0, date: 'Apr 21, 2026', dateLabel: 'edited',  type: 'form',   starred: false },
];

export default function FormsPage() {
  const router = useRouter();

  const [forms, setForms] = useState<FormItem[]>([]);
  const [selected, setSelected]     = useState<Set<string | number>>(new Set());
  const [openMoreId, setOpenMoreId] = useState<string | number | null>(null);
  const [search, setSearch]         = useState('');
  const [viewMode, setViewMode]     = useState<'list' | 'grid'>('list');
  const [showImport, setShowImport]   = useState(false);
  const [showDocToForm, setShowDocToForm] = useState(false);
  const [submissionsForm, setSubmissionsForm] = useState<{ id: string, title: string } | null>(null);

  useEffect(() => {
    async function loadForms() {
      try {
        const supabase = (await import('@/lib/supabase/client')).createClient();
        const { data, error } = await supabase
          .from('forms')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const dbForms: FormItem[] = data.map(f => ({
          id: f.id,
          title: f.title,
          submissions: 0,
          date: new Date(f.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          dateLabel: 'created',
          type: 'form',
          starred: false
        }));

        // Add a local draft entry if there's saved data AND it's not already in the DB list
        const localDraft = localStorage.getItem('vs_form_instances');
        const currentFormId = localStorage.getItem('vs_current_form_id');
        
        if (localDraft && currentFormId) {
          // Check if this form ID is already shown from DB (avoid duplicates)
          const alreadyListed = dbForms.some(f => f.id === currentFormId);
          if (!alreadyListed) {
            dbForms.unshift({
              id: currentFormId, // Use the REAL Supabase UUID
              title: 'Vision Solar Assessment',
              submissions: 0,
              date: 'Today',
              dateLabel: 'edited',
              type: 'form',
              starred: true
            });
          }
        }

        setForms(dbForms);
      } catch (err: any) {
        console.error("Error loading forms:", err);
      }
    }
    loadForms();
  }, []);

  const toggleSelect = (id: string | number) =>
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const selectAll = () => {
    if (selected.size === forms.length) setSelected(new Set());
    else setSelected(new Set(forms.map(f => f.id)));
  };

  const toggleStar = (id: string | number) =>
    setForms(prev => prev.map(f => f.id === id ? { ...f, starred: !f.starred } : f));

  const deleteForm = async (id: string | number) => {
    const promise = async () => {
      // 1. Delete from database
      await formService.deleteForm(id);
      
      // 2. Handle local draft cleanup if this is the active draft
      if (typeof window !== 'undefined') {
        const currentId = localStorage.getItem('vs_current_form_id');
        if (String(id) === String(currentId)) {
          localStorage.removeItem('vs_current_form_id');
          localStorage.removeItem('vs_form_instances');
        }
      }
      
      // 3. Update local state
      setForms(prev => prev.filter(f => f.id !== id));
      return { name: 'Form' };
    };

    toast.promise(promise(), {
      loading: 'Deleting form...',
      success: 'Form deleted successfully',
      error: 'Failed to delete form',
    });
  };

  const deleteSelected = async () => {
    const ids = Array.from(selected);
    const promise = async () => {
      // 1. Delete all from database
      await Promise.all(ids.map(id => formService.deleteForm(id)));
      
      // 2. Handle local draft cleanup
      if (typeof window !== 'undefined') {
        const currentId = localStorage.getItem('vs_current_form_id');
        if (ids.includes(currentId as any)) {
          localStorage.removeItem('vs_current_form_id');
          localStorage.removeItem('vs_form_instances');
        }
      }
      
      // 3. Update local state
      setForms(prev => prev.filter(f => !selected.has(f.id)));
      setSelected(new Set());
      return { count: ids.length };
    };

    toast.promise(promise(), {
      loading: `Deleting ${ids.length} forms...`,
      success: (data: any) => `${data.count} forms deleted successfully`,
      error: 'Failed to delete selected forms',
    });
  };

  const filtered = forms.filter(f =>
    f.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-off-white/40">

      {/* Page Header */}
      <div className="bg-white border-b border-light-gray/60 px-8 py-5 flex items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-charcoal tracking-tight">My Forms</h1>
          <p className="text-sm text-mid-gray mt-0.5">{forms.length} forms total</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-mid-gray pointer-events-none" />
            <input
              type="text"
              placeholder="Search forms..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-9 pl-9 pr-4 w-56 rounded-lg border border-light-gray bg-off-white text-sm outline-none focus:border-vision-green focus:bg-white transition-all"
            />
          </div>

          {/* View toggle */}
          <div className="flex items-center border border-light-gray rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`h-9 px-3 flex items-center transition-colors ${viewMode === 'list' ? 'bg-vision-green text-white' : 'bg-white text-mid-gray hover:text-charcoal'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`h-9 px-3 flex items-center transition-colors ${viewMode === 'grid' ? 'bg-vision-green text-white' : 'bg-white text-mid-gray hover:text-charcoal'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Create */}
          <DropdownMenu>
            <DropdownMenuTrigger className="h-9 px-5 rounded-lg bg-vision-green hover:bg-green-dark text-white text-sm font-bold tracking-wide shadow-sm flex items-center gap-2 transition-all">
              <Plus className="w-4 h-4" />
              Create
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 mt-2 shadow-xl rounded-xl border border-light-gray p-1">
              <DropdownMenuItem onClick={() => router.push('/form/builder')} className="cursor-pointer py-2.5 rounded-lg focus:bg-vision-green/5 focus:text-vision-green gap-2.5">
                <Plus className="w-4 h-4" /> Start from Scratch
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowImport(true)} className="cursor-pointer py-2.5 rounded-lg focus:bg-vision-green/5 focus:text-vision-green gap-2.5">
                <Upload className="w-4 h-4" /> Import Form
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowDocToForm(true)} className="cursor-pointer py-2.5 rounded-lg focus:bg-vision-green/5 focus:text-vision-green gap-2.5">
                <FileText className="w-4 h-4" /> Document to Form
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/form/sign')} className="cursor-pointer py-2.5 rounded-lg focus:bg-vision-green/5 focus:text-vision-green gap-2.5">
                <FileSignature className="w-4 h-4" /> Collect Signatures
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Bulk action bar — shows when rows selected */}
      {selected.size > 0 && (
        <div className="bg-vision-green/5 border-b border-vision-green/20 px-8 py-2.5 flex items-center gap-4 animate-in slide-in-from-top-2 duration-200 shrink-0">
          <span className="text-sm font-semibold text-vision-green">{selected.size} selected</span>
          <div className="h-4 w-px bg-vision-green/20" />
          <button 
            onClick={deleteSelected}
            className="text-sm text-mid-gray hover:text-red-500 font-medium flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
          <button className="text-sm text-mid-gray hover:text-charcoal font-medium flex items-center gap-1.5 transition-colors">
            <Copy className="w-4 h-4" /> Duplicate
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">

        {/* ── LIST VIEW ── */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-2xl border border-light-gray/60 shadow-sm overflow-hidden">

            {/* Column header */}
            <div className="flex items-center gap-3 px-5 py-3 border-b border-light-gray/50 bg-off-white/70">
              {/* Select all checkbox */}
              <button
                onClick={selectAll}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                  selected.size === forms.length && forms.length > 0
                    ? 'bg-vision-green border-vision-green'
                    : 'border-light-gray hover:border-mid-gray/60'
                }`}
              >
                {selected.size === forms.length && forms.length > 0 && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M1 4l3 3 5-5" />
                  </svg>
                )}
              </button>
              <div className="w-4" />
              <div className="w-10" />
              <span className="flex-1 text-[11px] font-black uppercase tracking-[0.12em] text-mid-gray/60">Name</span>
              <span className="hidden md:block w-44 text-[11px] font-black uppercase tracking-[0.12em] text-mid-gray/60">Last Activity</span>
              <div className="w-52" />
            </div>

            {/* Rows */}
            {filtered.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-mid-gray/50">
                <FileText className="w-10 h-10 mb-3 opacity-40" />
                <p className="text-sm font-medium">No forms found</p>
              </div>
            ) : (
              filtered.map((form, idx) => {
                const isSelected = selected.has(form.id);
                const isFolder   = form.type === 'folder';

                return (
                  <div
                    key={form.id}
                    onMouseLeave={() => setOpenMoreId(null)}
                    className={`relative flex items-center gap-3 px-5 transition-all duration-150 group ${
                      idx !== filtered.length - 1 ? 'border-b border-light-gray/40' : ''
                    } ${
                      isSelected ? 'bg-vision-green/5' : 'bg-white hover:bg-off-white/80'
                    }`}
                  >
                    {/* Selected left accent */}
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-vision-green rounded-r-full" />
                    )}

                    {/* Checkbox */}
                    <button
                      onClick={() => toggleSelect(form.id)}
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? 'bg-vision-green border-vision-green'
                          : 'border-light-gray hover:border-vision-green/50'
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M1 4l3 3 5-5" />
                        </svg>
                      )}
                    </button>

                    {/* Star */}
                    <button onClick={() => toggleStar(form.id)} className="w-4 h-4 flex items-center justify-center shrink-0">
                      <Star className={`w-4 h-4 transition-colors ${
                        form.starred ? 'fill-solar-orange text-solar-orange' : 'text-light-gray hover:text-solar-orange/60'
                      }`} />
                    </button>

                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                      isFolder ? 'bg-charcoal/8' : 'bg-solar-orange'
                    }`}>
                      {isFolder
                        ? <FolderOpen className="w-5 h-5 text-charcoal/50" />
                        : <FileText className="w-5 h-5 text-white" />
                      }
                    </div>

                    {/* Name + meta */}
                    <div className="flex-1 min-w-0 py-4 cursor-pointer" onClick={() => router.push('/form/builder')}>
                      <p className="text-sm font-semibold truncate text-charcoal group-hover:text-vision-green transition-colors">
                        {form.title}
                      </p>
                      <p className="text-xs text-mid-gray mt-0.5">
                        {isFolder
                          ? `1 Form · Last edited on ${form.date}`
                          : `${form.submissions} Submissions · ${form.dateLabel === 'created' ? 'Created' : 'Last edited'} on ${form.date}`
                        }
                      </p>
                    </div>

                    {/* Date column */}
                    <div className="hidden md:flex w-44 items-center shrink-0">
                      <span className="text-xs text-mid-gray">{form.date}</span>
                    </div>

                    {/* Actions — always visible */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        title="Edit Form"
                        onClick={() => router.push('/form/builder')}
                        className="w-8 h-8 rounded-lg bg-vision-green hover:bg-green-dark text-white flex items-center justify-center shadow-sm transition-all"
                      >
                        <PenLine className="w-4 h-4" />
                      </button>

                      <button
                        title="Submissions"
                        onClick={() => {
                          if (form.id !== 'local-draft') {
                            setSubmissionsForm({ id: String(form.id), title: form.title });
                          } else {
                            toast.info("Save this form first to see submissions!");
                          }
                        }}
                        className="w-8 h-8 rounded-lg border border-light-gray hover:border-vision-green/40 hover:bg-vision-green/5 hover:text-vision-green text-mid-gray flex items-center justify-center transition-all"
                      >
                        <Table2 className="w-4 h-4" />
                      </button>

                      <DropdownMenu open={openMoreId === form.id} onOpenChange={o => setOpenMoreId(o ? form.id : null)}>
                        <DropdownMenuTrigger
                          title="More options"
                          className="w-8 h-8 rounded-lg border border-light-gray hover:border-mid-gray/40 hover:bg-off-white text-mid-gray flex items-center justify-center transition-all"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 shadow-2xl rounded-2xl border border-light-gray/60 p-2 bg-white">
                          {/* Open group */}
                          <p className="px-2 pt-1 pb-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-mid-gray/50">Open</p>
                          <DropdownMenuItem onClick={() => router.push('/form/builder')} className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal focus:bg-vision-green/5 focus:text-vision-green transition-colors">
                            <div className="w-7 h-7 rounded-lg bg-vision-green/10 flex items-center justify-center shrink-0"><Eye className="w-3.5 h-3.5 text-vision-green" /></div>
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push('/form/builder')} className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal focus:bg-vision-green/5 focus:text-vision-green transition-colors">
                            <div className="w-7 h-7 rounded-lg bg-vision-green/10 flex items-center justify-center shrink-0"><PenLine className="w-3.5 h-3.5 text-vision-green" /></div>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-1.5 bg-light-gray/50" />
                          {/* Manage group */}
                          <p className="px-2 pb-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-mid-gray/50">Manage</p>
                          <DropdownMenuItem className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal focus:bg-vision-green/5 focus:text-vision-green transition-colors">
                            <div className="w-7 h-7 rounded-lg bg-solar-orange/10 flex items-center justify-center shrink-0"><Settings className="w-3.5 h-3.5 text-solar-orange" /></div>
                            Settings
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setOpenMoreId(null);
                              if (form.id !== 'local-draft') {
                                setSubmissionsForm({ id: String(form.id), title: form.title });
                              } else {
                                toast.info("Save this form first to see submissions!");
                              }
                            }}
                            className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal focus:bg-vision-green/5 focus:text-vision-green transition-colors"
                          >
                            <div className="w-7 h-7 rounded-lg bg-solar-orange/10 flex items-center justify-center shrink-0"><LayoutList className="w-3.5 h-3.5 text-solar-orange" /></div>
                            Submissions
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal focus:bg-vision-green/5 focus:text-vision-green transition-colors">
                            <div className="w-7 h-7 rounded-lg bg-solar-orange/10 flex items-center justify-center shrink-0"><Copy className="w-3.5 h-3.5 text-solar-orange" /></div>
                            Clone
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal focus:bg-vision-green/5 focus:text-vision-green transition-colors">
                            <div className="w-7 h-7 rounded-lg bg-solar-orange/10 flex items-center justify-center shrink-0"><Type className="w-3.5 h-3.5 text-solar-orange" /></div>
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-1.5 bg-light-gray/50" />
                          {/* Danger */}
                          <DropdownMenuItem onClick={() => deleteForm(form.id)} className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 focus:bg-red-50 focus:text-red-600 transition-colors">
                            <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0"><Trash2 className="w-3.5 h-3.5 text-red-500" /></div>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── GRID VIEW ── */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(form => {
              const isSelected = selected.has(form.id);
              const isFolder   = form.type === 'folder';

              return (
                <div
                  key={form.id}
                  className={`group relative bg-white rounded-2xl border transition-all cursor-pointer hover:shadow-lg hover:-translate-y-0.5 ${
                    isSelected
                      ? 'border-vision-green shadow-[0_0_0_2px_rgba(34,197,94,0.2)]'
                      : 'border-light-gray/60 hover:border-vision-green/40'
                  }`}
                  onClick={() => router.push('/form/builder')}
                >
                  {/* Checkbox overlay */}
                  <button
                    onClick={e => { e.stopPropagation(); toggleSelect(form.id); }}
                    className={`absolute top-3 left-3 z-10 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-vision-green border-vision-green opacity-100'
                        : 'border-white bg-white/80 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M1 4l3 3 5-5" />
                      </svg>
                    )}
                  </button>

                  {/* Star overlay */}
                  <button
                    onClick={e => { e.stopPropagation(); toggleStar(form.id); }}
                    className={`absolute top-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      form.starred
                        ? 'bg-white opacity-100'
                        : 'bg-black/20 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${form.starred ? 'fill-solar-orange text-solar-orange' : 'text-white'}`} />
                  </button>

                  {/* Card top banner */}
                  <div className={`h-28 rounded-t-2xl flex items-center justify-center ${
                    isFolder ? 'bg-charcoal/5' : 'bg-solar-orange/90'
                  }`}>
                    {isFolder
                      ? <FolderOpen className="w-10 h-10 text-charcoal/30" />
                      : <FileText className="w-10 h-10 text-white/80" />
                    }
                  </div>

                  {/* Card body */}
                  <div className="p-4">
                    <p className="text-sm font-bold text-charcoal truncate group-hover:text-vision-green transition-colors">{form.title}</p>
                    <p className="text-xs text-mid-gray mt-1">
                      {form.submissions} Submissions
                    </p>
                    <p className="text-[11px] text-mid-gray/70 mt-0.5">
                      {form.dateLabel === 'created' ? 'Created' : 'Edited'} {form.date}
                    </p>

                    {/* Action icons */}
                    <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-light-gray/50">
                      <button
                        title="Edit Form"
                        onClick={e => { e.stopPropagation(); router.push('/form/builder'); }}
                        className="w-8 h-8 rounded-lg bg-vision-green hover:bg-green-dark text-white flex items-center justify-center shadow-sm transition-all"
                      >
                        <PenLine className="w-4 h-4" />
                      </button>

                      <button
                        title="Submissions"
                        onClick={e => { 
                          e.stopPropagation(); 
                          if (form.id !== 'local-draft') {
                            setSubmissionsForm({ id: String(form.id), title: form.title });
                          } else {
                            toast.info("Save this form to Supabase first to see submissions!");
                          }
                        }}
                        className="w-8 h-8 rounded-lg border border-light-gray hover:border-vision-green/40 hover:bg-vision-green/5 hover:text-vision-green text-mid-gray flex items-center justify-center transition-all"
                      >
                        <Table2 className="w-4 h-4" />
                      </button>

                      <DropdownMenu open={openMoreId === form.id} onOpenChange={o => setOpenMoreId(o ? form.id : null)}>
                        <DropdownMenuTrigger
                          title="More options"
                          className="w-8 h-8 rounded-lg border border-light-gray hover:border-mid-gray/40 hover:bg-off-white text-mid-gray flex items-center justify-center transition-all"
                          onClick={e => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 shadow-2xl rounded-2xl border border-light-gray/60 p-2 bg-white">
                          <p className="px-2 pt-1 pb-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-mid-gray/50">Open</p>
                          <DropdownMenuItem onClick={e => { e.stopPropagation(); router.push('/form/builder'); }} className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal focus:bg-vision-green/5 focus:text-vision-green transition-colors">
                            <div className="w-7 h-7 rounded-lg bg-vision-green/10 flex items-center justify-center shrink-0"><Eye className="w-3.5 h-3.5 text-vision-green" /></div>
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={e => { e.stopPropagation(); router.push('/form/builder'); }} className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal focus:bg-vision-green/5 focus:text-vision-green transition-colors">
                            <div className="w-7 h-7 rounded-lg bg-vision-green/10 flex items-center justify-center shrink-0"><PenLine className="w-3.5 h-3.5 text-vision-green" /></div>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-1.5 bg-light-gray/50" />
                          <p className="px-2 pb-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-mid-gray/50">Manage</p>
                          <DropdownMenuItem onClick={e => e.stopPropagation()} className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal focus:bg-vision-green/5 focus:text-vision-green transition-colors">
                            <div className="w-7 h-7 rounded-lg bg-solar-orange/10 flex items-center justify-center shrink-0"><Settings className="w-3.5 h-3.5 text-solar-orange" /></div>
                            Settings
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={e => {
                              e.stopPropagation();
                              setOpenMoreId(null);
                              if (form.id !== 'local-draft') {
                                setSubmissionsForm({ id: String(form.id), title: form.title });
                              } else {
                                toast.info("Save this form first to see submissions!");
                              }
                            }}
                            className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal focus:bg-vision-green/5 focus:text-vision-green transition-colors"
                          >
                            <div className="w-7 h-7 rounded-lg bg-solar-orange/10 flex items-center justify-center shrink-0"><LayoutList className="w-3.5 h-3.5 text-solar-orange" /></div>
                            Submissions
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={e => e.stopPropagation()} className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal focus:bg-vision-green/5 focus:text-vision-green transition-colors">
                            <div className="w-7 h-7 rounded-lg bg-solar-orange/10 flex items-center justify-center shrink-0"><Copy className="w-3.5 h-3.5 text-solar-orange" /></div>
                            Clone
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={e => e.stopPropagation()} className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal focus:bg-vision-green/5 focus:text-vision-green transition-colors">
                            <div className="w-7 h-7 rounded-lg bg-solar-orange/10 flex items-center justify-center shrink-0"><Type className="w-3.5 h-3.5 text-solar-orange" /></div>
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-1.5 bg-light-gray/50" />
                          <DropdownMenuItem onClick={e => { e.stopPropagation(); deleteForm(form.id); }} className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 focus:bg-red-50 focus:text-red-600 transition-colors">
                            <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0"><Trash2 className="w-3.5 h-3.5 text-red-500" /></div>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── IMPORT FORM OVERLAY ── */}
      {showImport && (
        <div className="fixed inset-0 z-[200] bg-white animate-in fade-in duration-200 flex flex-col">

          {/* Top bar */}
          <div className="flex items-center justify-between px-8 py-5 shrink-0">
            <button
              onClick={() => setShowImport(false)}
              className="flex items-center gap-2 text-sm font-semibold text-mid-gray hover:text-charcoal transition-colors group"
            >
              <div className="w-8 h-8 rounded-full border border-light-gray group-hover:border-mid-gray/40 group-hover:bg-off-white flex items-center justify-center transition-all">
                <ArrowLeft className="w-4 h-4" />
              </div>
              Back
            </button>

            <button
              onClick={() => setShowImport(false)}
              className="w-9 h-9 rounded-full bg-off-white hover:bg-light-gray/60 flex items-center justify-center text-mid-gray hover:text-charcoal transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto flex flex-col items-center px-6 py-8">

            {/* Heading */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-vision-green/10 mb-4">
                <Upload className="w-7 h-7 text-vision-green" />
              </div>
              <h1 className="text-3xl font-bold text-charcoal tracking-tight">Import Form</h1>
              <p className="text-mid-gray mt-2 text-base">Bring your existing forms into VisionSolar in seconds</p>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-[900px]">

              {[
                {
                  icon: FileText,
                  iconColor: 'text-white',
                  bg: 'bg-red-400',
                  label: 'Upload PDF',
                  desc: 'Turn any existing PDF form into a fully editable digital form',
                },
                {
                  icon: Copy,
                  iconColor: 'text-white',
                  bg: 'bg-vision-green',
                  label: 'Clone a Form',
                  desc: 'Duplicate one of your existing forms as a starting point',
                },
                {
                  icon: Table2,
                  iconColor: 'text-white',
                  bg: 'bg-blue-500',
                  label: 'CSV / Excel',
                  desc: 'Import field data from a spreadsheet to generate your form',
                },
              ].map(({ icon: Icon, iconColor, bg, label, desc }) => (
                <button
                  key={label}
                  className="group bg-white rounded-2xl border border-light-gray/60 hover:border-vision-green/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all text-left p-6 flex flex-col gap-5"
                >
                  {/* Icon block */}
                  <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                    <Icon className={`w-7 h-7 ${iconColor}`} />
                  </div>

                  {/* Text */}
                  <div>
                    <p className="text-base font-bold text-charcoal group-hover:text-vision-green transition-colors">{label}</p>
                    <p className="text-sm text-mid-gray mt-1 leading-relaxed">{desc}</p>
                  </div>

                  {/* Arrow indicator */}
                  <div className="mt-auto pt-3 border-t border-light-gray/50 flex items-center justify-between">
                    <span className="text-xs font-semibold text-mid-gray group-hover:text-vision-green transition-colors uppercase tracking-wider">Get started</span>
                    <div className="w-6 h-6 rounded-full bg-off-white group-hover:bg-vision-green/10 flex items-center justify-center transition-colors">
                      <ArrowLeft className="w-3 h-3 rotate-180 text-mid-gray group-hover:text-vision-green transition-colors" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showDocToForm && <DocumentToFormOverlay onClose={() => setShowDocToForm(false)} />}
      
      {submissionsForm && (
        <SubmissionsOverlay 
          formId={submissionsForm.id} 
          formTitle={submissionsForm.title} 
          onClose={() => setSubmissionsForm(null)} 
        />
      )}
    </div>
  );
}

'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, FileSignature, Upload, Star, PenLine, Mail,
  MoreHorizontal, Search, LayoutGrid, List,
  Eye, Settings, Copy, Trash2, Type, Download,
  ArrowLeft, X, UploadCloud, CheckCircle2, FileText,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

type ESignDoc = {
  id: number;
  title: string;
  signers: number;
  date: string;
  dateLabel: 'edited' | 'created' | 'sent' | 'signed';
  status: 'Draft' | 'Sent' | 'Signed' | 'Expired';
  starred: boolean;
};

const MOCK_DOCS: ESignDoc[] = [
  { id: 1, title: 'Solar Installation Agreement',    signers: 2, date: 'Apr 22, 2026', dateLabel: 'signed',  status: 'Signed',  starred: true  },
  { id: 2, title: 'Service & Maintenance Contract',  signers: 1, date: 'Apr 21, 2026', dateLabel: 'sent',    status: 'Sent',    starred: false },
  { id: 3, title: 'Non-Disclosure Agreement',        signers: 3, date: 'Apr 20, 2026', dateLabel: 'edited',  status: 'Draft',   starred: false },
  { id: 4, title: 'Permit Authorization Form',       signers: 1, date: 'Apr 18, 2026', dateLabel: 'sent',    status: 'Expired', starred: false },
  { id: 5, title: 'Customer Consent Form',           signers: 1, date: 'Apr 17, 2026', dateLabel: 'signed',  status: 'Signed',  starred: true  },
  { id: 6, title: 'Grid Connection Agreement',       signers: 2, date: 'Apr 15, 2026', dateLabel: 'created', status: 'Draft',   starred: false },
];

const STATUS_STYLES: Record<ESignDoc['status'], string> = {
  Signed:  'bg-emerald-50 text-emerald-700',
  Sent:    'bg-blue-50 text-blue-700',
  Draft:   'bg-gray-100 text-gray-600',
  Expired: 'bg-red-50 text-red-500',
};

/* ── Upload Overlay ── */
function UploadOverlay({ onClose }: { onClose: () => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setUploadedFile(file);
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col animate-in fade-in duration-200"
      style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #f0fdf4 100%)' }}
    >
      <div className="flex items-center justify-between px-8 py-4 shrink-0">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm font-semibold text-mid-gray hover:text-charcoal transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-light-gray group-hover:border-mid-gray/40 group-hover:shadow-sm flex items-center justify-center transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back
        </button>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white border border-light-gray hover:border-mid-gray/40 hover:shadow-sm flex items-center justify-center text-mid-gray hover:text-charcoal transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-6 py-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-vision-green/10 mb-5 shadow-sm">
            <Upload className="w-8 h-8 text-vision-green" />
          </div>
          <h1 className="text-2xl font-bold text-charcoal tracking-tight">Upload Document</h1>
          <p className="text-mid-gray mt-2 text-sm max-w-xs mx-auto leading-relaxed">
            Upload a PDF or document to prepare it for eSign
          </p>
        </div>

        <div
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !uploadedFile && inputRef.current?.click()}
          className={`w-full max-w-[680px] rounded-3xl border-2 border-dashed transition-all duration-200 bg-white flex flex-col items-center justify-center py-16 px-8 text-center ${
            isDragging
              ? 'border-vision-green bg-vision-green/5 scale-[1.01] shadow-lg shadow-vision-green/10'
              : uploadedFile
              ? 'border-vision-green bg-vision-green/[0.03] cursor-default'
              : 'border-light-gray hover:border-vision-green/50 hover:shadow-md cursor-pointer'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.doc"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) setUploadedFile(f); }}
          />

          {uploadedFile ? (
            <>
              <div className="w-16 h-16 rounded-2xl bg-vision-green flex items-center justify-center mb-5 shadow-md shadow-vision-green/25">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <p className="text-base font-bold text-charcoal mb-1">{uploadedFile.name}</p>
              <p className="text-sm text-mid-gray mb-6">
                {(uploadedFile.size / 1024).toFixed(1)} KB · Ready to prepare
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setUploadedFile(null)}
                  className="h-10 px-5 rounded-xl border border-light-gray text-sm font-semibold text-mid-gray hover:border-red-300 hover:text-red-500 transition-all"
                >
                  Remove
                </button>
                <button className="h-10 px-7 rounded-xl bg-vision-green hover:bg-green-dark text-white text-sm font-bold tracking-wide shadow-sm hover:shadow-vision-green/30 transition-all flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Prepare for Signing
                </button>
              </div>
            </>
          ) : (
            <>
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-all duration-200 ${
                isDragging ? 'bg-vision-green shadow-lg shadow-vision-green/20 scale-110' : 'bg-off-white'
              }`}>
                <UploadCloud className={`w-9 h-9 transition-colors ${isDragging ? 'text-white' : 'text-mid-gray/50'}`} />
              </div>
              <h2 className="text-lg font-bold text-charcoal mb-2">
                {isDragging ? 'Drop it here!' : 'Upload your document'}
              </h2>
              <p className="text-sm text-mid-gray mb-8">
                {isDragging ? 'Release to upload your file' : 'Drag and drop your file here, or click to browse'}
              </p>
              <button
                onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}
                className="h-11 px-8 rounded-xl bg-vision-green hover:bg-green-dark text-white text-sm font-bold tracking-wide shadow-sm hover:shadow-md hover:shadow-vision-green/25 transition-all flex items-center gap-2"
              >
                <UploadCloud className="w-4 h-4" />
                Choose File
              </button>
              <p className="text-xs text-mid-gray/50 mt-6">
                Supported formats:&nbsp;
                <span className="font-semibold text-mid-gray">.pdf · .docx · .doc</span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Send to Email Overlay ── */
function SendEmailOverlay({ docTitle, onClose }: { docTitle: string; onClose: () => void }) {
  const [emails, setEmails] = useState('');
  const [message, setMessage] = useState('');

  return (
    <div className="fixed inset-0 z-[200] flex flex-col animate-in fade-in duration-200"
      style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #f0fdf4 100%)' }}
    >
      <div className="flex items-center justify-between px-8 py-4 shrink-0">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm font-semibold text-mid-gray hover:text-charcoal transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-light-gray group-hover:border-mid-gray/40 group-hover:shadow-sm flex items-center justify-center transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back
        </button>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white border border-light-gray hover:border-mid-gray/40 hover:shadow-sm flex items-center justify-center text-mid-gray hover:text-charcoal transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-6 py-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 mb-5 shadow-sm">
            <Mail className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-charcoal tracking-tight">Send for Signature</h1>
          <p className="text-mid-gray mt-2 text-sm max-w-xs mx-auto leading-relaxed">
            Send <span className="font-semibold text-charcoal">{docTitle}</span> to signers via email
          </p>
        </div>

        <div className="w-full max-w-[560px] bg-white rounded-3xl border border-light-gray/60 shadow-sm p-8 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">Recipients</label>
            <input
              type="text"
              placeholder="Enter email addresses, separated by commas"
              value={emails}
              onChange={e => setEmails(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-light-gray text-sm outline-none focus:border-vision-green focus:ring-2 focus:ring-vision-green/10 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">Message <span className="font-normal text-mid-gray">(optional)</span></label>
            <textarea
              rows={4}
              placeholder="Add a personal message for the recipients..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-light-gray text-sm outline-none focus:border-vision-green focus:ring-2 focus:ring-vision-green/10 transition-all resize-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border border-light-gray text-sm font-semibold text-mid-gray hover:border-mid-gray/60 hover:text-charcoal transition-all"
            >
              Cancel
            </button>
            <button className="flex-1 h-11 rounded-xl bg-vision-green hover:bg-green-dark text-white text-sm font-bold tracking-wide shadow-sm transition-all flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              Send for Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function ESignPage() {
  const router = useRouter();

  const [docs, setDocs]           = useState<ESignDoc[]>(MOCK_DOCS);
  const [selected, setSelected]   = useState<Set<number>>(new Set());
  const [openMoreId, setOpenMoreId] = useState<number | null>(null);
  const [search, setSearch]       = useState('');
  const [viewMode, setViewMode]   = useState<'list' | 'grid'>('list');
  const [showUpload, setShowUpload] = useState(false);
  const [sendEmailDoc, setSendEmailDoc] = useState<ESignDoc | null>(null);

  const toggleSelect = (id: number) =>
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const selectAll = () => {
    if (selected.size === docs.length) setSelected(new Set());
    else setSelected(new Set(docs.map(d => d.id)));
  };

  const toggleStar = (id: number) =>
    setDocs(prev => prev.map(d => d.id === id ? { ...d, starred: !d.starred } : d));

  const deleteDoc = (id: number) =>
    setDocs(prev => prev.filter(d => d.id !== id));

  const filtered = docs.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  if (showUpload) return <UploadOverlay onClose={() => setShowUpload(false)} />;
  if (sendEmailDoc) return <SendEmailOverlay docTitle={sendEmailDoc.title} onClose={() => setSendEmailDoc(null)} />;

  return (
    <div className="flex flex-col h-full bg-off-white/40">

      {/* Page Header */}
      <div className="bg-white border-b border-light-gray/60 px-8 py-5 flex items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-charcoal tracking-tight">My eSign Documents</h1>
          <p className="text-sm text-mid-gray mt-0.5">{docs.length} documents total</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-mid-gray pointer-events-none" />
            <input
              type="text"
              placeholder="Search documents..."
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

          {/* Upload */}
          <button
            onClick={() => setShowUpload(true)}
            className="h-9 px-4 rounded-lg border border-light-gray bg-white hover:border-vision-green/50 hover:bg-vision-green/5 text-mid-gray hover:text-vision-green text-sm font-semibold flex items-center gap-2 transition-all"
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>

          {/* Create */}
          <button
            onClick={() => router.push('/form/sign')}
            className="h-9 px-5 rounded-lg bg-vision-green hover:bg-green-dark text-white text-sm font-bold tracking-wide shadow-sm flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Document
          </button>
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="bg-vision-green/5 border-b border-vision-green/20 px-8 py-2.5 flex items-center gap-4 animate-in slide-in-from-top-2 duration-200 shrink-0">
          <span className="text-sm font-semibold text-vision-green">{selected.size} selected</span>
          <div className="h-4 w-px bg-vision-green/20" />
          <button className="text-sm text-mid-gray hover:text-red-500 font-medium flex items-center gap-1.5 transition-colors">
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
              <button
                onClick={selectAll}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                  selected.size === docs.length && docs.length > 0
                    ? 'bg-vision-green border-vision-green'
                    : 'border-light-gray hover:border-mid-gray/60'
                }`}
              >
                {selected.size === docs.length && docs.length > 0 && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M1 4l3 3 5-5" />
                  </svg>
                )}
              </button>
              <div className="w-4" />
              <div className="w-10" />
              <span className="flex-1 text-[11px] font-black uppercase tracking-[0.12em] text-mid-gray/60">Document Name</span>
              <span className="hidden md:block w-28 text-[11px] font-black uppercase tracking-[0.12em] text-mid-gray/60">Status</span>
              <span className="hidden md:block w-44 text-[11px] font-black uppercase tracking-[0.12em] text-mid-gray/60">Date</span>
              <div className="w-28" />
            </div>

            {/* Rows */}
            {filtered.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-mid-gray/50">
                <FileSignature className="w-10 h-10 mb-3 opacity-40" />
                <p className="text-sm font-medium">No documents found</p>
              </div>
            ) : (
              filtered.map((doc, idx) => {
                const isSelected = selected.has(doc.id);
                return (
                  <div
                    key={doc.id}
                    onMouseLeave={() => setOpenMoreId(null)}
                    className={`relative flex items-center gap-3 px-5 transition-all duration-150 group ${
                      idx !== filtered.length - 1 ? 'border-b border-light-gray/40' : ''
                    } ${isSelected ? 'bg-vision-green/5' : 'bg-white hover:bg-off-white/80'}`}
                  >
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-vision-green rounded-r-full" />
                    )}

                    {/* Checkbox */}
                    <button
                      onClick={() => toggleSelect(doc.id)}
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                        isSelected ? 'bg-vision-green border-vision-green' : 'border-light-gray hover:border-vision-green/50'
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M1 4l3 3 5-5" />
                        </svg>
                      )}
                    </button>

                    {/* Star */}
                    <button onClick={() => toggleStar(doc.id)} className="w-4 h-4 flex items-center justify-center shrink-0">
                      <Star className={`w-4 h-4 transition-colors ${
                        doc.starred ? 'fill-solar-orange text-solar-orange' : 'text-light-gray hover:text-solar-orange/60'
                      }`} />
                    </button>

                    {/* Icon */}
                    <div className="w-10 h-10 rounded-xl bg-vision-green/10 flex items-center justify-center shrink-0 shadow-sm">
                      <FileSignature className="w-5 h-5 text-vision-green" />
                    </div>

                    {/* Name + meta */}
                    <div className="flex-1 min-w-0 py-4 cursor-pointer" onClick={() => router.push('/form/sign')}>
                      <p className="text-sm font-semibold truncate text-charcoal group-hover:text-vision-green transition-colors">
                        {doc.title}
                      </p>
                      <p className="text-xs text-mid-gray mt-0.5">
                        {doc.signers} {doc.signers === 1 ? 'Signer' : 'Signers'} · {doc.dateLabel === 'created' ? 'Created' : doc.dateLabel === 'edited' ? 'Last edited' : doc.dateLabel === 'sent' ? 'Sent' : 'Signed'} on {doc.date}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="hidden md:flex w-28 items-center shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${STATUS_STYLES[doc.status]}`}>
                        {doc.status}
                      </span>
                    </div>

                    {/* Date column */}
                    <div className="hidden md:flex w-44 items-center shrink-0">
                      <span className="text-xs text-mid-gray">{doc.date}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        title="Edit Document"
                        onClick={() => router.push('/form/sign')}
                        className="w-8 h-8 rounded-lg bg-vision-green hover:bg-green-dark text-white flex items-center justify-center shadow-sm transition-all"
                      >
                        <PenLine className="w-4 h-4" />
                      </button>

                      <button
                        title="Send to Email"
                        onClick={() => setSendEmailDoc(doc)}
                        className="w-8 h-8 rounded-lg border border-light-gray hover:border-blue-300 hover:bg-blue-50 hover:text-blue-500 text-mid-gray flex items-center justify-center transition-all"
                      >
                        <Mail className="w-4 h-4" />
                      </button>

                      <DropdownMenu open={openMoreId === doc.id} onOpenChange={o => setOpenMoreId(o ? doc.id : null)}>
                        <DropdownMenuTrigger
                          title="More options"
                          className="w-8 h-8 rounded-lg border border-light-gray hover:border-mid-gray/40 hover:bg-off-white text-mid-gray flex items-center justify-center transition-all"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 shadow-2xl rounded-2xl border border-light-gray/60 p-2 bg-white">
                          <p className="px-2 pt-1 pb-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-mid-gray/50">Open</p>
                          <DropdownMenuItem onClick={() => router.push('/form/sign')} className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal focus:bg-vision-green/5 focus:text-vision-green">
                            <div className="w-7 h-7 rounded-lg bg-vision-green/10 flex items-center justify-center shrink-0"><Eye className="w-3.5 h-3.5 text-vision-green" /></div>
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push('/form/sign')} className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal focus:bg-vision-green/5 focus:text-vision-green">
                            <div className="w-7 h-7 rounded-lg bg-vision-green/10 flex items-center justify-center shrink-0"><PenLine className="w-3.5 h-3.5 text-vision-green" /></div>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-1.5 bg-light-gray/50" />
                          <p className="px-2 pb-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-mid-gray/50">Manage</p>
                          <DropdownMenuItem onClick={() => setSendEmailDoc(doc)} className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal focus:bg-blue-50 focus:text-blue-600">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0"><Mail className="w-3.5 h-3.5 text-blue-500" /></div>
                            Send to Email
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal focus:bg-vision-green/5 focus:text-vision-green">
                            <div className="w-7 h-7 rounded-lg bg-solar-orange/10 flex items-center justify-center shrink-0"><Download className="w-3.5 h-3.5 text-solar-orange" /></div>
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal focus:bg-vision-green/5 focus:text-vision-green">
                            <div className="w-7 h-7 rounded-lg bg-solar-orange/10 flex items-center justify-center shrink-0"><Settings className="w-3.5 h-3.5 text-solar-orange" /></div>
                            Settings
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal focus:bg-vision-green/5 focus:text-vision-green">
                            <div className="w-7 h-7 rounded-lg bg-solar-orange/10 flex items-center justify-center shrink-0"><Copy className="w-3.5 h-3.5 text-solar-orange" /></div>
                            Clone
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal focus:bg-vision-green/5 focus:text-vision-green">
                            <div className="w-7 h-7 rounded-lg bg-solar-orange/10 flex items-center justify-center shrink-0"><Type className="w-3.5 h-3.5 text-solar-orange" /></div>
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-1.5 bg-light-gray/50" />
                          <DropdownMenuItem onClick={() => deleteDoc(doc.id)} className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 focus:bg-red-50 focus:text-red-600">
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
            {filtered.map(doc => {
              const isSelected = selected.has(doc.id);
              return (
                <div
                  key={doc.id}
                  className={`group relative bg-white rounded-2xl border transition-all cursor-pointer hover:shadow-lg hover:-translate-y-0.5 ${
                    isSelected
                      ? 'border-vision-green shadow-[0_0_0_2px_rgba(34,197,94,0.2)]'
                      : 'border-light-gray/60 hover:border-vision-green/40'
                  }`}
                  onClick={() => router.push('/form/sign')}
                >
                  {/* Checkbox */}
                  <button
                    onClick={e => { e.stopPropagation(); toggleSelect(doc.id); }}
                    className={`absolute top-3 left-3 z-10 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                      isSelected ? 'bg-vision-green border-vision-green opacity-100' : 'border-white bg-white/80 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M1 4l3 3 5-5" />
                      </svg>
                    )}
                  </button>

                  {/* Star */}
                  <button
                    onClick={e => { e.stopPropagation(); toggleStar(doc.id); }}
                    className={`absolute top-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      doc.starred ? 'bg-white opacity-100' : 'bg-black/20 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${doc.starred ? 'fill-solar-orange text-solar-orange' : 'text-white'}`} />
                  </button>

                  {/* Banner */}
                  <div className="h-28 rounded-t-2xl bg-vision-green/10 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-vision-green/5 to-vision-green/20" />
                    <FileSignature className="w-10 h-10 text-vision-green/60 relative z-10" />
                    {/* Status badge on banner */}
                    <span className={`absolute bottom-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_STYLES[doc.status]}`}>
                      {doc.status}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <p className="text-sm font-bold text-charcoal truncate group-hover:text-vision-green transition-colors">{doc.title}</p>
                    <p className="text-xs text-mid-gray mt-1">
                      {doc.signers} {doc.signers === 1 ? 'Signer' : 'Signers'}
                    </p>
                    <p className="text-[11px] text-mid-gray/70 mt-0.5">
                      {doc.dateLabel === 'created' ? 'Created' : doc.dateLabel === 'edited' ? 'Edited' : doc.dateLabel === 'sent' ? 'Sent' : 'Signed'} {doc.date}
                    </p>

                    {/* Action icons */}
                    <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-light-gray/50">
                      <button
                        title="Edit"
                        onClick={e => { e.stopPropagation(); router.push('/form/sign'); }}
                        className="w-8 h-8 rounded-lg bg-vision-green hover:bg-green-dark text-white flex items-center justify-center shadow-sm transition-all"
                      >
                        <PenLine className="w-4 h-4" />
                      </button>

                      <button
                        title="Send to Email"
                        onClick={e => { e.stopPropagation(); setSendEmailDoc(doc); }}
                        className="w-8 h-8 rounded-lg border border-light-gray hover:border-blue-300 hover:bg-blue-50 hover:text-blue-500 text-mid-gray flex items-center justify-center transition-all"
                      >
                        <Mail className="w-4 h-4" />
                      </button>

                      <DropdownMenu open={openMoreId === doc.id} onOpenChange={o => setOpenMoreId(o ? doc.id : null)}>
                        <DropdownMenuTrigger
                          title="More options"
                          className="w-8 h-8 rounded-lg border border-light-gray hover:border-mid-gray/40 hover:bg-off-white text-mid-gray flex items-center justify-center transition-all"
                          onClick={e => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 shadow-2xl rounded-2xl border border-light-gray/60 p-2 bg-white">
                          <p className="px-2 pt-1 pb-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-mid-gray/50">Open</p>
                          <DropdownMenuItem onClick={e => { e.stopPropagation(); router.push('/form/sign'); }} className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal focus:bg-vision-green/5 focus:text-vision-green">
                            <div className="w-7 h-7 rounded-lg bg-vision-green/10 flex items-center justify-center shrink-0"><Eye className="w-3.5 h-3.5 text-vision-green" /></div>
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={e => { e.stopPropagation(); router.push('/form/sign'); }} className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal focus:bg-vision-green/5 focus:text-vision-green">
                            <div className="w-7 h-7 rounded-lg bg-vision-green/10 flex items-center justify-center shrink-0"><PenLine className="w-3.5 h-3.5 text-vision-green" /></div>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-1.5 bg-light-gray/50" />
                          <p className="px-2 pb-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-mid-gray/50">Manage</p>
                          <DropdownMenuItem onClick={e => { e.stopPropagation(); setSendEmailDoc(doc); }} className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal focus:bg-blue-50 focus:text-blue-600">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0"><Mail className="w-3.5 h-3.5 text-blue-500" /></div>
                            Send to Email
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={e => e.stopPropagation()} className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal focus:bg-vision-green/5 focus:text-vision-green">
                            <div className="w-7 h-7 rounded-lg bg-solar-orange/10 flex items-center justify-center shrink-0"><Download className="w-3.5 h-3.5 text-solar-orange" /></div>
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={e => e.stopPropagation()} className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal focus:bg-vision-green/5 focus:text-vision-green">
                            <div className="w-7 h-7 rounded-lg bg-solar-orange/10 flex items-center justify-center shrink-0"><Settings className="w-3.5 h-3.5 text-solar-orange" /></div>
                            Settings
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={e => e.stopPropagation()} className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal focus:bg-vision-green/5 focus:text-vision-green">
                            <div className="w-7 h-7 rounded-lg bg-solar-orange/10 flex items-center justify-center shrink-0"><Copy className="w-3.5 h-3.5 text-solar-orange" /></div>
                            Clone
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={e => e.stopPropagation()} className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal focus:bg-vision-green/5 focus:text-vision-green">
                            <div className="w-7 h-7 rounded-lg bg-solar-orange/10 flex items-center justify-center shrink-0"><Type className="w-3.5 h-3.5 text-solar-orange" /></div>
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-1.5 bg-light-gray/50" />
                          <DropdownMenuItem onClick={e => { e.stopPropagation(); deleteDoc(doc.id); }} className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 focus:bg-red-50 focus:text-red-600">
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
    </div>
  );
}

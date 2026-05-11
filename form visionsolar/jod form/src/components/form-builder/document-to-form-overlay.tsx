'use client';

import { useState, useRef } from 'react';
import { ArrowLeft, X, UploadCloud, FileText, CheckCircle2, ChevronRight } from 'lucide-react';

const STEPS = ['Upload', 'Build', 'Settings', 'Publish'];

type Props = { onClose: () => void };

export function DocumentToFormOverlay({ onClose }: Props) {
  const [activeStep]                    = useState(0);
  const [isDragging, setIsDragging]     = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const inputRef                        = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setUploadedFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col animate-in fade-in duration-200"
      style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #f0fdf4 100%)' }}
    >
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-8 py-4 shrink-0">

        {/* Back */}
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm font-semibold text-mid-gray hover:text-charcoal transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-light-gray group-hover:border-mid-gray/40 group-hover:shadow-sm flex items-center justify-center transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back
        </button>

        {/* Step indicator — no numbers */}
        <div className="flex items-center gap-0.5">
          {STEPS.map((step, i) => {
            const isActive   = i === activeStep;
            const isComplete = i < activeStep;

            return (
              <div key={step} className="flex items-center">
                <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${
                  isActive
                    ? 'bg-vision-green text-white shadow-sm shadow-vision-green/25'
                    : isComplete
                    ? 'text-vision-green'
                    : 'text-mid-gray/40'
                }`}>
                  {isComplete && <CheckCircle2 className="w-3 h-3" />}
                  {step}
                </div>
                {i < STEPS.length - 1 && (
                  <ChevronRight className={`w-3.5 h-3.5 mx-0.5 ${
                    i < activeStep ? 'text-vision-green' : 'text-light-gray'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white border border-light-gray hover:border-mid-gray/40 hover:shadow-sm flex items-center justify-center text-mid-gray hover:text-charcoal transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-6 py-8">

        {/* Icon + heading */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-solar-orange/10 mb-5 shadow-sm">
            <FileText className="w-8 h-8 text-solar-orange" />
          </div>
          <h1 className="text-2xl font-bold text-charcoal tracking-tight">Document to Form</h1>
          <p className="text-mid-gray mt-2 text-sm max-w-xs mx-auto leading-relaxed">
            Upload a document and we'll convert it into a live form automatically
          </p>
        </div>

        {/* Drop zone card */}
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
            accept=".docx,.pdf,.jpeg,.jpg,.png,.heic"
            className="hidden"
            onChange={handleFileChange}
          />

          {uploadedFile ? (
            /* Uploaded state */
            <>
              <div className="w-16 h-16 rounded-2xl bg-vision-green flex items-center justify-center mb-5 shadow-md shadow-vision-green/25">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <p className="text-base font-bold text-charcoal mb-1">{uploadedFile.name}</p>
              <p className="text-sm text-mid-gray mb-6">
                {(uploadedFile.size / 1024).toFixed(1)} KB · Ready to convert
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setUploadedFile(null)}
                  className="h-10 px-5 rounded-xl border border-light-gray text-sm font-semibold text-mid-gray hover:border-red-300 hover:text-red-500 transition-all"
                >
                  Remove
                </button>
                <button
                  className="h-10 px-7 rounded-xl bg-vision-green hover:bg-green-dark text-white text-sm font-bold tracking-wide shadow-sm hover:shadow-vision-green/30 transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Convert to Form
                </button>
              </div>
            </>
          ) : (
            /* Default / dragging state */
            <>
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-all duration-200 ${
                isDragging ? 'bg-vision-green shadow-lg shadow-vision-green/20 scale-110' : 'bg-off-white'
              }`}>
                <UploadCloud className={`w-9 h-9 transition-colors ${isDragging ? 'text-white' : 'text-mid-gray/50'}`} />
              </div>

              <h2 className="text-lg font-bold text-charcoal mb-2">
                {isDragging ? 'Drop it here!' : 'Convert your document to an online form'}
              </h2>
              <p className="text-sm text-mid-gray mb-8">
                {isDragging ? 'Release to upload your file' : 'Drag and drop your file here, or click to browse'}
              </p>

              <button
                onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}
                className="h-11 px-8 rounded-xl bg-vision-green hover:bg-green-dark text-white text-sm font-bold tracking-wide shadow-sm hover:shadow-md hover:shadow-vision-green/25 transition-all flex items-center gap-2"
              >
                <UploadCloud className="w-4 h-4" />
                Upload Document
              </button>

              <p className="text-xs text-mid-gray/50 mt-6">
                Supported formats:&nbsp;
                <span className="font-semibold text-mid-gray">.docx · .pdf · .jpeg · .png · .heic</span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

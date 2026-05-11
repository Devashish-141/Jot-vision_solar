'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formElements, FormElementDef, FormInstance } from '@/lib/form-elements';
import { 
  GripVertical, X, Edit2, Check, Calendar, Clock, 
  PenTool, ChevronDown, Image as ImageIcon, UploadCloud, 
  Timer, Star, Minus, FoldVertical, Columns, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { formService } from '@/lib/supabase/form-service';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// --- Sidebar Draggable Tool ---
export function DraggableSidebarElement({ 
  element, 
  onDoubleClick 
}: { 
  element: FormElementDef;
  onDoubleClick?: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${element.id}`,
    data: {
      type: 'SidebarElement',
      element,
    },
  });

  const Icon = element.icon;

  return (
    <div
      ref={setNodeRef}
      onDoubleClick={onDoubleClick}
      {...listeners}
      {...attributes}
      className={`
        flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg
        cursor-grab border transition-all duration-200 select-none
        ${isDragging ? 'opacity-50 ring-2 ring-vision-green shadow-lg border-vision-green bg-green-50 text-vision-green' : 'border-transparent hover:border-light-gray hover:bg-off-white text-dark-gray hover:text-charcoal'}
      `}
    >
      <div className={`p-1.5 rounded-md select-none pointer-events-none transition-colors ${isDragging ? 'bg-vision-green text-white' : 'bg-off-white text-mid-gray group-hover:bg-white group-hover:text-vision-green'}`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="pointer-events-none text-xs">{element.label}</span>
    </div>
  );
}

// --- Canvas Rendered UI Preview ---
export function RenderFieldUI({ 
  type, 
  label, 
  properties, 
  readOnly = false,
  value,
  onValueChange
}: { 
  type: string, 
  label: string, 
  properties?: Record<string, any>,
  readOnly?: boolean,
  value?: any,
  onValueChange?: (val: any) => void
}) {
  const [isFieldUploading, setIsFieldUploading] = useState(false);

  // Simple mockups for the canvas builder preview
  switch (type) {
    case 'Heading':
      return <h2 className="text-2xl font-bold text-charcoal">{label}</h2>;
    case 'FullName':
      return (
        <div className="flex flex-col gap-2 w-full">
          {label && <label className="text-sm font-semibold text-charcoal">{label}</label>}
          <div className="flex gap-4 w-full">
            <div className="flex-1 space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-mid-gray px-1">First Name</label>
              <Input 
                className="h-10 rounded-lg" 
                placeholder={properties?.firstNamePlaceholder || 'First'} 
                readOnly={readOnly} 
                value={value?.firstName || ""}
                onChange={(e) => onValueChange?.({...value, firstName: e.target.value})}
              />
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-mid-gray px-1">Last Name</label>
              <Input 
                className="h-10 rounded-lg" 
                placeholder={properties?.lastNamePlaceholder || 'Last'} 
                readOnly={readOnly} 
                value={value?.lastName || ""}
                onChange={(e) => onValueChange?.({...value, lastName: e.target.value})}
              />
            </div>
          </div>
        </div>
      );
    case 'Email':
      return (
        <div className="space-y-1.5">
          {label && <label className="text-sm font-semibold text-charcoal">{label}</label>}
          <Input 
            className="h-10 rounded-lg" 
            type="email" 
            placeholder={properties?.placeholder || "example@email.com"} 
            readOnly={readOnly} 
            value={value || ""}
            onChange={(e) => onValueChange?.(e.target.value)}
          />
        </div>
      );
    case 'ShortText':
    case 'Address':
    case 'Phone':
      return (
        <div className="space-y-1.5">
          {label && <label className="text-sm font-semibold text-charcoal">{label}</label>}
          <Input 
            className="h-10 rounded-lg" 
            placeholder={properties?.placeholder || "Type here..."} 
            readOnly={readOnly} 
            value={value || ""}
            onChange={(e) => onValueChange?.(e.target.value)}
          />
        </div>
      );
    case 'LongText':
      return (
        <div className="space-y-1.5">
          {label && <label className="text-sm font-semibold text-charcoal">{label}</label>}
          <textarea 
            className="w-full min-h-[120px] border border-light-gray rounded-lg p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-vision-green/20 focus:border-vision-green transition-all resize-none bg-white placeholder:text-mid-gray/50" 
            placeholder={properties?.placeholder || "Type your response here..."} 
            readOnly={readOnly} 
            value={value || ""}
            onChange={(e) => onValueChange?.(e.target.value)}
          />
        </div>
      );
    case 'Paragraph':
      return (
        <div className="py-2">
          {label && <h4 className="text-sm font-bold text-charcoal mb-1">{label}</h4>}
          <div className="text-sm leading-relaxed text-dark-gray/90 whitespace-pre-wrap font-normal break-words">
            {properties?.placeholder || "Add your paragraph text here. This element is used for displaying information to the user without requiring an input."}
          </div>
        </div>
      );
    case 'DatePicker':
      const date = value ? new Date(value) : undefined;
      return (
        <div className="space-y-1.5">
          {label && <label className="text-sm font-semibold text-charcoal">{label}</label>}
          <Popover>
            <PopoverTrigger
              disabled={readOnly}
              className={cn(
                "w-full h-10 border border-light-gray rounded-lg px-3 flex items-center justify-between text-sm cursor-pointer bg-white transition-all hover:border-vision-green",
                !date && "text-mid-gray",
                readOnly && "hover:shadow-sm opacity-100"
              )}
            >
              <span className="truncate">{date ? format(date, "PPP") : (properties?.placeholder || "Pick a date")}</span>
              <Calendar className="w-4 h-4 text-mid-gray shrink-0" />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={(d) => onValueChange?.(d?.toISOString())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      );
    case 'Signature':
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const canvasRef = React.useRef<HTMLCanvasElement>(null);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [isDrawing, setIsDrawing] = useState(false);

      const startDrawing = (e: React.MouseEvent) => {
        if (readOnly) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#111827';
        setIsDrawing(true);
      };

      const draw = (e: React.MouseEvent) => {
        if (!isDrawing || readOnly) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);

        ctx.lineTo(x, y);
        ctx.stroke();
      };

      const stopDrawing = async () => {
        if (isDrawing) {
          setIsDrawing(false);
          const canvas = canvasRef.current;
          if (canvas) {
            const dataUrl = canvas.toDataURL();
            onValueChange?.(dataUrl);

            // Also upload to storage for persistence
            try {
              canvas.toBlob(async (blob) => {
                if (blob) {
                  const file = new File([blob], `signature_${Date.now()}.png`, { type: 'image/png' });
                  const url = await formService.uploadFile(file);
                  onValueChange?.(url);
                }
              });
            } catch (err) {
              console.error("Failed to upload signature:", err);
            }
          }
        }
      };

      const clearSignature = (e: React.MouseEvent) => {
        e.stopPropagation();
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onValueChange?.(null);
      };

      return (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            {label && <label className="text-sm font-semibold text-charcoal">{label}</label>}
            {value && !readOnly && (
              <button 
                onClick={clearSignature}
                className="text-[10px] font-bold text-red-500 uppercase tracking-wider hover:text-red-600 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <div className="relative group/sig border-2 border-dashed border-light-gray rounded-xl overflow-hidden bg-gray-50/30 transition-all hover:border-vision-green/40">
            {readOnly && value ? (
              <img src={value} alt="Signature" className="w-full h-[150px] object-contain bg-white" />
            ) : (
              <>
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={200}
                  className={`w-full h-[150px] cursor-crosshair ${readOnly ? 'pointer-events-none' : ''}`}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
                {!value && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-mid-gray/40 text-xs italic">
                    Sign here
                  </div>
                )}
                {value && !readOnly && (
                   <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
                     <img src={value} alt="Signature Preview" className="max-h-full max-w-full object-contain" />
                   </div>
                )}
              </>
            )}
          </div>
        </div>
      );
    case 'Dropdown':
      const dropdownOptions = properties?.options 
        ? (properties.options.includes('[') ? JSON.parse(properties.options) : properties.options.split(',').map((o: string) => o.trim()))
        : ["Option 1", "Option 2", "Option 3"];
      return (
        <div className="space-y-1.5">
          {label && <label className="text-sm font-semibold text-charcoal">{label}</label>}
          <div className="relative">
            <select 
              value={value || ""}
              onChange={(e) => onValueChange?.(e.target.value)}
              disabled={readOnly}
              className={cn(
                "w-full h-10 border border-light-gray rounded-lg px-3 text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-vision-green/20 focus:border-vision-green transition-all",
                !value && "text-mid-gray",
                readOnly && "cursor-default opacity-100"
              )}
            >
              <option value="" disabled>{properties?.placeholder || "Select an option"}</option>
              {dropdownOptions.map((opt: string) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mid-gray pointer-events-none" />
          </div>
        </div>
      );
    case 'SingleChoice':
      const singleOptions = properties?.options 
        ? (properties.options.includes('[') ? JSON.parse(properties.options) : properties.options.split(',').map((o: string) => o.trim()))
        : ["Option 1", "Option 2", "Option 3"];
      return (
        <div className="space-y-2">
          {label && <label className="text-sm font-semibold text-charcoal">{label}</label>}
          <div className="grid gap-2">
            {singleOptions.map((opt: string) => (
              <div 
                key={opt}
                onClick={() => !readOnly && onValueChange?.(opt)}
                className={cn(
                  "flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all",
                  value === opt ? "border-vision-green bg-green-50/30 ring-1 ring-vision-green" : "border-light-gray hover:border-vision-green/40 bg-white",
                  readOnly && "cursor-default opacity-80"
                )}
              >
                <div className={cn(
                  "w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                  value === opt ? "border-vision-green bg-vision-green shadow-[0_0_0_2px_rgba(92,143,90,0.1)]" : "border-mid-gray bg-white"
                )}>
                  {value === opt && <div className="w-1.5 h-1.5 rounded-full bg-white animate-in zoom-in" />}
                </div>
                <span className="text-sm font-medium text-charcoal">{opt}</span>
              </div>
            ))}
          </div>
        </div>
      );
    case 'MultipleChoice':
      const multiSelected = Array.isArray(value) ? value : [];
      const multiOptions = properties?.options 
        ? (properties.options.includes('[') ? JSON.parse(properties.options) : properties.options.split(',').map((o: string) => o.trim()))
        : ["Option 1", "Option 2", "Option 3"];
      
      const toggleOption = (opt: string) => {
        if (readOnly) return;
        const newValue = multiSelected.includes(opt) 
          ? multiSelected.filter(o => o !== opt) 
          : [...multiSelected, opt];
        onValueChange?.(newValue);
      };

      return (
        <div className="space-y-2">
          {label && <label className="text-sm font-semibold text-charcoal">{label}</label>}
          <div className="grid gap-2">
            {multiOptions.map((opt: string) => (
              <div 
                key={opt}
                onClick={() => toggleOption(opt)}
                className={cn(
                  "flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all",
                  multiSelected.includes(opt) ? "border-vision-green bg-green-50/30 ring-1 ring-vision-green" : "border-light-gray hover:border-vision-green/40 bg-white",
                  readOnly && "cursor-default opacity-80"
                )}
              >
                <div className={cn(
                  "w-4 h-4 rounded-md border flex items-center justify-center transition-all",
                  multiSelected.includes(opt) ? "border-vision-green bg-vision-green shadow-[0_0_0_2px_rgba(92,143,90,0.1)]" : "border-mid-gray bg-white"
                )}>
                  {multiSelected.includes(opt) && <Check className="w-3 h-3 text-white animate-in zoom-in" />}
                </div>
                <span className="text-sm font-medium text-charcoal">{opt}</span>
              </div>
            ))}
          </div>
        </div>
      );
    case 'Number':
      return (
        <div className="space-y-1.5">
          {label && <label className="text-sm font-semibold text-charcoal">{label}</label>}
          <Input 
            type="number" 
            placeholder={properties?.placeholder || "0"} 
            readOnly={readOnly} 
            value={value || ""}
            onChange={(e) => onValueChange?.(e.target.value)}
            className="h-10 rounded-lg focus-visible:ring-vision-green"
          />
        </div>
      );
    case 'Image': {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const imgInputRef = React.useRef<HTMLInputElement>(null);

      const handleImgChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          setIsFieldUploading(true);
          const loadingToast = toast.loading("Uploading image...");
          try {
            const url = await formService.uploadFile(file);
            onValueChange?.(url);
            toast.success("Image uploaded", { id: loadingToast });
          } catch (err: any) {
            toast.error("Upload failed", { id: loadingToast, description: err.message });
          } finally {
            setIsFieldUploading(false);
          }
        }
      };

      return (
        <div className="space-y-1.5">
          {label && <label className="text-sm font-semibold text-charcoal">{label}</label>}
          <input 
            type="file" 
            className="hidden" 
            ref={imgInputRef} 
            onChange={handleImgChange}
            accept="image/*" 
            disabled={readOnly}
          />
          <div 
            onClick={() => !readOnly && imgInputRef.current?.click()}
            className={cn(
              "w-full min-h-[200px] border-2 border-dashed border-light-gray/60 rounded-2xl bg-off-white flex flex-col items-center justify-center gap-3 text-mid-gray transition-all overflow-hidden relative group/img",
              !readOnly && "hover:border-vision-green hover:bg-green-50/20 cursor-pointer hover:shadow-inner",
              value && "border-none"
            )}
          >
            {value ? (
              <>
                <img src={value} alt="Preview" className="w-full h-full object-cover animate-in fade-in zoom-in-95" />
                {!readOnly && (
                  <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="h-8 px-4 text-[10px] font-bold rounded-full bg-white text-charcoal hover:bg-white/90 shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        imgInputRef.current?.click();
                      }}
                    >
                      CHANGE IMAGE
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="h-8 px-4 text-[10px] font-bold rounded-full shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        onValueChange?.(null);
                        if (imgInputRef.current) imgInputRef.current.value = '';
                      }}
                    >
                      REMOVE
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="p-4 bg-white rounded-full shadow-sm transition-transform group-hover/img:scale-110">
                  {isFieldUploading ? <Loader2 className="w-8 h-8 animate-spin text-vision-green" /> : <ImageIcon className="w-8 h-8 opacity-60" />}
                </div>
                <div className="text-center">
                  <span className="text-sm font-bold text-charcoal">Click to upload image</span>
                  <p className="text-[11px] opacity-60 mt-1 uppercase tracking-wider">Supports PNG, JPG, WEBP</p>
                </div>
              </>
            )}
          </div>
        </div>
      );
    }
    case 'FileUpload': {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const fileInputRef = React.useRef<HTMLInputElement>(null);

      const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
          setIsFieldUploading(true);
          const loadingToast = toast.loading(`Uploading ${files.length} file(s)...`);
          try {
            const urls = await Promise.all(
              Array.from(files).map(file => formService.uploadFile(file))
            );
            // If multiple files, store as comma-separated URLs
            onValueChange?.(urls.join(', '));
            toast.success("Files uploaded", { id: loadingToast });
          } catch (err: any) {
            toast.error("Upload failed", { id: loadingToast, description: err.message });
          } finally {
            setIsFieldUploading(false);
          }
        }
      };

      return (
        <div className="space-y-1">
          {label && <label className="text-sm font-medium">{label}</label>}
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            multiple 
            disabled={readOnly}
          />
          <div 
            onClick={() => !readOnly && fileInputRef.current?.click()}
            className={cn(
              "w-full py-8 border-2 border-dashed border-light-gray rounded-lg bg-off-white flex flex-col items-center justify-center gap-2 text-mid-gray transition-all",
              !readOnly && "hover:border-vision-green hover:bg-green-50/30 cursor-pointer",
              value && "border-vision-green bg-green-50/20"
            )}
          >
            {value ? (
              <div className="flex flex-col items-center gap-2 w-full px-4 animate-in fade-in zoom-in-95">
                <div className="p-3 bg-vision-green/10 rounded-full text-vision-green">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-charcoal">Files selected</p>
                  <p className="text-[11px] opacity-70 truncate max-w-[250px] mt-0.5">
                    {value}
                  </p>
                </div>
                {!readOnly && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-3 mt-1 text-[11px] font-bold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onValueChange?.(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    CLEAR SELECTION
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="p-3 bg-light-gray/20 rounded-full group-hover:bg-vision-green/10 group-hover:text-vision-green transition-colors">
                  {isFieldUploading ? <Loader2 className="w-8 h-8 animate-spin text-vision-green" /> : <UploadCloud className="w-8 h-8" />}
                </div>
                <div className="text-center">
                  <span className="text-sm font-bold text-charcoal">Click to upload or drag and drop</span>
                  <p className="text-[11px] opacity-60 mt-0.5">Supported formats: PDF, PNG, JPG (Max 50MB)</p>
                </div>
              </>
            )}
          </div>
        </div>
      );
    }
    case 'Time':
      return (
        <div className="space-y-1.5">
          {label && <label className="text-sm font-semibold text-charcoal">{label}</label>}
          <div className="relative group/time">
            <input 
              type="time" 
              value={value || ""}
              onChange={(e) => onValueChange?.(e.target.value)}
              readOnly={readOnly}
              className={cn(
                "w-full h-10 border border-light-gray rounded-lg px-3 pr-10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-vision-green/20 focus:border-vision-green transition-all",
                !value && "text-mid-gray",
                readOnly && "cursor-default"
              )}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-mid-gray group-hover/time:text-vision-green transition-colors">
              <Timer className="w-4 h-4" />
            </div>
          </div>
        </div>
      );
    case 'StarRating':
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [hover, setHover] = useState(0);
      return (
        <div className="space-y-2">
          {label && <label className="text-sm font-medium">{label}</label>}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={cn(
                  "w-8 h-8 transition-all duration-200 cursor-pointer",
                  (hover || (value || 0)) >= star ? "fill-yellow-400 text-yellow-400 scale-110" : "text-light-gray",
                  readOnly && "cursor-default scale-100"
                )}
                onClick={() => !readOnly && onValueChange?.(star)}
                onMouseEnter={() => !readOnly && setHover(star)}
                onMouseLeave={() => !readOnly && setHover(0)}
              />
            ))}
          </div>
          {(value > 0) && !readOnly && (
            <p className="text-[10px] font-bold text-mid-gray animate-in fade-in mt-1">
              RATING: {value} / 5
            </p>
          )}
        </div>
      );
    case 'SectionCollapse':
      return (
        <div className="w-full border border-light-gray rounded-lg overflow-hidden">
          <div className="bg-off-white px-4 py-3 flex items-center justify-between border-b border-light-gray cursor-pointer">
            <span className="font-semibold text-charcoal">{label}</span>
            <ChevronDown className="w-4 h-4 text-mid-gray" />
          </div>
          <div className="p-4 text-xs text-mid-gray italic">Section content goes here...</div>
        </div>
      );
    case 'PageBreak':
      return (
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-dashed border-light-gray" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs font-medium text-mid-gray uppercase tracking-wider">Page Break</span>
          </div>
        </div>
      );
    case 'Submit':
      return (
        <Button 
          className="bg-vision-green hover:bg-green-dark text-white w-full h-12 rounded-xl font-bold tracking-wider shadow-lg shadow-green-900/10 transition-all active:scale-[0.98] mt-4"
          onClick={() => !readOnly && onValueChange?.('SUBMIT_TRIGGERED')}
        >
          {label}
        </Button>
      );
    case 'Divider':
      return <hr className="w-full border-light-gray" />;
    default:
      return (
        <div className="w-full h-12 bg-off-white border border-dashed border-light-gray rounded-md flex items-center justify-center text-mid-gray text-sm italic">
          Preview for {label} ({type})
        </div>
      );
  }
}

// --- Canvas Sortable Field Item ---
export function SortableFormItem({
  instance,
  onRemove,
  onUpdateInstance
}: {
  instance: FormInstance;
  onRemove: (id: string) => void;
  onUpdateInstance?: (id: string, updates: Partial<FormInstance>) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const elementDef = formElements.find((el) => el.id === instance.elementId);
  const currentLabel = instance.customLabel !== undefined ? instance.customLabel : (elementDef?.label || '');
  
  const [editValue, setEditValue] = useState(currentLabel);
  const [editProperties, setEditProperties] = useState<Record<string, string>>(instance.properties || {});
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: instance.id,
    data: {
      type: 'CanvasItem',
      instance,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!elementDef) return null;

  const handleSave = () => {
    setIsEditing(false);
    if (onUpdateInstance) {
      onUpdateInstance(instance.id, {
        customLabel: editValue,
        properties: editProperties
      });
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onDoubleClick={() => {
        if (!isEditing) {
          setEditValue(currentLabel);
          setEditProperties(instance.properties || {});
          setIsEditing(true);
        }
      }}
      className={`
        relative group flex items-start gap-4 p-5 mb-5 bg-white rounded-2xl
        border border-light-gray/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300
        ${isDragging ? 'opacity-50 z-50 shadow-2xl border-vision-green ring-4 ring-vision-green/5' : 'hover:border-vision-green/40 hover:shadow-md hover:bg-green-50/5'}
      `}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="mt-2 text-mid-gray hover:text-charcoal cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="w-5 h-5" />
      </div>

      {/* Field Content Preview */}
      <div className="flex-1 w-full pointer-events-none group-hover:pointer-events-auto">
        {isEditing ? (
          <div className="flex flex-col gap-3 mb-4 pointer-events-auto bg-gray-50/50 p-4 rounded-lg border border-light-gray/50 relative">
            <Button size="icon" className="absolute top-3 right-3 h-8 w-8 bg-vision-green hover:bg-green-dark shadow-sm z-10" onClick={handleSave}>
              <Check className="w-4 h-4 text-white" />
            </Button>
            
            {/* Primary Question / Label - Always visible for editing */}
            <div className="flex items-center gap-2 pr-10">
              <span className="text-xs font-semibold text-mid-gray w-24 shrink-0 uppercase tracking-wider">Label</span>
              <Input 
                value={editValue} 
                onChange={(e) => setEditValue(e.target.value)} 
                onKeyDown={handleKeyDown}
                className="w-full h-9 text-sm bg-white border-light-gray focus-visible:ring-vision-green"
                autoFocus
                placeholder="Enter question or label..."
              />
            </div>

            <div className="border-t border-light-gray/40 my-1" />

            {/* Sub-fields based on element type */}
            {elementDef?.type === 'FullName' && (
              <div className="flex flex-col gap-3 pr-10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-mid-gray w-32 shrink-0">First Name Hint</span>
                  <Input 
                    value={editProperties.firstNamePlaceholder ?? ''} 
                    placeholder="First"
                    onChange={(e) => setEditProperties({...editProperties, firstNamePlaceholder: e.target.value})} 
                    onKeyDown={handleKeyDown}
                    className="max-w-[300px] h-9 text-sm bg-white"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-mid-gray w-32 shrink-0">Last Name Hint</span>
                  <Input 
                    value={editProperties.lastNamePlaceholder ?? ''} 
                    placeholder="Last"
                    onChange={(e) => setEditProperties({...editProperties, lastNamePlaceholder: e.target.value})} 
                    onKeyDown={handleKeyDown}
                    className="max-w-[300px] h-9 text-sm bg-white"
                  />
                </div>
              </div>
            )}
            
            {['Dropdown', 'SingleChoice', 'MultipleChoice'].includes(elementDef?.type || '') && (
              <div className="flex flex-col gap-2 pr-10">
                <div className="flex items-start gap-2">
                  <span className="text-xs font-semibold text-mid-gray w-24 shrink-0 mt-2">Choices</span>
                  <textarea 
                    value={editProperties.options ?? ''} 
                    placeholder="Choice 1, Choice 2, Choice 3 (comma separated)"
                    onChange={(e) => setEditProperties({...editProperties, options: e.target.value})} 
                    className="w-full min-h-[80px] border border-light-gray rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-vision-green/20 bg-white resize-none shadow-inner"
                  />
                </div>
                {elementDef?.type === 'Dropdown' && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-mid-gray w-24 shrink-0">Hint Text</span>
                    <Input 
                      value={editProperties.placeholder ?? ''} 
                      placeholder="Select option..."
                      onChange={(e) => setEditProperties({...editProperties, placeholder: e.target.value})} 
                      className="w-full h-9 text-sm bg-white"
                    />
                  </div>
                )}
              </div>
            )}
            
            {['Email', 'ShortText', 'Address', 'Phone', 'LongText', 'Paragraph', 'Number', 'DatePicker', 'Time'].includes(elementDef?.type || '') && (
              <div className="flex items-center gap-2 pr-10">
                <span className="text-xs font-semibold text-mid-gray w-24 shrink-0">Placeholder</span>
                <Input 
                  value={editProperties.placeholder ?? ''} 
                  placeholder="Enter placeholder hint..."
                  onChange={(e) => setEditProperties({...editProperties, placeholder: e.target.value})} 
                  onKeyDown={handleKeyDown}
                  className="w-full h-9 text-sm bg-white"
                />
              </div>
            )}
          </div>
        ) : null}
        {!isEditing && (
          <div className="pointer-events-none">
             <RenderFieldUI type={elementDef.type} label={currentLabel} properties={instance.properties} readOnly={true} />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-mid-gray hover:text-vision-green hover:bg-green-50 rounded-full"
          onClick={() => {
            setEditValue(currentLabel);
            setEditProperties(instance.properties || {});
            setIsEditing(true);
          }}
        >
          <Edit2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-mid-gray hover:text-red-500 hover:bg-red-50 rounded-full"
          onClick={() => onRemove(instance.id)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

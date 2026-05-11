'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Smartphone, Tablet, Monitor, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { ElementsSidebar } from '@/components/form-builder/elements-sidebar';
import { FormInstance, formElements } from '@/lib/form-elements';
import { RenderFieldUI } from '@/components/form-builder/builder-elements';
import { FormSettingsView } from '@/components/form-builder/form-settings-view';
import { FormPublishView } from '@/components/form-builder/form-publish-view';

/* ── Signature Pad ── */
function SignaturePad({ onClear }: { onClear?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing   = useRef(false);
  const [isEmpty, setIsEmpty] = useState(true);

  const getPos = (e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const src  = 'touches' in e ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.strokeStyle = '#1A2332';
    ctx.lineWidth   = 1.8;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';

    const start = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      drawing.current = true;
      const { x, y } = getPos(e, canvas);
      ctx.beginPath();
      ctx.moveTo(x, y);
    };
    const move = (e: MouseEvent | TouchEvent) => {
      if (!drawing.current) return;
      e.preventDefault();
      setIsEmpty(false);
      const { x, y } = getPos(e, canvas);
      ctx.lineTo(x, y);
      ctx.stroke();
    };
    const stop = () => { drawing.current = false; };

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    canvas.addEventListener('mouseup', stop);
    canvas.addEventListener('mouseleave', stop);
    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove',  move,  { passive: false });
    canvas.addEventListener('touchend',   stop);
    return () => {
      canvas.removeEventListener('mousedown', start);
      canvas.removeEventListener('mousemove', move);
      canvas.removeEventListener('mouseup', stop);
      canvas.removeEventListener('mouseleave', stop);
      canvas.removeEventListener('touchstart', start);
      canvas.removeEventListener('touchmove', move);
      canvas.removeEventListener('touchend', stop);
    };
  }, []);

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
    onClear?.();
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="relative border border-light-gray rounded-xl overflow-hidden bg-white group cursor-crosshair">
        <canvas ref={canvasRef} width={540} height={120} className="w-full h-[120px] block" />
        {isEmpty && (
          <p className="absolute inset-0 flex items-end justify-center pb-3 text-xs text-mid-gray/40 pointer-events-none select-none">
            Sign here
          </p>
        )}
        <div className="absolute bottom-0 left-4 right-4 h-px bg-light-gray/60" />
      </div>
      <button
        onClick={clear}
        className="self-end text-xs text-mid-gray hover:text-red-500 transition-colors font-medium"
      >
        Clear
      </button>
    </div>
  );
}

/* ── Main page ── */
export default function CollectSignaturesPage() {
  const router = useRouter();
  const [activeTab,    setActiveTab]    = useState<'BUILD' | 'SETTINGS' | 'PUBLISH'>('BUILD');
  const [isPreview,    setIsPreview]    = useState(false);
  const [device,       setDevice]       = useState<'phone' | 'tablet' | 'desktop'>('desktop');
  const [extraFields,  setExtraFields]  = useState<FormInstance[]>([]);

  const savedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const addField = (element: { id: string }) => {
    setExtraFields(prev => [...prev, {
      id: `inst-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      elementId: element.id,
    }]);
  };

  const removeField = (id: string) =>
    setExtraFields(prev => prev.filter(f => f.id !== id));

  return (
    <div className="-mt-6 -mx-6 flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-off-white">

      {/* ── Header ── */}
      {!isPreview ? (
        <div className="bg-white shrink-0 z-30 shadow-sm border-b border-light-gray/50">
          {/* Title row */}
          <div className="flex items-center justify-center py-3 relative">
            <div className="text-center">
              <h1 className="text-xl font-bold text-charcoal">Sign Form</h1>
              <p className="text-[11px] text-vision-green font-semibold flex items-center justify-center gap-1 mt-0.5">
                All changes saved at {savedTime}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </p>
            </div>
          </div>

          {/* Tab bar */}
          <div className="bg-vision-green flex items-end justify-center px-6 relative h-[48px]">
            <div className="flex h-full items-end">
              {(['BUILD', 'SETTINGS', 'PUBLISH'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-2.5 text-xs font-bold tracking-wider rounded-t-md h-[40px] flex items-center justify-center transition-colors ${
                    activeTab === tab
                      ? 'text-vision-green bg-off-white'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
              <span className="text-xs font-bold tracking-wider text-white">Preview Form</span>
              <button
                onClick={() => setIsPreview(true)}
                className="w-10 h-5 bg-white/30 hover:bg-white/40 rounded-full relative transition-colors flex items-center px-0.5 border border-white/20"
              >
                <span className="bg-white w-4 h-4 rounded-full shadow-sm absolute left-0.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Preview header */
        <div className="bg-charcoal shrink-0 z-30 shadow-sm flex items-center justify-between px-6 h-14">
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white/10 rounded-md overflow-hidden h-8 w-72 border border-white/10">
              <input readOnly value="https://form.visionsolar.com/sign" className="flex-1 px-3 text-xs text-white bg-transparent outline-none truncate" />
              <button className="h-full px-2.5 text-white/50 hover:text-white flex items-center border-l border-white/10">
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
            <button className="h-8 px-4 bg-vision-green hover:bg-green-dark text-white text-xs font-bold tracking-wider rounded-md transition-colors">
              Fill Form
            </button>
          </div>
          <div className="flex items-center h-full">
            <div className="flex items-center h-full mr-6">
              {([
                { key: 'phone',   Icon: Smartphone },
                { key: 'tablet',  Icon: Tablet },
                { key: 'desktop', Icon: Monitor },
              ] as const).map(({ key, Icon }) => (
                <button
                  key={key}
                  onClick={() => setDevice(key)}
                  className={`flex flex-col items-center justify-center h-full px-4 border-b-4 transition-colors ${
                    device === key ? 'border-white text-white' : 'border-transparent text-white/70 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 mb-1" />
                  <span className="text-[10px] font-bold tracking-wider uppercase">{key}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold tracking-wider text-white">Preview Form</span>
              <button
                onClick={() => setIsPreview(false)}
                className="w-10 h-5 bg-vision-green rounded-full relative flex items-center px-0.5 border border-vision-green/50"
              >
                <span className="bg-white w-4 h-4 rounded-full shadow-sm absolute right-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Content ── */}
      <div className="flex flex-1 overflow-hidden">
        {isPreview ? (
          /* Preview canvas */
          <div className="flex-1 overflow-y-auto bg-[#f3f3f5] flex justify-center py-12 px-4">
            <div className={`bg-white shadow-md transition-all duration-500 ${
              device === 'phone'   ? 'w-[375px] rounded-3xl border-[8px] border-charcoal/10 min-h-[600px]' :
              device === 'tablet'  ? 'w-[768px] rounded-2xl border-[12px] border-charcoal/10 min-h-[700px]' :
                                     'w-[700px] rounded-xl border border-light-gray min-h-[600px]'
            }`}>
              <div className="px-10 pt-10 pb-6 border-b border-light-gray/40">
                <h1 className="text-2xl font-bold text-charcoal">Sign Form</h1>
              </div>
              <div className="p-10 flex flex-col gap-6">
                <div>
                  <p className="text-sm font-semibold text-charcoal mb-3">Signature</p>
                  <SignaturePad />
                </div>
                {extraFields.map(inst => {
                  const def = formElements.find(el => el.id === inst.elementId);
                  if (!def) return null;
                  return (
                    <div key={inst.id}>
                      <RenderFieldUI type={def.type} label={def.label || ''} />
                    </div>
                  );
                })}
                <div className="pt-4 border-t border-light-gray/40">
                  <button className="w-full h-11 rounded-xl bg-vision-green hover:bg-green-dark text-white font-bold text-sm tracking-wide transition-all shadow-sm">
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'BUILD' ? (
          <>
            {/* Left sidebar — same elements as form builder */}
            <ElementsSidebar onAddElement={addField} />

            {/* Canvas */}
            <div className="flex-1 overflow-y-auto bg-[#f3f3f5] flex flex-col items-center py-10 px-4 gap-4">

              {/* Form card */}
              <div className="w-full max-w-[680px] bg-white rounded-2xl shadow-[0_2px_14px_rgba(0,0,0,0.06)] overflow-hidden">

                {/* Card header */}
                <div className="px-10 pt-10 pb-6 border-b border-light-gray/40">
                  <h1 className="text-2xl font-bold text-charcoal">Sign Form</h1>
                </div>

                {/* Signature field */}
                <div className="px-10 py-8 border-b border-light-gray/30">
                  <p className="text-sm font-semibold text-charcoal mb-3">Signature</p>
                  <SignaturePad />
                </div>

                {/* Extra dropped fields */}
                {extraFields.map(inst => {
                  const def = formElements.find(el => el.id === inst.elementId);
                  if (!def) return null;
                  return (
                    <div
                      key={inst.id}
                      className="group px-10 py-6 border-b border-light-gray/30 flex items-start gap-3 hover:bg-off-white/50 transition-colors"
                    >
                      <div className="flex-1">
                        <RenderFieldUI type={def.type} label={def.label || ''} />
                      </div>
                      <button
                        onClick={() => removeField(inst.id)}
                        className="opacity-0 group-hover:opacity-100 mt-1 w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center transition-all shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}

                {/* Continue button */}
                <div className="px-10 py-8">
                  <button className="w-full h-11 rounded-xl bg-vision-green hover:bg-green-dark text-white font-bold text-sm tracking-wide transition-all shadow-sm">
                    Continue
                  </button>
                </div>
              </div>

              {/* Add new page */}
              <button className="flex items-center gap-2 text-sm font-semibold text-mid-gray hover:text-vision-green transition-colors group">
                <div className="w-6 h-6 rounded-full border-2 border-mid-gray/30 group-hover:border-vision-green flex items-center justify-center transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                Add New Page
              </button>
            </div>
          </>
        ) : activeTab === 'SETTINGS' ? (
          <FormSettingsView />
        ) : (
          <FormPublishView />
        )}
      </div>
    </div>
  );
}

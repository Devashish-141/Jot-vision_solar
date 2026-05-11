'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { FormInstance, formElements } from '@/lib/form-elements';
import { RenderFieldUI } from '@/components/form-builder/builder-elements';
import { Button } from '@/components/ui/button';
import { formService } from '@/lib/supabase/form-service';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function FormPreviewPage() {
  const router = useRouter();
  const [instances, setInstances] = useState<FormInstance[]>([]);
  const [formId, setFormId] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load from localStorage for the preview/local experience
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vs_form_instances');
      const savedId = localStorage.getItem('vs_current_form_id');
      
      if (saved) {
        setInstances(JSON.parse(saved));
      }
      if (savedId) {
        setFormId(savedId);
        formService.recordFormView(savedId);
      }
    }
  }, []);

  const handleValueChange = (id: string, value: any) => {
    setResponses(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (instances.length === 0) return;

    setIsSubmitting(true);
    const loadingToast = toast.loading("Submitting your response...");

    try {
      // Use the real formId if we have it, otherwise fallback to a dummy only for testing
      const targetFormId = formId || "00000000-0000-0000-0000-000000000000";
      await formService.submitResponse(targetFormId, responses, instances);
      
      toast.dismiss(loadingToast);
      setIsSubmitted(true);
      toast.success("Submitted successfully!");
      
      // Redirect home after 3 seconds
      setTimeout(() => router.push('/form'), 3000);
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error("Submission failed", { description: error.message });
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-vision-green/10 rounded-full flex items-center justify-center mx-auto mb-6 text-vision-green">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-charcoal mb-4 tracking-tight">Thank You!</h1>
          <p className="text-mid-gray text-lg mb-8 leading-relaxed">
            Your response has been securely recorded. You will be redirected shortly.
          </p>
          <Button onClick={() => router.push('/form')} className="w-full h-12 bg-vision-green hover:bg-green-dark text-white font-bold rounded-xl shadow-lg transition-all active:scale-95">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white py-12 px-4 flex justify-center">
      <div className="w-full max-w-[800px] bg-white rounded-2xl shadow-xl border border-light-gray/50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Form Header */}
        <div className="p-8 border-b border-light-gray/40 flex flex-col items-center gap-6">
          <Image 
            src="/images/logo.svg" 
            alt="VisionSolar Logo" 
            width={180} 
            height={40} 
            className="w-auto h-10 object-contain"
          />
          <div className="text-center">
            <h1 className="text-2xl font-black text-charcoal tracking-tight">Vision Solar Assessment</h1>
            <p className="text-mid-gray mt-1 font-medium">Please fill out the information below</p>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="p-10 space-y-8 flex-1">
          {instances.length === 0 ? (
            <div className="py-20 text-center text-mid-gray">
              <p className="text-lg font-medium">This form has no fields yet.</p>
              <p className="text-sm mt-1">Go back to the builder to add some elements.</p>
            </div>
          ) : (
            <>
              <div className="space-y-10">
                {instances.map((instance) => {
                  const elementDef = formElements.find(el => el.id === instance.elementId);
                  if (!elementDef) return null;
                  
                  return (
                    <div key={instance.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <RenderFieldUI 
                        type={elementDef.type}
                        label={instance.customLabel || elementDef.label}
                        properties={instance.properties}
                        value={responses[instance.id]} 
                        onValueChange={(val) => handleValueChange(instance.id, val)} 
                      />
                    </div>
                  );
                })}
              </div>

              {/* Submit Button */}
              <div className="pt-12 border-t border-light-gray/40">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-7 text-lg font-black tracking-widest bg-vision-green hover:bg-green-dark text-white rounded-xl shadow-xl shadow-vision-green/20 transition-all hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? "SUBMITTING..." : "SUBMIT RESPONSE"}
                </Button>
                <p className="text-center text-[11px] text-mid-gray/60 mt-6 font-bold uppercase tracking-widest">
                  Secure Submission Powered by VisionSolar
                </p>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FormInstance } from '@/lib/form-elements';
import { SortableFormItem } from './builder-elements';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function FormCanvas({
  instances,
  onRemove,
  onUpdateInstance,
  onFinish,
}: {
  instances: FormInstance[];
  onRemove: (id: string) => void;
  onUpdateInstance?: (id: string, updates: Partial<FormInstance>) => void;
  onFinish?: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'form-canvas',
  });

  return (
    <div className="flex-1 w-full min-h-[calc(100vh-64px)] bg-off-white/50 p-8 flex justify-center animate-in fade-in duration-700">
      <div 
        ref={setNodeRef}
        className={`
          w-full max-w-[800px] min-h-[600px] bg-white rounded-xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border
          ${isOver ? 'border-vision-green bg-green-50/30' : 'border-light-gray/50'}
          p-10 transition-all
        `}
      >
        <div className="flex flex-col items-center border-b border-light-gray/40 pb-6 mb-8 gap-4">
          <Image 
            src="/images/logo.svg" 
            alt="VisionSolar Logo" 
            width={200} 
            height={48} 
            className="w-auto h-12 object-contain"
            priority
          />
        </div>

        <SortableContext items={instances.map(i => i.id)} strategy={verticalListSortingStrategy}>
          <div className="min-h-[400px] flex flex-col pt-2">
            {instances.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-light-gray/60 rounded-xl bg-off-white/30 text-mid-gray transition-colors">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-light-gray/30 mb-4">
                  <svg className="w-6 h-6 text-vision-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-dark-gray mb-1">Drag and drop elements here</h3>
                <p className="text-sm max-w-xs mx-auto">Select a tool from the left menu to start assembling your form fields.</p>
              </div>
            )}
            
            {instances.map((instance) => (
              <SortableFormItem
                key={instance.id}
                instance={instance}
                onRemove={onRemove}
                onUpdateInstance={onUpdateInstance}
              />
            ))}
          </div>
        </SortableContext>
        
        {instances.length > 0 && (
          <div className="mt-8 pt-8 border-t border-light-gray/40">
            <Button 
              onClick={onFinish}
              className="w-full text-base font-semibold py-6 bg-vision-green hover:bg-green-dark text-white rounded-lg shadow-md transition-all hover:-translate-y-0.5 active:scale-[0.99]"
            >
              Finish &amp; Submit Form
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

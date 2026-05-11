'use client';

import React from 'react';
import { formElements, ElementCategory, FormElementDef } from '@/lib/form-elements';
import { DraggableSidebarElement } from './builder-elements';

export function ElementsSidebar({ onAddElement }: { onAddElement?: (element: FormElementDef) => void }) {
  const categories: ElementCategory[] = ['BASIC ELEMENTS', 'SURVEY ELEMENTS', 'PAGE ELEMENTS'];

  return (
    <aside className="w-[320px] h-full bg-white border-r border-light-gray overflow-y-auto flex-shrink-0 animate-in slide-in-from-left-4 duration-500 shadow-[2px_0_12px_rgba(0,0,0,0.03)] z-20 flex flex-col hidden md:flex">
      <div className="p-5 bg-white border-b border-light-gray sticky top-0 z-10 flex items-center justify-center">
        <h2 className="font-bold text-sm tracking-widest text-dark-gray uppercase">Add Element</h2>
      </div>

      <div className="flex flex-col flex-1 py-2">
        {categories.map((category) => {
          const items = formElements.filter(el => el.category === category);
          if (items.length === 0) return null; // Avoid rendering empty categories
          
          return (
            <div key={category} className="mb-4">
              <div className="px-5 py-2 text-xs font-bold uppercase tracking-widest text-mid-gray/70">
                {category}
              </div>
              <div className="grid grid-cols-1 gap-1 px-3">
                {items.map((el) => (
                  <div key={el.id} className="rounded-lg transition-transform hover:scale-[1.02]">
                    <DraggableSidebarElement element={el} onDoubleClick={() => onAddElement?.(el)} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

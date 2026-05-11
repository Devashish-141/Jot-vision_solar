'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, Printer, FileText, Receipt, MoreHorizontal } from 'lucide-react';
import { DetailsTab } from './details-tab';
import { BillingTab } from './billing-tab';
import { SavedTab } from './saved-tab';

const TABS = [
  { id: 'details', label: 'Details' },
  { id: 'billing', label: 'Billing' },
  { id: 'saved', label: 'Saved' },
] as const;

type TabId = (typeof TABS)[number]['id'];

interface JobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId?: string;
  onSuccess?: () => void;
}

export function JobModal({ open, onOpenChange, jobId, onSuccess }: JobModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>('details');
  const isEditing = !!jobId;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[600px] sm:max-w-[600px] p-0 flex flex-col gap-0 bg-white [&>button]:top-3 [&>button]:right-3"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b border-light-gray shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold text-charcoal">
              {isEditing ? `Edit Job` : 'New Job'}
            </SheetTitle>
            <div className="flex items-center gap-2 mr-6">
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 gap-1.5 px-3 text-xs rounded-md border border-light-gray bg-white hover:bg-off-white transition-colors font-medium">
                    <MoreHorizontal className="w-3.5 h-3.5" />
                    More
                    <ChevronDown className="w-3 h-3" />
              </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <Printer className="w-4 h-4" /> Print Quote
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <FileText className="w-4 h-4" /> Print Work Order
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <Receipt className="w-4 h-4" /> Print Invoice
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </SheetHeader>

        {/* Tab Bar */}
        <div className="flex border-b border-light-gray shrink-0">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-medium transition-all relative ${
                activeTab === tab.id
                  ? 'text-vision-green'
                  : 'text-mid-gray hover:text-dark-gray'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-vision-green rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'details' && (
            <DetailsTab jobId={jobId} onSuccess={() => {
              onSuccess?.();
              onOpenChange(false);
            }} />
          )}
          {activeTab === 'billing' && <BillingTab />}
          {activeTab === 'saved' && <SavedTab />}
        </div>
      </SheetContent>
    </Sheet>
  );
}

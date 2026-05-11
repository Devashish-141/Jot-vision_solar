'use client';

import { useState, useEffect } from 'react';
import { Plus, GripVertical, Trash2, Search, MapPin, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { JOB_STATUSES, JOB_CATEGORIES } from '@/lib/constants';
import { jobService } from '@/lib/supabase/service';
import { toast } from 'sonner';
import type { Client } from '@/lib/types';

interface ChecklistItemType {
  id: string;
  text: string;
  completed: boolean;
}

interface DetailsTabProps {
  jobId?: string;
  onSuccess?: () => void;
}

export function DetailsTab({ jobId, onSuccess }: DetailsTabProps) {
  const [loading, setLoading] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [status, setStatus] = useState('Quote');
  const [category, setCategory] = useState('Installation');
  const [poNumber, setPoNumber] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMobile, setContactMobile] = useState('');
  const [checklist, setChecklist] = useState<ChecklistItemType[]>([
    { id: '1', text: 'Confirm site access requirements', completed: false },
    { id: '2', text: 'Verify roof condition and measurements', completed: false },
  ]);
  const [billingSameAsJob, setBillingSameAsJob] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    async function loadClients() {
      try {
        const data = await jobService.fetchClients();
        setClients(data);
      } catch (error) {
        console.error('Failed to load clients:', error);
      }
    }
    loadClients();
  }, []);

  const filteredClients = clients.filter(c => {
    if (!clientSearch) return true;
    const q = clientSearch.toLowerCase();
    return (
      c.first_name.toLowerCase().includes(q) ||
      c.last_name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  const addChecklistItem = () => {
    setChecklist([
      ...checklist,
      { id: Date.now().toString(), text: '', completed: false },
    ]);
  };

  const removeChecklistItem = (id: string) => {
    setChecklist(checklist.filter(item => item.id !== id));
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist(checklist.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const updateChecklistText = (id: string, text: string) => {
    setChecklist(checklist.map(item =>
      item.id === id ? { ...item, text } : item
    ));
  };

  const selectedClientData = selectedClient
    ? clients.find(c => c.id === selectedClient)
    : null;

  return (
    <div className="p-6 space-y-6">
      {/* Client Search */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-charcoal flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-mid-gray" />
          Client
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-mid-gray" />
          <Input
            id="client-search"
            placeholder="Search existing client or add new..."
            value={clientSearch}
            onChange={(e) => {
              setClientSearch(e.target.value);
              setShowClientDropdown(true);
            }}
            onFocus={() => setShowClientDropdown(true)}
            className="pl-9 h-10 bg-off-white border-light-gray"
          />
          {showClientDropdown && clientSearch && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-light-gray rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
              {filteredClients.map(c => (
                <button
                  key={c.id}
                  className="w-full text-left px-3 py-2 hover:bg-off-white transition-colors flex items-center gap-3"
                  onClick={() => {
                    setSelectedClient(c.id);
                    setClientSearch(`${c.first_name} ${c.last_name}`);
                    setShowClientDropdown(false);
                  }}
                >
                  <div className="w-7 h-7 rounded-full bg-vision-green/10 flex items-center justify-center text-xs font-semibold text-green-dark">
                    {c.first_name[0]}{c.last_name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-charcoal">{c.first_name} {c.last_name}</p>
                    <p className="text-xs text-mid-gray">{c.email}</p>
                  </div>
                </button>
              ))}
              <button
                className="w-full text-left px-3 py-2 hover:bg-off-white transition-colors flex items-center gap-2 text-vision-green border-t border-light-gray"
                onClick={() => setShowClientDropdown(false)}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Create new client</span>
              </button>
            </div>
          )}
        </div>
        {selectedClientData && (
          <div className="bg-off-white rounded-lg p-3 text-xs text-dark-gray space-y-0.5">
            <p><span className="text-mid-gray">Phone:</span> {selectedClientData.phone}</p>
            <p><span className="text-mid-gray">Mobile:</span> {selectedClientData.mobile}</p>
            <p><span className="text-mid-gray">Email:</span> {selectedClientData.email}</p>
          </div>
        )}
      </div>

      {/* Job Address */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-charcoal flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-mid-gray" />
          Job Address
        </label>
        <Input
          id="job-address"
          placeholder="Start typing an address..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="h-10 bg-off-white border-light-gray"
        />
      </div>

      {/* Status + Category */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-charcoal">Job Status</label>
          <Select value={status} onValueChange={(v) => v && setStatus(v)}>
            <SelectTrigger className="h-10 bg-off-white border-light-gray">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(JOB_STATUSES).map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-charcoal">Category</label>
          <Select value={category} onValueChange={(v) => v && setCategory(v)}>
            <SelectTrigger className="h-10 bg-off-white border-light-gray">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(JOB_CATEGORIES).map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* PO Number */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-charcoal">PO Number</label>
        <Input
          id="po-number"
          placeholder="Enter PO number"
          value={poNumber}
          onChange={(e) => setPoNumber(e.target.value)}
          className="h-10 bg-off-white border-light-gray"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-charcoal">Job Description</label>
        <Textarea
          id="job-description"
          placeholder="Describe the work that needs to be done"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-24 bg-off-white border-light-gray resize-none"
        />
      </div>

      <Separator className="bg-light-gray" />

      {/* Checklist */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-charcoal">Checklist</label>
        <div className="space-y-2">
          {checklist.map(item => (
            <div key={item.id} className="flex items-center gap-2 group">
              <GripVertical className="w-4 h-4 text-light-gray cursor-grab shrink-0" />
              <Checkbox
                checked={item.completed}
                onCheckedChange={() => toggleChecklistItem(item.id)}
                className="border-light-gray data-[state=checked]:bg-vision-green data-[state=checked]:border-vision-green"
              />
              <Input
                value={item.text}
                onChange={(e) => updateChecklistText(item.id, e.target.value)}
                placeholder="Checklist item..."
                className={`h-8 flex-1 text-sm bg-transparent border-transparent hover:border-light-gray focus:border-light-gray ${
                  item.completed ? 'line-through text-mid-gray' : ''
                }`}
              />
              <button
                onClick={() => removeChecklistItem(item.id)}
                className="opacity-0 group-hover:opacity-100 text-mid-gray hover:text-destructive transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={addChecklistItem}
          className="text-vision-green hover:text-green-dark hover:bg-accent gap-1.5 h-8"
        >
          <Plus className="w-3.5 h-3.5" />
          New Item
        </Button>
      </div>

      <Separator className="bg-light-gray" />

      {/* Contacts */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-charcoal">Job Contact</label>
        <div className="grid grid-cols-2 gap-3">
          <Input 
            placeholder="Name" 
            className="h-9 text-sm bg-off-white border-light-gray" 
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
          />
          <Input 
            placeholder="Email" 
            className="h-9 text-sm bg-off-white border-light-gray" 
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
          <Input 
            placeholder="Phone" 
            className="h-9 text-sm bg-off-white border-light-gray" 
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
          <Input 
            placeholder="Mobile" 
            className="h-9 text-sm bg-off-white border-light-gray" 
            value={contactMobile}
            onChange={(e) => setContactMobile(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="billing-same"
            checked={billingSameAsJob}
            onCheckedChange={(c) => setBillingSameAsJob(c === true)}
            className="border-light-gray data-[state=checked]:bg-vision-green data-[state=checked]:border-vision-green"
          />
          <label htmlFor="billing-same" className="text-sm text-dark-gray cursor-pointer select-none">
            Billing contact same as job contact
          </label>
        </div>
      </div>

      {/* Save button */}
      <div className="pt-2 pb-4">
        <Button 
          onClick={async () => {
            try {
              setLoading(true);
              let clientId = selectedClient;

              // If no client selected but name/email provided, create a new one
              if (!clientId && contactName) {
                const names = contactName.split(' ');
                const newClient = await jobService.createClient({
                  first_name: names[0] || 'Unknown',
                  last_name: names.slice(1).join(' ') || 'Client',
                  email: contactEmail || `${contactName.toLowerCase().replace(' ', '.')}@example.com`,
                  phone: contactPhone,
                  mobile: contactMobile,
                  address: address
                });
                clientId = newClient.id;
              }

              if (!clientId) {
                toast.error('Please select or create a client');
                return;
              }

              const jobData = {
                client_id: clientId,
                address,
                status: status as any,
                category: category as any,
                description,
                po_number: poNumber,
                contact_name: contactName,
                contact_email: contactEmail,
                contact_phone: contactPhone,
                billing_same_as_job: billingSameAsJob
              };

              let savedJob;
              if (jobId) {
                savedJob = await jobService.updateJob(jobId, jobData);
              } else {
                savedJob = await jobService.createJob(jobData);
              }

              // Save checklist
              await jobService.saveChecklist(savedJob.id, checklist.map(item => ({
                text: item.text,
                completed: item.completed
              })));

              toast.success(jobId ? 'Job updated' : 'Job created');
              onSuccess?.();
            } catch (error) {
              console.error('Failed to save job:', error);
              toast.error('Failed to save job');
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          className="w-full bg-vision-green hover:bg-green-light text-white h-10 font-semibold shadow-md shadow-vision-green/20"
        >
          {loading ? 'Saving...' : 'Save Job'}
        </Button>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Plus, Trash2, Send, MessageSquare, Check, X, Sparkles, Palette } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { mockJobItems } from '@/lib/mock-data';

interface LineItem {
  id: string;
  itemCode: string;
  description: string;
  qty: number;
  unitPrice: number;
  taxPercent: number;
}

export function BillingTab() {
  const [billingSameAsJob, setBillingSameAsJob] = useState(true);
  const [quoteDescription, setQuoteDescription] = useState('');
  const [items, setItems] = useState<LineItem[]>(
    mockJobItems.map(i => ({
      id: i.id,
      itemCode: i.item_code,
      description: i.description,
      qty: i.quantity,
      unitPrice: i.unit_price,
      taxPercent: i.tax_percent,
    }))
  );

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), itemCode: '', description: '', qty: 1, unitPrice: 0, taxPercent: 10 },
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const subtotal = items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0);
  const tax = items.reduce((sum, i) => sum + (i.qty * i.unitPrice * i.taxPercent) / 100, 0);
  const total = subtotal + tax;

  return (
    <div className="p-6 space-y-6">
      {/* Billing Address */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-charcoal">Billing Address</label>
        <div className="flex items-center gap-2 mb-2">
          <Checkbox
            id="billing-same-address"
            checked={billingSameAsJob}
            onCheckedChange={(c) => setBillingSameAsJob(c === true)}
            className="border-light-gray data-[state=checked]:bg-vision-green data-[state=checked]:border-vision-green"
          />
          <label htmlFor="billing-same-address" className="text-sm text-dark-gray cursor-pointer select-none">
            Same as job address
          </label>
        </div>
        {!billingSameAsJob && (
          <Input
            placeholder="Enter billing address"
            className="h-10 bg-off-white border-light-gray"
          />
        )}
      </div>

      {/* Quote Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-charcoal">Quote Description</label>
        <Textarea
          placeholder="Brief summary for the invoice..."
          value={quoteDescription}
          onChange={(e) => setQuoteDescription(e.target.value)}
          className="min-h-20 bg-off-white border-light-gray resize-none text-sm"
        />
      </div>

      <Separator className="bg-light-gray" />

      {/* Line Items */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-charcoal">Items & Services</label>

        {/* Header row */}
        <div className="grid grid-cols-12 gap-2 text-[10px] uppercase tracking-wider text-mid-gray font-medium px-1">
          <div className="col-span-2">Code</div>
          <div className="col-span-4">Description</div>
          <div className="col-span-1 text-center">Qty</div>
          <div className="col-span-2 text-right">Price</div>
          <div className="col-span-1 text-center">Tax</div>
          <div className="col-span-2 text-right">Total</div>
        </div>

        {/* Items */}
        <div className="space-y-2">
          {items.map(item => {
            const lineTotal = item.qty * item.unitPrice * (1 + item.taxPercent / 100);
            return (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-center group">
                <div className="col-span-2">
                  <Input
                    value={item.itemCode}
                    onChange={(e) => updateItem(item.id, 'itemCode', e.target.value)}
                    className="h-8 text-xs bg-off-white border-light-gray"
                    placeholder="Code"
                  />
                </div>
                <div className="col-span-4">
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    className="h-8 text-xs bg-off-white border-light-gray"
                    placeholder="Description"
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    type="number"
                    value={item.qty}
                    onChange={(e) => updateItem(item.id, 'qty', Number(e.target.value))}
                    className="h-8 text-xs bg-off-white border-light-gray text-center"
                    min={1}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                    className="h-8 text-xs bg-off-white border-light-gray text-right"
                    min={0}
                    step={0.01}
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    type="number"
                    value={item.taxPercent}
                    onChange={(e) => updateItem(item.id, 'taxPercent', Number(e.target.value))}
                    className="h-8 text-xs bg-off-white border-light-gray text-center"
                    min={0}
                  />
                </div>
                <div className="col-span-2 flex items-center gap-1">
                  <span className="flex-1 text-xs font-medium text-charcoal text-right">
                    ${lineTotal.toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-mid-gray hover:text-destructive transition-all p-0.5"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={addItem}
          className="text-vision-green hover:text-green-dark hover:bg-accent gap-1.5 h-8"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Item
        </Button>
      </div>

      <Separator className="bg-light-gray" />

      {/* Totals */}
      <div className="bg-off-white rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-dark-gray">Subtotal</span>
          <span className="font-medium text-charcoal">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-dark-gray">Tax (GST)</span>
          <span className="font-medium text-charcoal">${tax.toFixed(2)}</span>
        </div>
        <Separator className="bg-light-gray" />
        <div className="flex items-center justify-between text-base">
          <span className="font-semibold text-charcoal">Total</span>
          <span className="font-bold text-charcoal text-lg">${total.toFixed(2)}</span>
        </div>
      </div>

      <Separator className="bg-light-gray" />

      {/* Action Buttons (INRO Section) */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-charcoal">Actions</label>
        <div className="grid grid-cols-2 gap-2">
          <Button className="bg-solar-orange hover:bg-orange-light text-white gap-2 h-10 shadow-sm">
            <Send className="w-4 h-4" />
            Send Quote
          </Button>
          <Button variant="outline" className="gap-2 h-10 border-light-gray text-dark-gray hover:bg-off-white">
            <MessageSquare className="w-4 h-4" />
            SMS Quote
          </Button>
          <Button className="bg-vision-green hover:bg-green-light text-white gap-2 h-10 shadow-sm">
            <Check className="w-4 h-4" />
            Accept
          </Button>
          <Button variant="outline" className="gap-2 h-10 border-light-gray text-mid-gray hover:bg-off-white">
            <X className="w-4 h-4" />
            Unsuccessful
          </Button>
          <Button variant="outline" className="gap-2 h-10 border-light-gray text-dark-gray hover:bg-off-white">
            <Palette className="w-4 h-4" />
            Customise Quote
          </Button>
          <Button variant="outline" className="gap-2 h-10 border-light-gray text-dark-gray hover:bg-off-white" disabled>
            <Sparkles className="w-4 h-4" />
            Auto Quote
          </Button>
        </div>
      </div>
    </div>
  );
}

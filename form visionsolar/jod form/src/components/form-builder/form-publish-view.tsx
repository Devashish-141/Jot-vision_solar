'use client';

import React, { useState } from 'react';
import {
  Link as LinkIcon,
  ExternalLink,
  Copy,
  Check,
  Mail,
  QrCode,
  ArrowRight,
  Globe,
  Share2,
  Settings,
  Lock,
  LockOpen,
  Building2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FormPublishView() {
  const [copied, setCopied] = useState(false);
  const [emailInvite, setEmailInvite] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [accessType, setAccessType] = useState<'private' | 'public' | 'company'>('public');
  const [requireRegistration, setRequireRegistration] = useState(false);
  const [allowSubmissionAccess, setAllowSubmissionAccess] = useState(true);
  const [formUrl, setFormUrl] = useState('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setFormUrl(`${window.location.origin}/form/preview`);
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(formUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenLink = () => {
    window.open(formUrl, '_blank');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white flex flex-col items-center py-12 px-6 lg:px-12 animate-in fade-in duration-500">
      <div className="w-full max-w-[1000px] space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-light-gray pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-vision-green/10 text-vision-green font-bold text-xs uppercase tracking-widest mb-4">
              <span className="w-2 h-2 rounded-full bg-vision-green animate-pulse"></span>
              Live & Ready
            </div>
            <h1 className="text-4xl font-extrabold text-charcoal tracking-tight">Publish Form</h1>
            <p className="text-mid-gray mt-2 text-lg">Your form is accessible to the public. Share it with your audience.</p>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Main Column: The Link */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-off-white/50 rounded-3xl p-8 border border-light-gray/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-vision-green/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-vision-green/10 transition-colors duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-vision-green">
                      <Globe className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-charcoal">Direct Link</h2>
                  </div>
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="text-vision-green hover:text-green-dark text-sm font-semibold flex items-center gap-1.5 transition-colors group"
                  >
                    <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
                    Settings
                  </button>
                </div>
                
                <p className="text-mid-gray mb-8 leading-relaxed">
                  This is the unique URL for your form. Anyone with this link can view and submit responses securely.
                </p>

                <div className="space-y-4">
                  <div className="relative flex items-center">
                    <div className="absolute left-4 text-mid-gray pointer-events-none">
                      <LinkIcon className="w-5 h-5" />
                    </div>
                    <input 
                      readOnly
                      value={formUrl}
                      className="w-full h-16 pl-12 pr-4 bg-white border-2 border-transparent hover:border-light-gray focus:border-vision-green rounded-2xl text-charcoal font-medium text-lg shadow-sm outline-none transition-all cursor-text"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleCopy}
                    className={`w-full h-16 text-lg font-bold tracking-wide rounded-2xl transition-all duration-300 shadow-md ${
                      copied 
                        ? 'bg-charcoal text-white hover:bg-black' 
                        : 'bg-vision-green text-white hover:bg-green-dark hover:shadow-lg hover:shadow-vision-green/20 hover:-translate-y-0.5'
                    }`}
                  >
                    {copied ? (
                      <span className="flex items-center gap-2"><Check className="w-5 h-5" /> Copied to Clipboard</span>
                    ) : (
                      <span className="flex items-center gap-2"><Copy className="w-5 h-5" /> Copy Link</span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column: Email & Social */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Email */}
            <div className="bg-white rounded-3xl p-8 border border-light-gray shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-charcoal">Invite via Email</h3>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <input 
                    type="email"
                    placeholder="name@example.com"
                    value={emailInvite}
                    onChange={(e) => setEmailInvite(e.target.value)}
                    className="w-full h-12 pl-4 pr-12 bg-off-white border border-transparent focus:border-blue-500 rounded-xl text-charcoal outline-none transition-colors"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="bg-white rounded-3xl p-8 border border-light-gray shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-solar-orange/10 rounded-xl flex items-center justify-center text-solar-orange">
                  <Share2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-charcoal">Share Form</h3>
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                <button className="aspect-square rounded-xl bg-off-white hover:bg-gray-100 border border-transparent hover:border-gray-200 flex items-center justify-center transition-all group">
                  <QrCode className="w-5 h-5 text-dark-gray group-hover:scale-110 transition-transform" />
                </button>
                <button className="aspect-square rounded-xl bg-off-white hover:bg-[#25D366]/10 border border-transparent hover:border-[#25D366]/30 flex items-center justify-center transition-all group">
                  <svg className="w-5 h-5 text-dark-gray group-hover:text-[#25D366] group-hover:scale-110 transition-all" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                </button>
                <button className="aspect-square rounded-xl bg-off-white hover:bg-[#1877F2]/10 border border-transparent hover:border-[#1877F2]/30 flex items-center justify-center transition-all group">
                  <svg className="w-4 h-4 text-dark-gray group-hover:text-[#1877F2] group-hover:scale-110 transition-all" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="0" fill="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </button>
                <button className="aspect-square rounded-xl bg-off-white hover:bg-[#0A66C2]/10 border border-transparent hover:border-[#0A66C2]/30 flex items-center justify-center transition-all group">
                  <svg className="w-4 h-4 text-dark-gray group-hover:text-[#0A66C2] group-hover:scale-110 transition-all" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="0" fill="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </button>
                <button className="aspect-square rounded-xl bg-off-white hover:bg-black/5 border border-transparent hover:border-black/20 flex items-center justify-center transition-all group">
                  <svg className="w-4 h-4 text-dark-gray group-hover:text-black group-hover:scale-110 transition-all" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Access Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/40 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[580px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 mx-4">

            {/* Header */}
            <div className="bg-charcoal px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide">Form Settings</h3>
                  <p className="text-[11px] text-white/50 mt-0.5">Control who can access this form</p>
                </div>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 bg-off-white/40">

              {/* ACCESS SETTINGS label */}
              <p className="text-[10px] font-black tracking-[0.15em] uppercase text-mid-gray/70">Access Settings</p>

              {/* Access cards */}
              <div className="flex flex-col gap-2">
                {[
                  { key: 'private', Icon: Lock,     label: 'Private Access',  desc: 'Only available to invited people',              iconColor: 'text-charcoal',     iconBg: 'bg-charcoal/8' },
                  { key: 'public',  Icon: LockOpen,  label: 'Public Access',   desc: 'Available to anyone',                           iconColor: 'text-vision-green', iconBg: 'bg-vision-green/10' },
                  { key: 'company', Icon: Building2, label: 'Company Access',  desc: 'Only available to people in your organization', iconColor: 'text-solar-orange', iconBg: 'bg-solar-orange/10' },
                ].map(({ key, Icon, label, desc, iconColor, iconBg }) => {
                  const selected = accessType === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setAccessType(key as typeof accessType)}
                      className={`relative flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all group overflow-hidden ${
                        selected
                          ? 'bg-white border-vision-green shadow-[0_4px_14px_rgba(34,197,94,0.12)]'
                          : 'bg-white border-light-gray hover:border-mid-gray/30 hover:shadow-sm'
                      }`}
                    >
                      {selected && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-vision-green rounded-l-xl" />
                      )}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg} transition-transform group-hover:scale-105`}>
                        <Icon className={`w-5 h-5 ${selected ? iconColor : 'text-mid-gray'} transition-colors`} />
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-bold transition-colors ${selected ? 'text-vision-green' : 'text-charcoal'}`}>{label}</div>
                        <div className="text-xs text-mid-gray mt-0.5 leading-snug">{desc}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        selected ? 'bg-vision-green border-vision-green' : 'border-light-gray group-hover:border-mid-gray/60'
                      }`}>
                        {selected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="border-t border-light-gray/60" />

              {/* OPTIONS label */}
              <p className="text-[10px] font-black tracking-[0.15em] uppercase text-mid-gray/70">Options</p>

              {/* Option rows */}
              <div className="flex flex-col gap-2">
                {[
                  { key: 'reg',   checked: requireRegistration,  setter: setRequireRegistration,  label: 'Require', bold: 'registration' },
                  { key: 'sub',   checked: allowSubmissionAccess, setter: setAllowSubmissionAccess, label: 'Allow users to access their', bold: 'submissions through the app' },
                ].map(({ key, checked, setter, label, bold }) => (
                  <label
                    key={key}
                    className="flex items-center gap-4 px-5 py-3.5 bg-white rounded-xl border border-light-gray hover:border-mid-gray/30 cursor-pointer group transition-all hover:shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => setter(!checked)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                        checked ? 'bg-vision-green border-vision-green' : 'border-light-gray group-hover:border-mid-gray/60 bg-white'
                      }`}
                    >
                      {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </button>
                    <span className="text-sm text-charcoal select-none">
                      {label} <strong className="font-semibold">{bold}</strong>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-white border-t border-light-gray/50 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="h-9 px-5 rounded-lg border border-light-gray text-sm font-semibold text-mid-gray hover:border-mid-gray/50 hover:text-charcoal transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="h-9 px-5 rounded-lg bg-vision-green hover:bg-green-dark text-white text-sm font-bold tracking-wide shadow-sm hover:shadow-vision-green/20 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

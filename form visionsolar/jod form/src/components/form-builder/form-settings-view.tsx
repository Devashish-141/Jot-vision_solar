'use client';

import React, { useState } from 'react';
import { Settings, Mail, FileText, GitBranch, Heart, Bell, Plug, Activity, PenTool, ChevronRight, Lock, Plus, User, AlertCircle, Clock, CheckCircle2, CircleDot, Circle, Bold, Italic, Link as LinkIcon, Image as ImageIcon, AlignLeft, Maximize2, Type, Check, LayoutGrid, X, RotateCcw, FilePlus, ExternalLink, Download, Search, MessageSquare, Smartphone, Network } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function FormSettingsView() {
  const [activeSetting, setActiveSetting] = useState('settings');
  const [formTitle, setFormTitle] = useState('Form');
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [thankYouMode, setThankYouMode] = useState<'page' | 'redirect'>('page');
  const [thankYouUrl, setThankYouUrl] = useState('');
  const [thankYouHeading, setThankYouHeading] = useState('Thank You!');
  const [thankYouSubheading, setThankYouSubheading] = useState('Your submission has been received.');
  const [thankYouLayout, setThankYouLayout] = useState(0);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [rightPanelTab, setRightPanelTab] = useState<'layout' | 'fields'>('layout');

  const menuItems = [
    { id: 'settings', icon: Settings, title: 'FORM SETTINGS', desc: 'Customize form status and properties' },
    { id: 'emails', icon: Mail, title: 'EMAILS', desc: 'Send autoresponders and notifications' },
    { id: 'thankyou', icon: Heart, title: 'THANK YOU PAGE', desc: 'Show page after submission' },
    { id: 'notifications', icon: Bell, title: 'NOTIFICATIONS', desc: 'Receive submission notifications' },
    { id: 'integrations', icon: Plug, title: 'INTEGRATIONS', desc: 'Connect your form to other apps' },
  ];

  return (
    <div className="flex w-full h-full bg-off-white">
      {/* Light Sidebar (matching Build UI) */}
      <div className="w-[320px] bg-white border-r border-light-gray flex-shrink-0 h-full overflow-y-auto shadow-[2px_0_12px_rgba(0,0,0,0.03)] z-20 flex flex-col py-4">
        {menuItems.map((item) => (
          <div key={item.id} className="px-3 py-1">
            <button
              onClick={() => setActiveSetting(item.id)}
              className={`flex items-center gap-4 px-4 py-3 w-full text-left transition-all rounded-lg ${
                activeSetting === item.id 
                  ? 'bg-off-white text-charcoal shadow-sm border border-light-gray/50' 
                  : 'text-dark-gray hover:bg-off-white border border-transparent'
              }`}
            >
              <div className={`p-1.5 rounded-md ${activeSetting === item.id ? 'bg-white text-vision-green shadow-sm' : 'bg-off-white text-mid-gray'}`}>
                <item.icon className="w-4 h-4 shrink-0" />
              </div>
              <div>
                <div className="text-xs font-bold tracking-widest uppercase">{item.title}</div>
                <div className="text-[11px] mt-0.5 text-mid-gray/80 leading-tight">{item.desc}</div>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-12 relative">
        <div className="max-w-[700px] mx-auto pb-20">
          
          {activeSetting === 'settings' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-solar-orange rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-charcoal">FORM SETTINGS</h2>
                  <p className="text-sm text-mid-gray mt-0.5">Customize form status and properties</p>
                </div>
              </div>

              {/* Settings Card */}
              <div className="bg-white border border-light-gray/50 rounded-xl shadow-sm overflow-hidden flex flex-col">
                
                {/* Title Block */}
                <div className="p-8 flex flex-col gap-2 border-b border-light-gray/40">
                  <label className="text-[15px] font-bold text-charcoal">Title</label>
                  <p className="text-sm text-mid-gray mb-1">Enter a name for your form</p>
                  <Input 
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="max-w-full border-light-gray bg-white h-11 shadow-sm"
                  />
                </div>

                {/* Form Status Block */}
                <div className="p-8 flex flex-col gap-2 border-b border-light-gray/40">
                  <label className="text-[15px] font-bold text-charcoal">Form Status</label>
                  <p className="text-sm text-mid-gray mb-1">Enable, disable, or conditionally enable your form</p>
                  
                  <button className="mt-2 w-full flex items-center justify-between border border-light-gray rounded-lg p-4 hover:border-vision-green/40 hover:bg-green-50/30 transition-all text-left group">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-vision-green rounded flex items-center justify-center shrink-0 group-hover:shadow-sm transition-all">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-vision-green uppercase tracking-wide">ENABLED</div>
                        <div className="text-sm text-mid-gray mt-0.5">Your form is currently visible and able to receive submissions</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-mid-gray/50 shrink-0 group-hover:text-vision-green transition-colors" />
                  </button>
                </div>

                {/* Encrypt Form Data */}
                <div className="p-8 flex items-center justify-between border-b border-light-gray/40">
                  <div className="pr-8">
                    <label className="text-[15px] font-bold text-charcoal">Encrypt Form Data</label>
                    <p className="text-sm text-mid-gray mt-1">Encrypt your form responses to store sensitive data securely. <a href="#" className="text-vision-green hover:underline">Learn more</a></p>
                  </div>
                  <button 
                    onClick={() => setIsEncrypted(!isEncrypted)}
                    className={`w-12 h-6 rounded-full relative transition-colors shrink-0 ${isEncrypted ? 'bg-vision-green' : 'bg-light-gray/70'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${isEncrypted ? 'left-7' : 'left-1'}`}></span>
                  </button>
                </div>

                {/* Draft Mode */}
                <div className="p-8 flex items-center justify-between opacity-80 cursor-not-allowed">
                  <div className="pr-8">
                    <label className="text-[15px] font-bold text-charcoal flex items-center gap-2">
                      Draft Mode
                    </label>
                    <p className="text-sm text-mid-gray mt-1">Edit form in draft mode and apply updates to the live form at any time.</p>
                  </div>
                  <div className="relative group">
                    <button disabled className="w-12 h-6 rounded-full bg-light-gray/40 relative shrink-0 cursor-not-allowed flex items-center justify-end px-1.5 border border-light-gray">
                      <Lock className="w-3 h-3 text-mid-gray/50" />
                      <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm opacity-60"></span>
                    </button>
                    <div className="absolute right-0 bottom-full mb-2 w-48 bg-[#1A2332] text-white text-xs p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      This feature is available only with VisionSolar Enterprise
                    </div>
                  </div>
                </div>
              </div>

              <Button className="mt-6 bg-vision-green hover:bg-green-dark text-white font-bold tracking-wide uppercase px-6 h-11 text-xs">
                SHOW MORE OPTIONS
              </Button>
            </div>
          )}

          {activeSetting === 'emails' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-vision-green/10 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-vision-green" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-charcoal tracking-tight">Emails</h2>
                    <p className="text-sm text-mid-gray mt-0.5">Send autoresponders and notifications</p>
                  </div>
                </div>
                
                {/* Add Email Button moved to header for a cleaner layout */}
                <button className="h-11 px-6 bg-vision-green hover:bg-green-dark text-white rounded-lg shadow-[0_2px_10px_rgba(34,197,94,0.2)] flex items-center justify-center gap-2 font-bold tracking-wide transition-all hover:-translate-y-0.5 active:translate-y-0">
                  <Plus className="w-4 h-4" />
                  Add Email
                </button>
              </div>

              <div className="flex flex-col gap-5 mt-4">
                {/* Notification 1 Card */}
                <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-light-gray/40 border-l-[6px] border-l-solar-orange p-6 cursor-pointer hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:border-r-light-gray/60 hover:-translate-y-0.5 transition-all group">
                  <div className="flex items-start gap-5">
                    <div className="w-11 h-11 rounded-lg bg-solar-orange/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-solar-orange" />
                    </div>
                    
                    <div className="flex-1 pt-0.5">
                      <h3 className="text-[17px] font-bold text-charcoal mb-4 group-hover:text-solar-orange transition-colors">Notification 1</h3>
                      
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center text-sm">
                          <span className="w-16 text-mid-gray font-medium">From</span>
                          <span className="text-charcoal font-semibold">VisionSolar</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="w-16 text-mid-gray font-medium">To</span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-off-white border border-light-gray rounded-full text-dark-gray text-xs font-semibold shadow-sm group-hover:border-solar-orange/20 transition-colors">
                            <User className="w-3 h-3 text-mid-gray" />
                            admin@visionsolar.com
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 rounded-full hover:bg-off-white flex items-center justify-center text-mid-gray hover:text-solar-orange transition-colors">
                        <PenTool className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Autoresponder 1 Card */}
                <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-light-gray/40 border-l-[6px] border-l-vision-green p-6 cursor-pointer hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:border-r-light-gray/60 hover:-translate-y-0.5 transition-all group">
                  <div className="flex items-start gap-5">
                    <div className="w-11 h-11 rounded-lg bg-vision-green/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-vision-green" />
                    </div>
                    
                    <div className="flex-1 pt-0.5">
                      <h3 className="text-[17px] font-bold text-charcoal mb-4 group-hover:text-vision-green transition-colors">Autoresponder 1</h3>
                      
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center text-sm">
                          <span className="w-16 text-mid-gray font-medium">From</span>
                          <span className="text-charcoal font-semibold">VisionSolar</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="w-16 text-mid-gray font-medium">To</span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF0F0] border border-[#FFD6D6] rounded-full text-[#E03131] text-xs font-bold shadow-sm">
                            <AlertCircle className="w-3 h-3" />
                            Missing Recipient
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 rounded-full hover:bg-off-white flex items-center justify-center text-mid-gray hover:text-vision-green transition-colors">
                        <PenTool className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSetting === 'thankyou' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-vision-green/10 rounded-xl flex items-center justify-center shrink-0 shadow-[0_2px_10px_rgba(34,197,94,0.1)]">
                  <CheckCircle2 className="w-6 h-6 text-vision-green" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-charcoal tracking-tight">THANK YOU PAGE</h2>
                  <p className="text-sm text-mid-gray mt-0.5">Choose an Action After Submission:</p>
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button 
                  onClick={() => setThankYouMode('page')}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                    thankYouMode === 'page' 
                      ? 'bg-white border-vision-green shadow-[0_4px_14px_rgba(34,197,94,0.1)] ring-1 ring-vision-green' 
                      : 'bg-white border-light-gray hover:border-light-gray/80 hover:shadow-sm'
                  }`}
                >
                  {thankYouMode === 'page' ? (
                    <CircleDot className="w-5 h-5 text-vision-green shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-mid-gray shrink-0" />
                  )}
                  <span className={`text-sm font-semibold ${thankYouMode === 'page' ? 'text-charcoal' : 'text-dark-gray'}`}>Show a Thank You Page after submission</span>
                </button>

                <button 
                  onClick={() => setThankYouMode('redirect')}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                    thankYouMode === 'redirect' 
                      ? 'bg-white border-vision-green shadow-[0_4px_14px_rgba(34,197,94,0.1)] ring-1 ring-vision-green' 
                      : 'bg-white border-light-gray hover:border-light-gray/80 hover:shadow-sm'
                  }`}
                >
                  {thankYouMode === 'redirect' ? (
                    <CircleDot className="w-5 h-5 text-vision-green shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-mid-gray shrink-0" />
                  )}
                  <span className={`text-sm font-semibold ${thankYouMode === 'redirect' ? 'text-charcoal' : 'text-dark-gray'}`}>Redirect to an external link after submission</span>
                </button>
              </div>

              {/* Editor/Input Area */}
              {thankYouMode === 'page' ? (
                <div className="bg-white rounded-xl shadow-[0_2px_14px_rgba(0,0,0,0.06)] border border-light-gray/50 overflow-hidden flex flex-col">
                  {/* Toolbar */}
                  <div className="bg-charcoal flex items-center justify-between p-2">
                    <div className="flex items-center gap-1">
                      <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"><Type className="w-4 h-4" /></button>
                      <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"><Type className="w-5 h-5 scale-x-75" /></button>
                      <div className="w-px h-4 bg-white/20 mx-1"></div>
                      <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"><Bold className="w-4 h-4" /></button>
                      <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"><Italic className="w-4 h-4" /></button>
                      <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"><AlignLeft className="w-4 h-4" /></button>
                      <div className="w-px h-4 bg-white/20 mx-1"></div>
                      <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"><LinkIcon className="w-4 h-4" /></button>
                      <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"><ImageIcon className="w-4 h-4" /></button>
                      <div className="w-px h-4 bg-white/20 mx-1"></div>
                      <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"><LayoutGrid className="w-4 h-4" /></button>
                      <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"><Maximize2 className="w-4 h-4" /></button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setIsActionModalOpen(true)}
                        className="h-8 px-4 bg-white/10 hover:bg-white/20 text-white text-xs font-bold tracking-wide rounded-md transition-colors flex items-center gap-1.5 border border-white/10"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                        Action Buttons
                      </button>
                      <button 
                        onClick={() => {
                          setRightPanelTab('layout');
                          setIsRightPanelOpen(true);
                        }}
                        className="h-8 px-4 bg-vision-green hover:bg-green-dark text-white text-xs font-bold tracking-wide rounded-md transition-colors flex items-center gap-1.5 shadow-sm border border-vision-green/20"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Field
                      </button>
                    </div>
                  </div>

                  {/* Canvas */}
                  <div className="bg-[#f3f3f5] p-12 min-h-[400px] flex items-center justify-center">
                    <div className="bg-white w-full max-w-[600px] rounded-xl shadow-sm p-12 flex flex-col items-center justify-center text-center transition-all">
                      
                      {thankYouLayout === 0 && (
                        <>
                          <div className="relative flex flex-col items-center justify-center mb-8">
                            <div className="w-24 h-20 bg-vision-green rounded-t-lg flex items-center justify-center translate-y-4 z-0 shadow-sm">
                              <Check className="w-10 h-10 text-white mb-2" strokeWidth={4} />
                            </div>
                            <div className="relative z-10 text-[#e2e8f0]">
                              <svg width="120" height="70" viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 0L60 40L120 0V70H0V0Z" fill="currentColor"/>
                                <path d="M0 0L60 40L120 0" stroke="rgba(0,0,0,0.05)" strokeWidth="2"/>
                              </svg>
                            </div>
                          </div>
                          <input value={thankYouHeading} onChange={(e) => setThankYouHeading(e.target.value)} className="text-4xl font-bold text-charcoal text-center bg-transparent outline-none w-full border-b border-transparent focus:border-light-gray hover:border-light-gray/50 transition-colors mb-3" />
                          <textarea value={thankYouSubheading} onChange={(e) => setThankYouSubheading(e.target.value)} className="text-mid-gray text-center bg-transparent outline-none w-full resize-none overflow-hidden h-10 border-b border-transparent focus:border-light-gray hover:border-light-gray/50 transition-colors" />
                        </>
                      )}

                      {thankYouLayout === 1 && (
                        <>
                          <div className="w-20 h-20 rounded-full bg-vision-green/10 flex items-center justify-center mb-6"><Check className="w-10 h-10 text-vision-green" strokeWidth={3} /></div>
                          <input value={thankYouHeading} onChange={(e) => setThankYouHeading(e.target.value)} className="text-4xl font-bold text-charcoal text-center bg-transparent outline-none w-full border-b border-transparent focus:border-light-gray hover:border-light-gray/50 transition-colors mb-3" />
                          <textarea value={thankYouSubheading} onChange={(e) => setThankYouSubheading(e.target.value)} className="text-mid-gray text-center bg-transparent outline-none w-full resize-none overflow-hidden h-10 border-b border-transparent focus:border-light-gray hover:border-light-gray/50 transition-colors" />
                        </>
                      )}

                      {thankYouLayout === 2 && (
                        <div className="flex items-center gap-8 text-left w-full">
                          <div className="w-20 h-20 rounded-full bg-vision-green flex items-center justify-center shrink-0 shadow-sm"><Check className="w-10 h-10 text-white" strokeWidth={3} /></div>
                          <div className="flex-1">
                            <input value={thankYouHeading} onChange={(e) => setThankYouHeading(e.target.value)} className="text-4xl font-bold text-charcoal bg-transparent outline-none w-full border-b border-transparent focus:border-light-gray hover:border-light-gray/50 transition-colors mb-2" />
                            <textarea value={thankYouSubheading} onChange={(e) => setThankYouSubheading(e.target.value)} className="text-mid-gray bg-transparent outline-none w-full resize-none overflow-hidden h-10 border-b border-transparent focus:border-light-gray hover:border-light-gray/50 transition-colors" />
                          </div>
                        </div>
                      )}

                      {thankYouLayout === 3 && (
                        <>
                          <input value={thankYouHeading} onChange={(e) => setThankYouHeading(e.target.value)} className="text-[48px] leading-tight font-extrabold text-vision-green text-center bg-transparent outline-none w-full border-b border-transparent focus:border-light-gray hover:border-light-gray/50 transition-colors mb-4" />
                          <textarea value={thankYouSubheading} onChange={(e) => setThankYouSubheading(e.target.value)} className="text-lg text-charcoal font-medium text-center bg-transparent outline-none w-full resize-none overflow-hidden h-10 border-b border-transparent focus:border-light-gray hover:border-light-gray/50 transition-colors" />
                        </>
                      )}

                      {thankYouLayout === 4 && (
                        <div className="flex items-center gap-8 text-right w-full">
                          <div className="flex-1">
                            <input value={thankYouHeading} onChange={(e) => setThankYouHeading(e.target.value)} className="text-4xl font-bold text-charcoal bg-transparent outline-none w-full border-b border-transparent focus:border-light-gray hover:border-light-gray/50 transition-colors mb-2 text-right" />
                            <textarea value={thankYouSubheading} onChange={(e) => setThankYouSubheading(e.target.value)} className="text-mid-gray bg-transparent outline-none w-full resize-none overflow-hidden h-10 border-b border-transparent focus:border-light-gray hover:border-light-gray/50 transition-colors text-right" />
                          </div>
                          <div className="w-20 h-20 rounded-full bg-vision-green flex items-center justify-center shrink-0 shadow-sm"><Check className="w-10 h-10 text-white" strokeWidth={3} /></div>
                        </div>
                      )}

                      {thankYouLayout === 5 && (
                        <>
                          <Check className="w-24 h-24 text-vision-green mb-6" strokeWidth={4} />
                          <input value={thankYouHeading} onChange={(e) => setThankYouHeading(e.target.value)} className="text-4xl font-bold text-charcoal text-center bg-transparent outline-none w-full border-b border-transparent focus:border-light-gray hover:border-light-gray/50 transition-colors mb-3" />
                          <textarea value={thankYouSubheading} onChange={(e) => setThankYouSubheading(e.target.value)} className="text-mid-gray text-center bg-transparent outline-none w-full resize-none overflow-hidden h-10 border-b border-transparent focus:border-light-gray hover:border-light-gray/50 transition-colors" />
                        </>
                      )}

                      {thankYouLayout === 6 && (
                        <>
                          <input value={thankYouHeading} onChange={(e) => setThankYouHeading(e.target.value)} className="text-4xl font-bold text-charcoal text-center bg-transparent outline-none w-full border-b border-transparent focus:border-light-gray hover:border-light-gray/50 transition-colors mb-6" />
                          <div className="w-16 h-16 rounded-full bg-vision-green flex items-center justify-center mb-6 shadow-sm"><Check className="w-8 h-8 text-white" strokeWidth={3} /></div>
                          <textarea value={thankYouSubheading} onChange={(e) => setThankYouSubheading(e.target.value)} className="text-mid-gray text-center bg-transparent outline-none w-full resize-none overflow-hidden h-10 border-b border-transparent focus:border-light-gray hover:border-light-gray/50 transition-colors" />
                        </>
                      )}

                      {thankYouLayout === 7 && (
                        <>
                          <div className="w-20 h-20 rounded-xl bg-vision-green/10 border-2 border-vision-green flex items-center justify-center mb-6 transform rotate-3"><Check className="w-10 h-10 text-vision-green" strokeWidth={4} /></div>
                          <input value={thankYouHeading} onChange={(e) => setThankYouHeading(e.target.value)} className="text-4xl font-bold text-charcoal text-center bg-transparent outline-none w-full border-b border-transparent focus:border-light-gray hover:border-light-gray/50 transition-colors mb-3" />
                          <textarea value={thankYouSubheading} onChange={(e) => setThankYouSubheading(e.target.value)} className="text-mid-gray text-center bg-transparent outline-none w-full resize-none overflow-hidden h-10 border-b border-transparent focus:border-light-gray hover:border-light-gray/50 transition-colors" />
                        </>
                      )}

                      {thankYouLayout === 8 && (
                        <div className="bg-charcoal w-full rounded-2xl p-10 flex flex-col items-center shadow-lg">
                          <div className="w-16 h-16 rounded-full bg-vision-green flex items-center justify-center mb-6 shadow-sm"><Check className="w-8 h-8 text-white" strokeWidth={3} /></div>
                          <input value={thankYouHeading} onChange={(e) => setThankYouHeading(e.target.value)} className="text-4xl font-bold text-white text-center bg-transparent outline-none w-full border-b border-transparent focus:border-white/20 hover:border-white/20 transition-colors mb-3" />
                          <textarea value={thankYouSubheading} onChange={(e) => setThankYouSubheading(e.target.value)} className="text-white/70 text-center bg-transparent outline-none w-full resize-none overflow-hidden h-10 border-b border-transparent focus:border-white/20 hover:border-white/20 transition-colors" />
                        </div>
                      )}

                      {thankYouLayout === 9 && (
                        <div className="border-4 border-vision-green border-dashed rounded-3xl p-10 w-full flex flex-col items-center bg-vision-green/5">
                          <Check className="w-16 h-16 text-vision-green mb-6" strokeWidth={3} />
                          <input value={thankYouHeading} onChange={(e) => setThankYouHeading(e.target.value)} className="text-4xl font-bold text-charcoal text-center bg-transparent outline-none w-full border-b border-transparent focus:border-vision-green/50 transition-colors mb-3" />
                          <textarea value={thankYouSubheading} onChange={(e) => setThankYouSubheading(e.target.value)} className="text-dark-gray text-center bg-transparent outline-none w-full resize-none overflow-hidden h-10 border-b border-transparent focus:border-vision-green/50 transition-colors" />
                        </div>
                      )}

                      {thankYouLayout === 10 && (
                        <>
                          <div className="flex items-center justify-center gap-4 w-full mb-4">
                            <Check className="w-12 h-12 text-vision-green shrink-0" strokeWidth={4} />
                            <input value={thankYouHeading} onChange={(e) => setThankYouHeading(e.target.value)} className="text-5xl font-black text-charcoal bg-transparent outline-none flex-1 border-b border-transparent focus:border-light-gray hover:border-light-gray/50 transition-colors" />
                          </div>
                          <textarea value={thankYouSubheading} onChange={(e) => setThankYouSubheading(e.target.value)} className="text-xl text-mid-gray text-center bg-transparent outline-none w-full resize-none overflow-hidden h-10 border-b border-transparent focus:border-light-gray hover:border-light-gray/50 transition-colors" />
                        </>
                      )}

                      {thankYouLayout === 11 && (
                        <div className="bg-gradient-to-br from-vision-green to-[#1e8a44] w-full p-10 rounded-2xl flex flex-col items-center shadow-lg text-white">
                          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6"><Check className="w-10 h-10 text-white" strokeWidth={3} /></div>
                          <input value={thankYouHeading} onChange={(e) => setThankYouHeading(e.target.value)} className="text-4xl font-bold text-white text-center bg-transparent outline-none w-full border-b border-transparent focus:border-white/30 transition-colors mb-3 placeholder:text-white/50" />
                          <textarea value={thankYouSubheading} onChange={(e) => setThankYouSubheading(e.target.value)} className="text-white/80 text-center bg-transparent outline-none w-full resize-none overflow-hidden h-10 border-b border-transparent focus:border-white/30 transition-colors placeholder:text-white/40" />
                        </div>
                      )}

                      {thankYouLayout === 12 && (
                        <div className="flex flex-col items-center w-full relative pt-16">
                          <div className="absolute top-0 w-full h-32 bg-vision-green/10 rounded-xl -z-10"></div>
                          <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center mb-6 z-10 border border-light-gray/20">
                            <Check className="w-12 h-12 text-vision-green" strokeWidth={3} />
                          </div>
                          <input value={thankYouHeading} onChange={(e) => setThankYouHeading(e.target.value)} className="text-4xl font-bold text-charcoal text-center bg-transparent outline-none w-full border-b border-transparent focus:border-light-gray transition-colors mb-3" />
                          <textarea value={thankYouSubheading} onChange={(e) => setThankYouSubheading(e.target.value)} className="text-mid-gray text-center bg-transparent outline-none w-full resize-none overflow-hidden h-10 border-b border-transparent focus:border-light-gray transition-colors" />
                        </div>
                      )}

                      {thankYouLayout === 13 && (
                        <>
                          <div className="flex gap-4 mb-8">
                            <div className="w-4 h-4 rounded-full bg-vision-green animate-pulse"></div>
                            <div className="w-4 h-4 rounded-full bg-solar-orange animate-pulse delay-75"></div>
                            <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse delay-150"></div>
                          </div>
                          <input value={thankYouHeading} onChange={(e) => setThankYouHeading(e.target.value)} className="text-4xl font-bold text-charcoal text-center bg-transparent outline-none w-full border-b border-transparent focus:border-light-gray transition-colors mb-3" />
                          <textarea value={thankYouSubheading} onChange={(e) => setThankYouSubheading(e.target.value)} className="text-mid-gray text-center bg-transparent outline-none w-full resize-none overflow-hidden h-10 border-b border-transparent focus:border-light-gray transition-colors" />
                        </>
                      )}

                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-light-gray/50 p-8 animate-in fade-in">
                  <label className="text-[15px] font-bold text-charcoal block mb-2">Redirect URL</label>
                  <p className="text-sm text-mid-gray mb-4">Users will be redirected to this URL immediately after submitting the form.</p>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <LinkIcon className="h-5 w-5 text-mid-gray" />
                    </div>
                    <input 
                      type="url"
                      placeholder="https://example.com"
                      value={thankYouUrl}
                      onChange={(e) => setThankYouUrl(e.target.value)}
                      className="block w-full pl-11 pr-4 h-12 bg-white border border-light-gray rounded-lg text-sm transition-all focus:border-vision-green focus:ring-1 focus:ring-vision-green outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}


          {activeSetting === 'notifications' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#4263EB]/10 rounded-xl flex items-center justify-center shrink-0">
                    <Bell className="w-6 h-6 text-[#4263EB]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-charcoal tracking-tight">NOTIFICATIONS</h2>
                    <p className="text-sm text-mid-gray mt-0.5">Receive instant alerts across multiple channels</p>
                  </div>
                </div>
              </div>

              {/* Notification Channels Grid */}
              <div className="flex flex-col gap-4">
                
                {/* Email Notification */}
                <div className="bg-white rounded-xl shadow-sm border border-light-gray/60 p-5 hover:shadow-md hover:border-[#4263EB]/40 transition-all group flex items-center justify-between cursor-pointer relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#4263EB] rounded-l-xl"></div>
                  <div className="flex items-center gap-5 pl-2">
                    <div className="w-12 h-12 rounded-full bg-[#4263EB]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mail className="w-5 h-5 text-[#4263EB]" />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold text-charcoal group-hover:text-[#4263EB] transition-colors">Email Notifications</h3>
                      <p className="text-[13px] text-mid-gray mt-0.5">Receive an email instantly when someone submits</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-[#4263EB]/10 text-[#4263EB] text-[11px] font-bold rounded-full uppercase tracking-wider">Enabled</span>
                    <ChevronRight className="w-5 h-5 text-mid-gray/40 group-hover:text-[#4263EB] transition-colors" />
                  </div>
                </div>

                {/* WhatsApp Notification */}
                <div className="bg-white rounded-xl shadow-sm border border-light-gray/60 p-5 hover:shadow-md hover:border-[#25D366]/40 transition-all group flex items-center justify-between cursor-pointer relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#25D366] rounded-l-xl"></div>
                  <div className="flex items-center gap-5 pl-2">
                    <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#25D366]">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold text-charcoal group-hover:text-[#25D366] transition-colors">WhatsApp</h3>
                      <p className="text-[13px] text-mid-gray mt-0.5">Get form submissions instantly delivered via WhatsApp</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-mid-gray/40 group-hover:text-[#25D366] transition-colors" />
                </div>



              </div>
            </div>
          )}

          {activeSetting === 'integrations' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center shrink-0">
                  <Plug className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-charcoal tracking-tight">INTEGRATIONS</h2>
                  <p className="text-sm text-mid-gray mt-0.5">Connect your form to other apps</p>
                </div>
              </div>

              {/* Integrations Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Webhooks Card */}
                <button className="bg-white rounded-xl shadow-sm border border-light-gray/60 p-8 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-vision-green/40 transition-all group flex flex-col items-center justify-center text-center aspect-square relative overflow-hidden">
                  <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-vision-green to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-16 h-16 rounded-2xl bg-vision-green/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-vision-green transition-all mb-4">
                    <Network className="w-8 h-8 text-vision-green group-hover:text-white transition-colors" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-bold text-charcoal mb-2">Webhooks</h3>
                  <p className="text-sm text-mid-gray px-4 leading-relaxed">Send form submission notifications to a URL</p>
                </button>

                {/* Request Integration Card */}
                <button className="bg-off-white rounded-xl border-2 border-dashed border-light-gray p-8 hover:bg-white hover:border-[#4263EB]/40 hover:shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition-all group flex flex-col items-center justify-center text-center aspect-square">
                  <div className="w-12 h-12 rounded-full bg-[#4263EB] flex items-center justify-center group-hover:scale-110 transition-transform mb-4 shadow-sm">
                    <Plus className="w-6 h-6 text-white" strokeWidth={3} />
                  </div>
                  <h3 className="text-[15px] font-bold text-[#4263EB] mb-2 group-hover:underline decoration-2 underline-offset-4">Request an integration</h3>
                  <p className="text-sm text-mid-gray px-2">Please tell us about the integration you're requesting</p>
                </button>

              </div>
            </div>
          )}

          {activeSetting !== 'settings' && activeSetting !== 'emails' && activeSetting !== 'thankyou' && activeSetting !== 'notifications' && activeSetting !== 'integrations' && (
            <div className="h-64 flex flex-col items-center justify-center text-mid-gray/50 animate-in fade-in">
              <Settings className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">Settings panel coming soon</p>
            </div>
          )}
        </div>

        {/* Right Side Panel for Thank You Settings */}
        <div 
          className={`absolute top-0 right-0 h-full w-[360px] bg-white border-l border-light-gray shadow-[-8px_0_24px_rgba(0,0,0,0.04)] z-40 flex flex-col transition-transform duration-300 ${
            isRightPanelOpen && activeSetting === 'thankyou' ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between p-5 border-b border-light-gray/50 bg-off-white">
            <h3 className="font-bold text-charcoal">Thank You Page Settings</h3>
            <button 
              onClick={() => setIsRightPanelOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-light-gray/60 flex items-center justify-center text-mid-gray transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Panel Tabs */}
          <div className="flex border-b border-light-gray/50 bg-off-white">
            <button 
              onClick={() => setRightPanelTab('layout')}
              className={`flex-1 py-3 text-xs font-bold tracking-wider uppercase transition-all border-b-2 ${
                rightPanelTab === 'layout' ? 'text-vision-green border-vision-green' : 'text-mid-gray border-transparent hover:text-dark-gray'
              }`}
            >
              Layout
            </button>
            <button 
              onClick={() => setRightPanelTab('fields')}
              className={`flex-1 py-3 text-xs font-bold tracking-wider uppercase transition-all border-b-2 ${
                rightPanelTab === 'fields' ? 'text-vision-green border-vision-green' : 'text-mid-gray border-transparent hover:text-dark-gray'
              }`}
            >
              Fields
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            {rightPanelTab === 'layout' && (
              <div className="grid grid-cols-2 gap-4">
                {/* Layout 0: Envelope */}
                <button onClick={() => setThankYouLayout(0)} className={`aspect-[4/3] rounded-lg border-2 flex flex-col items-center justify-center gap-2 p-2 transition-all relative ${thankYouLayout === 0 ? 'border-vision-green bg-vision-green/5' : 'border-light-gray hover:border-mid-gray bg-white'}`}>
                  {thankYouLayout === 0 && <div className="absolute -top-2 -right-2 w-5 h-5 bg-vision-green text-white rounded-full flex items-center justify-center"><Check className="w-3 h-3" strokeWidth={3}/></div>}
                  <div className="w-8 h-6 bg-light-gray/50 rounded flex items-center justify-center relative"><div className="absolute top-1 w-4 h-4 bg-vision-green rounded-sm"></div></div>
                  <div className="w-12 h-1.5 bg-dark-gray rounded-full"></div><div className="w-16 h-1 bg-light-gray rounded-full"></div>
                </button>

                {/* Layout 1: Circle Check */}
                <button onClick={() => setThankYouLayout(1)} className={`aspect-[4/3] rounded-lg border-2 flex flex-col items-center justify-center gap-2 p-2 transition-all relative ${thankYouLayout === 1 ? 'border-vision-green bg-vision-green/5' : 'border-light-gray hover:border-mid-gray bg-white'}`}>
                  {thankYouLayout === 1 && <div className="absolute -top-2 -right-2 w-5 h-5 bg-vision-green text-white rounded-full flex items-center justify-center"><Check className="w-3 h-3" strokeWidth={3}/></div>}
                  <div className="w-8 h-8 bg-vision-green/20 rounded-full flex items-center justify-center"><Check className="w-4 h-4 text-vision-green" strokeWidth={3}/></div>
                  <div className="w-12 h-1.5 bg-dark-gray rounded-full"></div><div className="w-16 h-1 bg-light-gray rounded-full"></div>
                </button>

                {/* Layout 2: Left Align */}
                <button onClick={() => setThankYouLayout(2)} className={`aspect-[4/3] rounded-lg border-2 flex items-center justify-center gap-3 p-3 transition-all relative ${thankYouLayout === 2 ? 'border-vision-green bg-vision-green/5' : 'border-light-gray hover:border-mid-gray bg-white'}`}>
                  {thankYouLayout === 2 && <div className="absolute -top-2 -right-2 w-5 h-5 bg-vision-green text-white rounded-full flex items-center justify-center"><Check className="w-3 h-3" strokeWidth={3}/></div>}
                  <div className="w-8 h-8 bg-vision-green rounded-full flex items-center justify-center shrink-0"><Check className="w-4 h-4 text-white" strokeWidth={3}/></div>
                  <div className="flex flex-col gap-1.5 flex-1"><div className="w-full h-1.5 bg-dark-gray rounded-full"></div><div className="w-3/4 h-1 bg-light-gray rounded-full"></div></div>
                </button>

                {/* Layout 3: Minimal Text */}
                <button onClick={() => setThankYouLayout(3)} className={`aspect-[4/3] rounded-lg border-2 flex flex-col items-center justify-center gap-2 p-2 transition-all relative ${thankYouLayout === 3 ? 'border-vision-green bg-vision-green/5' : 'border-light-gray hover:border-mid-gray bg-white'}`}>
                  {thankYouLayout === 3 && <div className="absolute -top-2 -right-2 w-5 h-5 bg-vision-green text-white rounded-full flex items-center justify-center"><Check className="w-3 h-3" strokeWidth={3}/></div>}
                  <div className="w-16 h-2.5 bg-vision-green rounded-full mb-1"></div><div className="w-20 h-1 bg-dark-gray rounded-full"></div>
                </button>

                {/* Layout 4: Right Align */}
                <button onClick={() => setThankYouLayout(4)} className={`aspect-[4/3] rounded-lg border-2 flex items-center justify-center gap-3 p-3 transition-all relative ${thankYouLayout === 4 ? 'border-vision-green bg-vision-green/5' : 'border-light-gray hover:border-mid-gray bg-white'}`}>
                  {thankYouLayout === 4 && <div className="absolute -top-2 -right-2 w-5 h-5 bg-vision-green text-white rounded-full flex items-center justify-center"><Check className="w-3 h-3" strokeWidth={3}/></div>}
                  <div className="flex flex-col gap-1.5 flex-1 items-end"><div className="w-full h-1.5 bg-dark-gray rounded-full"></div><div className="w-3/4 h-1 bg-light-gray rounded-full"></div></div>
                  <div className="w-8 h-8 bg-vision-green rounded-full flex items-center justify-center shrink-0"><Check className="w-4 h-4 text-white" strokeWidth={3}/></div>
                </button>

                {/* Layout 5: Large Check Only */}
                <button onClick={() => setThankYouLayout(5)} className={`aspect-[4/3] rounded-lg border-2 flex flex-col items-center justify-center gap-2 p-2 transition-all relative ${thankYouLayout === 5 ? 'border-vision-green bg-vision-green/5' : 'border-light-gray hover:border-mid-gray bg-white'}`}>
                  {thankYouLayout === 5 && <div className="absolute -top-2 -right-2 w-5 h-5 bg-vision-green text-white rounded-full flex items-center justify-center"><Check className="w-3 h-3" strokeWidth={3}/></div>}
                  <Check className="w-8 h-8 text-vision-green mb-1" strokeWidth={3}/>
                  <div className="w-12 h-1.5 bg-dark-gray rounded-full"></div><div className="w-16 h-1 bg-light-gray rounded-full"></div>
                </button>

                {/* Layout 6: Text Top */}
                <button onClick={() => setThankYouLayout(6)} className={`aspect-[4/3] rounded-lg border-2 flex flex-col items-center justify-center gap-2 p-2 transition-all relative ${thankYouLayout === 6 ? 'border-vision-green bg-vision-green/5' : 'border-light-gray hover:border-mid-gray bg-white'}`}>
                  {thankYouLayout === 6 && <div className="absolute -top-2 -right-2 w-5 h-5 bg-vision-green text-white rounded-full flex items-center justify-center"><Check className="w-3 h-3" strokeWidth={3}/></div>}
                  <div className="w-12 h-1.5 bg-dark-gray rounded-full"></div>
                  <div className="w-6 h-6 bg-vision-green rounded-full flex items-center justify-center my-1"><Check className="w-3 h-3 text-white" strokeWidth={3}/></div>
                  <div className="w-16 h-1 bg-light-gray rounded-full"></div>
                </button>

                {/* Layout 7: Square Tilted */}
                <button onClick={() => setThankYouLayout(7)} className={`aspect-[4/3] rounded-lg border-2 flex flex-col items-center justify-center gap-2 p-2 transition-all relative ${thankYouLayout === 7 ? 'border-vision-green bg-vision-green/5' : 'border-light-gray hover:border-mid-gray bg-white'}`}>
                  {thankYouLayout === 7 && <div className="absolute -top-2 -right-2 w-5 h-5 bg-vision-green text-white rounded-full flex items-center justify-center"><Check className="w-3 h-3" strokeWidth={3}/></div>}
                  <div className="w-8 h-8 rounded bg-vision-green/10 border-2 border-vision-green flex items-center justify-center transform rotate-6"><Check className="w-4 h-4 text-vision-green" strokeWidth={3}/></div>
                  <div className="w-12 h-1.5 bg-dark-gray rounded-full"></div><div className="w-16 h-1 bg-light-gray rounded-full"></div>
                </button>

                {/* Layout 8: Dark Theme */}
                <button onClick={() => setThankYouLayout(8)} className={`aspect-[4/3] rounded-lg border-2 flex flex-col items-center justify-center gap-2 p-2 transition-all relative bg-charcoal ${thankYouLayout === 8 ? 'border-vision-green ring-2 ring-vision-green/50' : 'border-transparent hover:border-light-gray'}`}>
                  {thankYouLayout === 8 && <div className="absolute -top-2 -right-2 w-5 h-5 bg-vision-green text-white rounded-full flex items-center justify-center"><Check className="w-3 h-3" strokeWidth={3}/></div>}
                  <div className="w-6 h-6 bg-vision-green rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" strokeWidth={3}/></div>
                  <div className="w-12 h-1.5 bg-white rounded-full"></div><div className="w-16 h-1 bg-white/50 rounded-full"></div>
                </button>

                {/* Layout 9: Dashed Border */}
                <button onClick={() => setThankYouLayout(9)} className={`aspect-[4/3] rounded-lg border-2 flex flex-col items-center justify-center gap-2 p-2 transition-all relative ${thankYouLayout === 9 ? 'border-vision-green bg-vision-green/5' : 'border-light-gray hover:border-mid-gray bg-white'}`}>
                  {thankYouLayout === 9 && <div className="absolute -top-2 -right-2 w-5 h-5 bg-vision-green text-white rounded-full flex items-center justify-center"><Check className="w-3 h-3" strokeWidth={3}/></div>}
                  <div className="w-full h-full border-2 border-dashed border-vision-green/50 rounded flex flex-col items-center justify-center gap-1.5 p-1">
                    <Check className="w-6 h-6 text-vision-green" strokeWidth={3}/>
                    <div className="w-10 h-1.5 bg-dark-gray rounded-full"></div>
                  </div>
                </button>

                {/* Layout 10: Check Inline Text */}
                <button onClick={() => setThankYouLayout(10)} className={`aspect-[4/3] rounded-lg border-2 flex flex-col items-center justify-center gap-2 p-2 transition-all relative ${thankYouLayout === 10 ? 'border-vision-green bg-vision-green/5' : 'border-light-gray hover:border-mid-gray bg-white'}`}>
                  {thankYouLayout === 10 && <div className="absolute -top-2 -right-2 w-5 h-5 bg-vision-green text-white rounded-full flex items-center justify-center"><Check className="w-3 h-3" strokeWidth={3}/></div>}
                  <div className="flex items-center justify-center gap-1.5 w-full">
                    <Check className="w-5 h-5 text-vision-green" strokeWidth={4}/>
                    <div className="w-12 h-2.5 bg-dark-gray rounded-full"></div>
                  </div>
                  <div className="w-16 h-1 bg-light-gray rounded-full mt-1"></div>
                </button>

                {/* Layout 11: Green Theme */}
                <button onClick={() => setThankYouLayout(11)} className={`aspect-[4/3] rounded-lg border-2 flex flex-col items-center justify-center gap-2 p-2 transition-all relative bg-vision-green ${thankYouLayout === 11 ? 'border-white ring-2 ring-vision-green' : 'border-transparent hover:border-white/50'}`}>
                  {thankYouLayout === 11 && <div className="absolute -top-2 -right-2 w-5 h-5 bg-white text-vision-green rounded-full flex items-center justify-center shadow-md"><Check className="w-3 h-3" strokeWidth={3}/></div>}
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" strokeWidth={3}/></div>
                  <div className="w-12 h-1.5 bg-white rounded-full"></div><div className="w-16 h-1 bg-white/70 rounded-full"></div>
                </button>

                {/* Layout 12: Split Background */}
                <button onClick={() => setThankYouLayout(12)} className={`aspect-[4/3] rounded-lg border-2 flex flex-col items-center justify-center gap-1.5 p-2 transition-all relative overflow-hidden ${thankYouLayout === 12 ? 'border-vision-green bg-vision-green/5' : 'border-light-gray hover:border-mid-gray bg-white'}`}>
                  {thankYouLayout === 12 && <div className="absolute -top-2 -right-2 w-5 h-5 bg-vision-green text-white rounded-full flex items-center justify-center z-10"><Check className="w-3 h-3" strokeWidth={3}/></div>}
                  <div className="absolute top-0 w-full h-[40%] bg-vision-green/10"></div>
                  <div className="w-6 h-6 rounded-full bg-white shadow-sm border border-light-gray/20 flex items-center justify-center mt-3 z-10"><Check className="w-3 h-3 text-vision-green" strokeWidth={3}/></div>
                  <div className="w-10 h-1.5 bg-dark-gray rounded-full z-10"></div>
                  <div className="w-14 h-1 bg-light-gray rounded-full z-10"></div>
                </button>

                {/* Layout 13: Decorative Dots */}
                <button onClick={() => setThankYouLayout(13)} className={`aspect-[4/3] rounded-lg border-2 flex flex-col items-center justify-center gap-2 p-2 transition-all relative ${thankYouLayout === 13 ? 'border-vision-green bg-vision-green/5' : 'border-light-gray hover:border-mid-gray bg-white'}`}>
                  {thankYouLayout === 13 && <div className="absolute -top-2 -right-2 w-5 h-5 bg-vision-green text-white rounded-full flex items-center justify-center"><Check className="w-3 h-3" strokeWidth={3}/></div>}
                  <div className="flex gap-1 mb-1">
                    <div className="w-2 h-2 rounded-full bg-vision-green"></div><div className="w-2 h-2 rounded-full bg-solar-orange"></div><div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  </div>
                  <div className="w-12 h-1.5 bg-dark-gray rounded-full"></div><div className="w-16 h-1 bg-light-gray rounded-full"></div>
                </button>
              </div>
            )}

            {rightPanelTab === 'fields' && (
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-mid-gray" />
                  <input 
                    type="text" 
                    placeholder="Search form fields"
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-light-gray bg-off-white text-sm outline-none focus:border-vision-green focus:bg-white transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  {[
                    { title: 'Submission ID', id: '{id}' },
                    { title: 'Form Title', id: '{form_title}' },
                    { title: 'IP Address', id: '{ip}' },
                  ].map((field, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-light-gray/60 hover:border-vision-green/40 hover:bg-vision-green/5 transition-colors group cursor-pointer">
                      <button className="w-8 h-8 rounded bg-vision-green/10 text-vision-green flex items-center justify-center shrink-0 group-hover:bg-vision-green group-hover:text-white transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                      <div>
                        <div className="text-sm font-bold text-charcoal">{field.title}</div>
                        <div className="text-xs text-mid-gray">{field.id}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons Modal */}
      {isActionModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/40 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[640px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 mx-4">
            {/* Modal Header */}
            <div className="flex items-start justify-between p-6 border-b border-light-gray/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-vision-green/10 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-vision-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-charcoal tracking-tight">Action Buttons</h3>
                  <p className="text-sm text-mid-gray mt-0.5">Add a button to the Thank You page</p>
                </div>
              </div>
              <button 
                onClick={() => setIsActionModalOpen(false)}
                className="w-8 h-8 rounded-full bg-off-white hover:bg-light-gray/80 flex items-center justify-center text-mid-gray hover:text-charcoal transition-colors focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {[
                { title: 'Fill Again', desc: 'Allow users to fill out the form again', icon: RotateCcw, color: 'text-solar-orange', bg: 'bg-solar-orange/10' },
                { title: 'Fill Another Form', desc: 'Allow users to fill out another form', icon: FilePlus, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { title: 'Visit URL', desc: 'Allow users to visit a URL', icon: ExternalLink, color: 'text-teal-500', bg: 'bg-teal-500/10' },
                { title: 'Edit Submission', desc: 'Allow users to edit their submissions', icon: PenTool, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                { title: 'Download PDF', desc: 'Allow users to download selected PDFs', icon: Download, color: 'text-vision-green', bg: 'bg-vision-green/10' },
              ].map((action, idx) => (
                <button key={idx} className="flex items-center justify-between p-4 rounded-xl border border-light-gray/50 hover:border-light-gray hover:bg-off-white/50 hover:shadow-sm transition-all group text-left">
                  <div className="flex items-center gap-5">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${action.bg}`}>
                      <action.icon className={`w-[22px] h-[22px] ${action.color}`} />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-charcoal group-hover:text-vision-green transition-colors">{action.title}</h4>
                      <p className="text-sm text-mid-gray">{action.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-mid-gray/30 group-hover:text-mid-gray transition-colors" />
                </button>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-off-white border-t border-light-gray/50 text-center text-sm text-mid-gray">
              Can't find the action you need? <a href="#" className="text-vision-green font-semibold hover:underline transition-all">Tell us about it</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

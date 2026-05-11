'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus, FileText, Upload, FileSignature, CheckCircle,
  ArrowLeft, X, Table2, Copy, Loader2
} from 'lucide-react';
import { DocumentToFormOverlay } from '@/components/form-builder/document-to-form-overlay';
import { SubmissionsOverlay } from '@/components/form-builder/submissions-overlay';
import { formService } from '@/lib/supabase/form-service';

export default function DashboardPage() {
  const router = useRouter();
  const userName = "Alex";
  const [showImport, setShowImport]       = useState(false);
  const [showDocToForm, setShowDocToForm] = useState(false);
  const [submissionsForm, setSubmissionsForm] = useState<{ id: string, title: string } | null>(null);
  const [showGlobalSignatures, setShowGlobalSignatures] = useState(false);
  const [loading, setLoading] = useState(true);
  const [forms, setForms] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalForms: 0,
    totalSubmissions: 0,
    submissionRate: 0
  });

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const data = await formService.getFormsWithStats();
        setForms(data.forms);
        setStats(data.stats);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const handleCreateOptionClick = (optionName: string) => {
    if (optionName === 'Start from Scratch') {
      router.push('/form/builder');
    } else if (optionName === 'Import form') {
      setShowImport(true);
    } else if (optionName === 'Document to form') {
      setShowDocToForm(true);
    } else if (optionName === 'Collect signatures') {
      router.push('/form/sign');
    } else {
      alert(`You clicked ${optionName}`);
    }
  };

  const handleFormClick = (form: any) => {
    setSubmissionsForm({ id: form.id, title: form.title });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="w-8 h-8 animate-spin text-vision-green" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-[1200px] mx-auto p-2 sm:p-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-charcoal">Welcome back, {userName}</h1>
          <p className="text-sm sm:text-base text-dark-gray mt-1 font-medium">Here is what's happening today.</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-10 rounded-md px-6 sm:px-8 py-2 bg-vision-green hover:bg-green-dark text-white shadow-lg transition-transform hover:scale-105 w-full sm:w-auto">
            <Plus className="w-5 h-5 mr-2" />
            Create
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2 shadow-xl rounded-xl border border-light-gray p-1">
            <DropdownMenuItem onClick={() => handleCreateOptionClick('Start from Scratch')} className="cursor-pointer py-2.5 rounded-lg focus:bg-accent focus:text-vision-green transition-colors">
              <Plus className="w-4 h-4 mr-3" />
              <span>Start from Scratch</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCreateOptionClick('Import form')} className="cursor-pointer py-2.5 rounded-lg focus:bg-accent focus:text-vision-green transition-colors">
              <Upload className="w-4 h-4 mr-3" />
              <span>Import form</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCreateOptionClick('Document to form')} className="cursor-pointer py-2.5 rounded-lg focus:bg-accent focus:text-vision-green transition-colors">
              <FileText className="w-4 h-4 mr-3" />
              <span>Document to form</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCreateOptionClick('Collect signatures')} className="cursor-pointer py-2.5 rounded-lg focus:bg-accent focus:text-vision-green transition-colors">
              <FileSignature className="w-4 h-4 mr-3" />
              <span>Collect signatures</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <Card className="shadow-md border-none ring-1 ring-black/5 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-off-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-mid-gray uppercase tracking-wider mb-1">Total Forms</p>
                <h3 className="text-3xl sm:text-4xl font-bold text-charcoal">{stats.totalForms}</h3>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          onClick={() => setShowGlobalSignatures(true)}
          className="shadow-md border-none ring-1 ring-black/5 rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer active:scale-[0.98] bg-gradient-to-br from-white to-off-white group/stat"
        >
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-mid-gray uppercase tracking-wider mb-1 group-hover/stat:text-vision-green transition-colors">Signatures Collected</p>
                <h3 className="text-3xl sm:text-4xl font-bold text-charcoal">{stats.totalSubmissions.toLocaleString()}</h3>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 group-hover/stat:bg-vision-green/10 group-hover/stat:text-vision-green transition-all">
                <FileSignature className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-none ring-1 ring-black/5 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-off-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-mid-gray uppercase tracking-wider mb-1">Submission Rate</p>
                <h3 className="text-3xl sm:text-4xl font-bold text-charcoal">{stats.submissionRate}%</h3>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Forms List */}
      <div className="px-1">
        <h2 className="text-xl font-bold text-charcoal mb-4">Recent Forms</h2>
        {forms.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-light-gray">
            <p className="text-mid-gray">No forms found. Create your first form to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {forms.map((form, index) => (
              <Card 
                key={form.id} 
                onClick={() => handleFormClick(form)}
                className="group overflow-hidden rounded-2xl border border-light-gray/60 hover:border-vision-green/40 hover:shadow-xl transition-all cursor-pointer"
              >
                <CardContent className="p-0">
                  <div className="p-5 sm:p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 sm:p-3 bg-accent rounded-xl text-vision-green group-hover:scale-110 transition-transform">
                        <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <span className={`px-3 py-1 text-[10px] sm:text-xs font-semibold rounded-full ${
                        form.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {form.status}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-charcoal mb-1 truncate group-hover:text-vision-green transition-colors">
                      {form.title}
                    </h3>
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-xs sm:text-sm text-dark-gray font-medium">
                        <span className="text-charcoal font-bold">{form.responses}</span> Responses
                      </div>
                      <p className="text-[10px] sm:text-xs text-mid-gray">
                        {form.lastUpdated}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Overlays */}
      {showImport && (
        <div className="fixed inset-0 z-[200] bg-white animate-in fade-in duration-200 flex flex-col">

          {/* Top bar */}
          <div className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5 shrink-0">
            <button
              onClick={() => setShowImport(false)}
              className="flex items-center gap-2 text-sm font-semibold text-mid-gray hover:text-charcoal transition-colors group"
            >
              <div className="w-8 h-8 rounded-full border border-light-gray group-hover:border-mid-gray/40 group-hover:bg-off-white flex items-center justify-center transition-all">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="hidden xs:inline">Back</span>
            </button>

            <button
              onClick={() => setShowImport(false)}
              className="w-9 h-9 rounded-full bg-off-white hover:bg-light-gray/60 flex items-center justify-center text-mid-gray hover:text-charcoal transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto flex flex-col items-center px-4 sm:px-6 py-6 sm:py-8">

            {/* Heading */}
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-vision-green/10 mb-4">
                <Upload className="w-6 h-6 sm:w-7 sm:h-7 text-vision-green" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">Import Form</h1>
              <p className="text-sm sm:text-base text-mid-gray mt-2">Bring your forms into VisionSolar in seconds</p>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 w-full max-w-[900px]">
              {[
                {
                  icon: FileText,
                  bg: 'bg-red-400',
                  label: 'Upload PDF',
                  desc: 'Turn any PDF into an editable digital form',
                },
                {
                  icon: Copy,
                  bg: 'bg-vision-green',
                  label: 'Clone a Form',
                  desc: 'Duplicate an existing form as a starting point',
                },
                {
                  icon: Table2,
                  bg: 'bg-blue-500',
                  label: 'CSV / Excel',
                  desc: 'Import data from a spreadsheet to generate a form',
                },
              ].map(({ icon: Icon, bg, label, desc }) => (
                <button
                  key={label}
                  className="group bg-white rounded-2xl border border-light-gray/60 hover:border-vision-green/40 hover:shadow-xl transition-all text-left p-5 sm:p-6 flex flex-col gap-4 sm:gap-5"
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${bg} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-charcoal group-hover:text-vision-green transition-colors">{label}</p>
                    <p className="text-xs sm:text-sm text-mid-gray mt-1 leading-relaxed">{desc}</p>
                  </div>
                  <div className="mt-auto pt-3 border-t border-light-gray/50 flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs font-semibold text-mid-gray group-hover:text-vision-green transition-colors uppercase tracking-wider">Get started</span>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-off-white group-hover:bg-vision-green/10 flex items-center justify-center transition-colors">
                      <ArrowLeft className="w-2.5 h-2.5 sm:w-3 sm:h-3 rotate-180 text-mid-gray group-hover:text-vision-green transition-colors" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showDocToForm && <DocumentToFormOverlay onClose={() => setShowDocToForm(false)} />}
      
      {submissionsForm && (
        <SubmissionsOverlay 
          formId={submissionsForm.id} 
          formTitle={submissionsForm.title} 
          onClose={() => setSubmissionsForm(null)} 
        />
      )}

      {showGlobalSignatures && (
        <SubmissionsOverlay 
          formTitle="All Signatures"
          isGlobalSignatures={true}
          onClose={() => setShowGlobalSignatures(false)}
        />
      )}
    </div>
  );
}

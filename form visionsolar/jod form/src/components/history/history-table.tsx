'use client';

import { CheckCircle2, Clock, Archive, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Job } from '@/lib/types';

interface HistoryTableProps {
  jobs: Job[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function HistoryTable({ jobs, page, totalPages, onPageChange }: HistoryTableProps) {
  const statusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge className="bg-vision-green/15 text-green-dark border-0 text-xs">Completed</Badge>;
      case 'Cancelled':
        return <Badge className="bg-red-100 text-red-700 border-0 text-xs">Cancelled</Badge>;
      case 'Archived':
        return <Badge className="bg-gray-100 text-dark-gray border-0 text-xs">Archived</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">{status}</Badge>;
    }
  };

  const invoiceIcon = (status?: string) => {
    switch (status) {
      case 'Paid':
        return (
          <div className="flex items-center gap-1.5 text-vision-green">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-medium">Paid</span>
          </div>
        );
      case 'Unpaid':
      case 'Draft':
        return (
          <div className="flex items-center gap-1.5 text-solar-orange">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-medium">{status}</span>
          </div>
        );
      case 'Overdue':
        return (
          <div className="flex items-center gap-1.5 text-destructive">
            <XCircle className="w-4 h-4" />
            <span className="text-xs font-medium">Overdue</span>
          </div>
        );
      default:
        return <span className="text-xs text-mid-gray">—</span>;
    }
  };

  return (
    <div className="bg-white border border-light-gray rounded-xl overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-light-gray bg-off-white/50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-mid-gray uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-mid-gray uppercase tracking-wider">Job #</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-mid-gray uppercase tracking-wider">Client Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-mid-gray uppercase tracking-wider">Contact</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-mid-gray uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-mid-gray uppercase tracking-wider">Invoice</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-mid-gray uppercase tracking-wider">System Size</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-light-gray">
            {jobs.map(job => (
              <tr key={job.id} className="hover:bg-off-white/50 transition-colors cursor-pointer group">
                <td className="px-4 py-3">
                  <span className="text-sm text-dark-gray">
                    {job.completed_date
                      ? new Date(job.completed_date).toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' })
                      : '—'
                    }
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-semibold text-vision-green group-hover:underline">
                    {job.job_number}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-charcoal">
                    {job.client?.first_name} {job.client?.last_name}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm text-dark-gray">{job.contact_email || job.client?.email}</p>
                    <p className="text-xs text-mid-gray">{job.contact_phone || job.client?.mobile}</p>
                  </div>
                </td>
                <td className="px-4 py-3">{statusBadge(job.status)}</td>
                <td className="px-4 py-3">{invoiceIcon(job.invoice_status)}</td>
                <td className="px-4 py-3">
                  <span className="text-sm text-dark-gray font-medium">{job.system_size || '—'}</span>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <Archive className="w-8 h-8 text-light-gray mx-auto mb-3" />
                  <p className="text-sm text-mid-gray">No records found</p>
                  <p className="text-xs text-mid-gray mt-1">Try adjusting your filters or search query</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-light-gray px-4 py-3 flex items-center justify-between">
          <p className="text-xs text-mid-gray">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
              className="h-8 px-2 border-light-gray"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
              <Button
                key={p}
                variant={p === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(p)}
                className={`h-8 w-8 p-0 ${
                  p === page
                    ? 'bg-vision-green hover:bg-green-light text-white'
                    : 'border-light-gray'
                }`}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => onPageChange(page + 1)}
              className="h-8 px-2 border-light-gray"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

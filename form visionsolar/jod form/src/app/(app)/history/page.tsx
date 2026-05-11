'use client';

import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HistoryFilters } from '@/components/history/history-filters';
import { HistoryTable } from '@/components/history/history-table';
import { AuditLog } from '@/components/history/audit-log';
import { getCompletedJobs, mockJobs } from '@/lib/mock-data';

const PAGE_SIZE = 10;

export default function HistoryPage() {
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState('All');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  // Get all historical jobs
  const allHistoryJobs = useMemo(() => {
    return mockJobs.filter(j =>
      ['Completed', 'Cancelled', 'Archived'].includes(j.status)
    );
  }, []);

  // Apply filters
  const filteredJobs = useMemo(() => {
    let jobs = allHistoryJobs;

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      jobs = jobs.filter(j =>
        j.job_number.toLowerCase().includes(q) ||
        j.client?.first_name.toLowerCase().includes(q) ||
        j.client?.last_name.toLowerCase().includes(q) ||
        j.address.toLowerCase().includes(q) ||
        j.system_size?.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter.length > 0) {
      jobs = jobs.filter(j => statusFilter.includes(j.status));
    }

    // Date range filter
    if (dateRange !== 'All') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      let startDate: Date;

      switch (dateRange) {
        case 'Today':
          startDate = today;
          break;
        case 'Yesterday':
          startDate = new Date(today.getTime() - 86400000);
          break;
        case 'Last 7 Days':
          startDate = new Date(today.getTime() - 7 * 86400000);
          break;
        case 'This Month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          startDate = new Date(0);
      }

      jobs = jobs.filter(j => {
        const date = j.completed_date ? new Date(j.completed_date) : null;
        return date && date >= startDate;
      });
    }

    return jobs;
  }, [allHistoryJobs, search, statusFilter, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));
  const paginatedJobs = filteredJobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-charcoal">History</h1>
        <p className="text-sm text-dark-gray mt-0.5">View completed jobs, invoices, and activity logs</p>
      </div>

      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList className="bg-off-white border border-light-gray">
          <TabsTrigger
            value="jobs"
            className="data-[state=active]:bg-white data-[state=active]:text-charcoal data-[state=active]:shadow-sm"
          >
            Job History
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="data-[state=active]:bg-white data-[state=active]:text-charcoal data-[state=active]:shadow-sm"
          >
            Recent Changes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4 mt-0">
          <HistoryFilters
            search={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            dateRange={dateRange}
            onDateRangeChange={(v) => { setDateRange(v); setPage(1); }}
            statusFilter={statusFilter}
            onStatusFilterChange={(v) => { setStatusFilter(v); setPage(1); }}
          />

          <div className="flex items-center justify-between">
            <p className="text-sm text-mid-gray">
              {filteredJobs.length} record{filteredJobs.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <HistoryTable
            jobs={paginatedJobs}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </TabsContent>

        <TabsContent value="activity" className="mt-0">
          <div className="bg-white border border-light-gray rounded-xl py-4 overflow-hidden">
            <div className="px-4 pb-3 border-b border-light-gray mb-4">
              <p className="text-sm font-medium text-charcoal">Account Activity Log</p>
              <p className="text-xs text-mid-gray mt-0.5">Admin-only view of all recent changes</p>
            </div>
            <AuditLog />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

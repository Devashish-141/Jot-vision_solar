import { useState, useEffect } from 'react';
import { jobService } from '@/lib/supabase/service';
import type { Job } from '@/lib/types';

interface TasksViewProps {
  onJobClick: (jobId: string) => void;
  refreshKey?: number;
}

export function TasksView({ onJobClick, refreshKey }: TasksViewProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await jobService.fetchJobs();
        setJobs(data);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, [refreshKey]);

  const jobsWithTasks = jobs.filter(j =>
    !['Completed', 'Cancelled', 'Archived'].includes(j.status)
  );

  return (
    <div className="h-full flex flex-col">
      {/* Table Header */}
      <div className="grid grid-cols-6 bg-off-white border-b border-light-gray text-[11px] uppercase tracking-wider text-mid-gray font-semibold">
        <div className="px-4 py-2.5 col-span-1">Task ▾</div>
        <div className="px-4 py-2.5">Customer</div>
        <div className="px-4 py-2.5">Job #</div>
        <div className="px-4 py-2.5">Staff Member</div>
        <div className="px-4 py-2.5">Due Date</div>
        <div className="px-4 py-2.5">Task Status</div>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-y-auto">
        {jobsWithTasks.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-mid-gray italic">
              Tasks will show here when they&apos;re assigned to a Staff member in a job&apos;s checklist
            </p>
          </div>
        ) : (
          jobsWithTasks.map(job => (
            <div
              key={job.id}
              onClick={() => onJobClick(job.id)}
              className="grid grid-cols-6 border-b border-light-gray hover:bg-off-white/50 transition-colors cursor-pointer"
            >
              <div className="px-4 py-3 col-span-1">
                <p className="text-sm text-charcoal truncate">{job.description?.substring(0, 40)}...</p>
              </div>
              <div className="px-4 py-3">
                <p className="text-sm text-charcoal">{job.client?.first_name} {job.client?.last_name}</p>
              </div>
              <div className="px-4 py-3">
                <span className="text-sm font-semibold text-vision-green">{job.job_number}</span>
              </div>
              <div className="px-4 py-3">
                <p className="text-sm text-dark-gray">
                  {job.assigned_to ? 'Assigned' : '—'}
                </p>
              </div>
              <div className="px-4 py-3">
                <p className="text-sm text-dark-gray">
                  {job.scheduled_date
                    ? new Date(job.scheduled_date).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' })
                    : '—'
                  }
                </p>
              </div>
              <div className="px-4 py-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  job.status === 'Work Order' ? 'bg-blue-100 text-blue-700'
                  : job.status === 'In Progress' ? 'bg-vision-green/15 text-green-dark'
                  : 'bg-solar-orange/15 text-orange-dark'
                }`}>
                  {job.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

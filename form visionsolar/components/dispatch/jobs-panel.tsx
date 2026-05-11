'use client';

import { useState, useEffect } from 'react';
import { Search, X, GripVertical, MapPin, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { jobService } from '@/lib/supabase/service';
import type { Job } from '@/lib/types';

interface JobsPanelProps {
  onJobDoubleClick: (jobId: string) => void;
  refreshKey?: number;
}

function JobCard({ job, onDoubleClick }: { job: Job; onDoubleClick: () => void }) {
  const statusColors: Record<string, string> = {
    'Quote': 'bg-solar-orange',
    'Quote Sent': 'bg-solar-orange',
    'Lead': 'bg-solar-orange',
    'Work Order': 'bg-blue-500',
    'In Progress': 'bg-vision-green',
    'Completed': 'bg-vision-green',
  };
  const dotColor = statusColors[job.status] || 'bg-mid-gray';

  const statusLetters: Record<string, { letter: string; bg: string; text: string }> = {
    'Quote': { letter: 'Q', bg: 'bg-solar-orange', text: 'text-white' },
    'Quote Sent': { letter: 'Q', bg: 'bg-solar-orange', text: 'text-white' },
    'Lead': { letter: 'Q', bg: 'bg-solar-orange', text: 'text-white' },
    'Work Order': { letter: 'W', bg: 'bg-blue-500', text: 'text-white' },
    'In Progress': { letter: 'W', bg: 'bg-blue-500', text: 'text-white' },
    'Completed': { letter: 'C', bg: 'bg-vision-green', text: 'text-white' },
  };
  const badge = statusLetters[job.status] || { letter: '?', bg: 'bg-mid-gray', text: 'text-white' };

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('application/job-id', job.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      onDoubleClick={onDoubleClick}
      className="px-3 py-2.5 border-b border-light-gray hover:bg-off-white transition-colors cursor-grab active:cursor-grabbing group"
    >
      <div className="flex items-start gap-2.5">
        {/* Status badge circle */}
        <div className={`w-8 h-8 rounded-full ${badge.bg} ${badge.text} flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-sm`}>
          {badge.letter}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-charcoal truncate">
              {job.client?.first_name} {job.client?.last_name}
            </p>
            <span className="text-[10px] text-mid-gray font-medium ml-2 shrink-0">#{job.job_number.replace('VS-', '')}</span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-mid-gray shrink-0" />
            <p className="text-xs text-mid-gray truncate">{job.address}</p>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0`} />
            <p className="text-xs text-dark-gray truncate">{job.description?.substring(0, 60)}...</p>
          </div>
          <div className="mt-1.5 flex items-center text-[10px] text-vision-green font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="w-3 h-3 mr-0.5" />
            Drag to schedule • Double Click to Open Job
          </div>
        </div>
      </div>
    </div>
  );
}

export function JobsPanel({ onJobDoubleClick, refreshKey }: JobsPanelProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All Jobs');

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await jobService.fetchJobs();
        setJobs(data);
      } catch (error) {
        console.error('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, [refreshKey]);

  const filteredJobs = jobs.filter(j => {
    // Status filter
    if (filter === 'Quotes' && !['Quote', 'Quote Sent', 'Lead'].includes(j.status)) return false;
    if (filter === 'Work Orders' && j.status !== 'Work Order') return false;
    if (filter === 'Completed' && j.status !== 'Completed') return false;

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      return (
        j.job_number.toLowerCase().includes(q) ||
        j.client?.first_name.toLowerCase().includes(q) ||
        j.client?.last_name.toLowerCase().includes(q) ||
        j.address.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="w-[280px] bg-white border-l border-light-gray flex flex-col shrink-0 h-full">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-light-gray shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-charcoal">Jobs</h3>
          <span className="text-[10px] text-mid-gray">{filteredJobs.length} jobs</span>
        </div>

        {/* Filter */}
        <Select value={filter} onValueChange={(v) => v && setFilter(v)}>
          <SelectTrigger className="h-8 text-xs bg-off-white border-light-gray mb-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Jobs">All Jobs</SelectItem>
            <SelectItem value="Quotes">Quotes</SelectItem>
            <SelectItem value="Work Orders">Work Orders</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-mid-gray" />
          <Input
            id="jobs-panel-search"
            placeholder="Job Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-7 h-8 text-xs bg-off-white border-light-gray"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-mid-gray hover:text-charcoal"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Job Cards */}
      <div className="flex-1 overflow-y-auto">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-10 px-4">
            <p className="text-xs text-mid-gray">No jobs match your search</p>
          </div>
        ) : (
          filteredJobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              onDoubleClick={() => onJobDoubleClick(job.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

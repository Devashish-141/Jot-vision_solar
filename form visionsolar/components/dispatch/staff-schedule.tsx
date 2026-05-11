'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { mockProfiles, mockJobs } from '@/lib/mock-data';

const VIEW_MODES = ['Day', 'Week', 'Month'] as const;
type ViewMode = (typeof VIEW_MODES)[number];

const HOURS = Array.from({ length: 10 }, (_, i) => i + 7); // 7 AM to 4 PM

export function StaffSchedule() {
  const [viewMode, setViewMode] = useState<ViewMode>('Day');

  const technicians = mockProfiles.filter(p => p.role === 'Technician');

  // Get jobs for each staff member
  const getStaffJobs = (staffId: string) => {
    return mockJobs.filter(j =>
      j.assigned_to === staffId &&
      j.scheduled_date === new Date().toISOString().split('T')[0]
    );
  };

  const statusColor = (status?: string) => {
    switch (status) {
      case 'On Site': return 'bg-vision-green text-white';
      case 'En Route': return 'bg-solar-orange text-white';
      case 'Available': return 'bg-gray-100 text-dark-gray';
      default: return 'bg-gray-100 text-dark-gray';
    }
  };

  return (
    <div className="w-[360px] bg-white border-l border-light-gray flex flex-col shrink-0 h-full">
      {/* Header */}
      <div className="p-4 border-b border-light-gray shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-charcoal">Staff Schedule</h2>
          <div className="flex items-center gap-1 bg-off-white rounded-lg p-0.5">
            {VIEW_MODES.map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  viewMode === mode
                    ? 'bg-white text-charcoal shadow-sm'
                    : 'text-mid-gray hover:text-dark-gray'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" className="w-7 h-7 text-mid-gray">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs font-medium text-charcoal">
            {new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
          <Button variant="ghost" size="icon" className="w-7 h-7 text-mid-gray">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Staff Timeline */}
      <div className="flex-1 overflow-y-auto">
        {technicians.map(staff => {
          const jobs = getStaffJobs(staff.id);
          const totalHours = jobs.reduce((sum, j) => sum + (j.estimated_hours || 0), 0);
          const maxHours = 8;
          const capacityPercent = Math.min((totalHours / maxHours) * 100, 100);

          return (
            <div key={staff.id} className="border-b border-light-gray">
              <div className="p-3">
                {/* Staff info */}
                <div className="flex items-center gap-2.5 mb-3">
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback className="bg-vision-green/10 text-green-dark text-xs font-semibold">
                      {staff.full_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal truncate">{staff.full_name}</p>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-[10px] px-1.5 py-0 h-4 ${statusColor(staff.status)}`}>
                        {staff.status}
                      </Badge>
                      <span className="text-[10px] text-mid-gray">
                        {totalHours}/{maxHours}h booked
                      </span>
                    </div>
                  </div>
                </div>

                {/* Capacity bar */}
                <div className="h-1.5 bg-light-gray rounded-full mb-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      capacityPercent > 90 ? 'bg-destructive' :
                        capacityPercent > 70 ? 'bg-solar-orange' : 'bg-vision-green'
                    }`}
                    style={{ width: `${capacityPercent}%` }}
                  />
                </div>

                {/* Timeline blocks */}
                <div className="relative h-12 bg-off-white rounded-lg overflow-hidden">
                  {/* Hour markers */}
                  <div className="absolute inset-0 flex">
                    {HOURS.map((hour, i) => (
                      <div
                        key={hour}
                        className="flex-1 border-r border-light-gray/50 relative"
                      >
                        {i % 2 === 0 && (
                          <span className="absolute -top-0.5 left-0.5 text-[8px] text-mid-gray/60">
                            {hour > 12 ? `${hour - 12}p` : `${hour}a`}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Job blocks */}
                  {jobs.map((job, i) => {
                    const startHour = 8 + i * 3; // Stagger jobs
                    const duration = job.estimated_hours || 3;
                    const left = ((startHour - 7) / HOURS.length) * 100;
                    const width = (duration / HOURS.length) * 100;

                    return (
                      <div
                        key={job.id}
                        className="absolute top-2 h-8 rounded-md flex items-center px-2 text-[10px] font-medium text-white shadow-sm cursor-pointer hover:brightness-110 transition-all"
                        style={{
                          left: `${left}%`,
                          width: `${width}%`,
                          backgroundColor: job.category === 'Installation' ? '#5C8F5A' : '#E3A25B',
                        }}
                        title={`${job.job_number}: ${job.client?.first_name} ${job.client?.last_name}`}
                      >
                        <span className="truncate">{job.job_number}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {technicians.length === 0 && (
          <div className="text-center py-10">
            <User className="w-8 h-8 text-light-gray mx-auto mb-2" />
            <p className="text-sm text-mid-gray">No technicians found</p>
          </div>
        )}
      </div>
    </div>
  );
}

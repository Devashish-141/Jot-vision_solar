'use client';

import { Package, Clock, Wrench, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { mockJobs } from '@/lib/mock-data';
import type { Job } from '@/lib/types';

interface QueuesViewProps {
  onJobClick: (jobId: string) => void;
}

function QueueJobCard({ job, onClick }: { job: Job; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-light-gray p-3 hover:shadow-sm hover:border-vision-green/40 transition-all cursor-pointer"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-vision-green">{job.job_number}</span>
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-off-white text-mid-gray">
          {job.status}
        </Badge>
      </div>
      <p className="text-sm font-medium text-charcoal">
        {job.client?.first_name} {job.client?.last_name}
      </p>
      <div className="flex items-center gap-1 mt-1">
        <MapPin className="w-3 h-3 text-mid-gray shrink-0" />
        <p className="text-xs text-mid-gray truncate">{job.address}</p>
      </div>
    </div>
  );
}

export function QueuesView({ onJobClick }: QueuesViewProps) {
  const partsOnOrder = mockJobs.filter(j => j.materials_status === 'Pending' || j.materials_status === 'Ordered');
  const pendingQuotes = mockJobs.filter(j => ['Quote', 'Quote Sent'].includes(j.status));
  const workshop = mockJobs.filter(j => j.category === 'Service');

  const queues = [
    {
      title: 'Parts on Order',
      icon: Package,
      iconColor: 'text-solar-orange',
      iconBg: 'bg-orange-50',
      items: partsOnOrder,
    },
    {
      title: 'Pending Quotes',
      icon: Clock,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
      items: pendingQuotes,
    },
    {
      title: 'Workshop',
      icon: Wrench,
      iconColor: 'text-vision-green',
      iconBg: 'bg-green-50',
      items: workshop,
    },
  ];

  return (
    <div className="h-full bg-off-white/30 p-4">
      {/* Queue header tabs */}
      <div className="flex items-center gap-1 mb-4 border-b border-light-gray">
        {queues.map(q => {
          const Icon = q.icon;
          return (
            <div
              key={q.title}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-dark-gray border-b-2 border-transparent hover:border-vision-green hover:text-charcoal transition-all cursor-pointer"
            >
              <Icon className={`w-3.5 h-3.5 ${q.iconColor}`} />
              {q.title}
              <Badge variant="secondary" className="text-[9px] px-1 py-0 h-3.5 bg-off-white text-mid-gray ml-1">
                {q.items.length}
              </Badge>
            </div>
          );
        })}
      </div>

      {/* Queue columns */}
      <div className="grid grid-cols-3 gap-4">
        {queues.map(q => {
          const Icon = q.icon;
          return (
            <div key={q.title}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-7 h-7 rounded-md ${q.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-3.5 h-3.5 ${q.iconColor}`} />
                </div>
                <h3 className="text-sm font-semibold text-charcoal">{q.title}</h3>
                <Badge variant="secondary" className="text-[10px] bg-off-white text-mid-gray ml-auto">
                  {q.items.length}
                </Badge>
              </div>
              <div className="space-y-2">
                {q.items.length === 0 ? (
                  <p className="text-xs text-mid-gray text-center py-8 bg-white rounded-lg border border-dashed border-light-gray">
                    No jobs in this queue
                  </p>
                ) : (
                  q.items.map(job => (
                    <QueueJobCard
                      key={job.id}
                      job={job}
                      onClick={() => onJobClick(job.id)}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

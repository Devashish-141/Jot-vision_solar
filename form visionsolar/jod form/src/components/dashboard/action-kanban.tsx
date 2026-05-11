'use client';

import { Package, Search, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockJobs } from '@/lib/mock-data';

interface KanbanCardProps {
  jobNumber: string;
  clientName: string;
  address: string;
  badge?: string;
  badgeColor?: string;
  onClick?: () => void;
}

function KanbanCard({ jobNumber, clientName, address, badge, badgeColor = 'bg-gray-100 text-dark-gray', onClick }: KanbanCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 bg-white rounded-lg border border-light-gray hover:border-vision-green/50 hover:shadow-sm transition-all duration-200 group"
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold text-vision-green">{jobNumber}</span>
        {badge && (
          <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${badgeColor}`}>
            {badge}
          </Badge>
        )}
      </div>
      <p className="text-sm font-medium text-charcoal truncate">{clientName}</p>
      <p className="text-xs text-mid-gray truncate mt-0.5">{address}</p>
      <div className="mt-2 flex items-center text-xs text-mid-gray group-hover:text-vision-green transition-colors">
        <span>View details</span>
        <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </button>
  );
}

interface ActionKanbanProps {
  onJobClick?: (jobId: string) => void;
}

export function ActionKanban({ onJobClick }: ActionKanbanProps) {
  // Parts to order: materials_status = 'Pending'
  const partsToOrder = mockJobs.filter(j => j.materials_status === 'Pending');

  // Pending site assessments: status = 'Lead' and requires_site_visit = true
  const pendingAssessments = mockJobs.filter(j => j.status === 'Lead' && j.requires_site_visit);

  const columns = [
    {
      title: 'Parts to Order',
      icon: Package,
      iconColor: 'text-solar-orange',
      iconBg: 'bg-orange-50',
      items: partsToOrder,
      badgeText: 'Pending',
      badgeColor: 'bg-solar-orange/15 text-orange-dark',
    },
    {
      title: 'Pending Assessments',
      icon: Search,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
      items: pendingAssessments,
      badgeText: 'Site Visit',
      badgeColor: 'bg-blue-100 text-blue-700',
    },
  ];

  return (
    <Card className="border-light-gray">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-charcoal">Action Required</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {columns.map(col => {
            const Icon = col.icon;
            return (
              <div key={col.title} className="space-y-2.5">
                <div className="flex items-center gap-2 pb-2 border-b border-light-gray">
                  <div className={`w-7 h-7 rounded-md ${col.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-3.5 h-3.5 ${col.iconColor}`} />
                  </div>
                  <span className="text-sm font-medium text-charcoal">{col.title}</span>
                  <Badge variant="secondary" className="ml-auto text-[10px] bg-off-white text-mid-gray">
                    {col.items.length}
                  </Badge>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {col.items.length === 0 ? (
                    <p className="text-xs text-mid-gray text-center py-6">All clear! 🎉</p>
                  ) : (
                    col.items.map(job => (
                      <KanbanCard
                        key={job.id}
                        jobNumber={job.job_number}
                        clientName={`${job.client?.first_name} ${job.client?.last_name}`}
                        address={job.address}
                        badge={col.badgeText}
                        badgeColor={col.badgeColor}
                        onClick={() => onJobClick?.(job.id)}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

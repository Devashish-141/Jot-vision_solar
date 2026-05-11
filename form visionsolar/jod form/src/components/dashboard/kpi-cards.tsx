'use client';

import { useEffect, useState } from 'react';
import { Calendar, Users, FileCheck, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockJobs, mockProfiles, getTodaysJobs } from '@/lib/mock-data';

function AnimatedCounter({ value, prefix = '' }: { value: number; prefix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 600;
    const steps = 20;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{prefix}{count.toLocaleString()}</span>;
}

export function KpiCards() {
  const todaysJobs = getTodaysJobs();
  const pendingApprovals = mockJobs.filter(j => j.status === 'Quote Sent').length;


  const teamCounts = {
    onSite: mockProfiles.filter(p => p.status === 'On Site').length,
    enRoute: mockProfiles.filter(p => p.status === 'En Route').length,
    available: mockProfiles.filter(p => p.status === 'Available').length,
  };

  const kpis = [
    {
      title: 'Jobs Scheduled Today',
      value: todaysJobs.length,
      icon: Calendar,
      color: 'text-vision-green',
      bgColor: 'bg-green-50',
      trend: '+2 from yesterday',
    },
    {
      title: 'Team Status',
      value: -1, // Special rendering
      icon: Users,
      color: 'text-vision-green',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pending Approvals',
      value: pendingApprovals,
      icon: FileCheck,
      color: 'text-solar-orange',
      bgColor: 'bg-orange-50',
      trend: 'Awaiting client response',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <Card
            key={kpi.title}
            className={`card-hover border-light-gray animate-fade-in stagger-${index + 1}`}
            style={{ opacity: 0 }}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-medium text-mid-gray uppercase tracking-wider">{kpi.title}</p>
                <div className={`w-9 h-9 rounded-lg ${kpi.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-4.5 h-4.5 ${kpi.color}`} />
                </div>
              </div>

              {kpi.value === -1 ? (
                /* Team Status special rendering */
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-vision-green/15 text-green-dark border-0 hover:bg-vision-green/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-vision-green mr-1.5 animate-pulse-dot" />
                      {teamCounts.onSite} On Site
                    </Badge>
                    <Badge className="bg-solar-orange/15 text-orange-dark border-0 hover:bg-solar-orange/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-solar-orange mr-1.5 animate-pulse-dot" />
                      {teamCounts.enRoute} En Route
                    </Badge>
                    <Badge className="bg-gray-100 text-dark-gray border-0 hover:bg-gray-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-mid-gray mr-1.5" />
                      {teamCounts.available} Available
                    </Badge>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-2xl font-bold text-charcoal animate-count-up">
                    <AnimatedCounter value={kpi.value} />
                  </p>
                  {kpi.trend && (
                    <p className="text-xs text-mid-gray mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {kpi.trend}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

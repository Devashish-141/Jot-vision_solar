'use client';

import { useState } from 'react';
import {
  Plus, Package, Clock, Wrench, UserPlus,
  Map, ListChecks, CalendarDays, Users, Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { JobModal } from '@/components/job-modal/job-modal';
import { JobsPanel } from '@/components/dispatch/jobs-panel';
import { DispatchMap } from '@/components/dispatch/dispatch-map';
import { TasksView } from '@/components/dispatch/tasks-view';
import { CalendarView } from '@/components/dispatch/calendar-view';
import { StaffScheduleView } from '@/components/dispatch/staff-schedule-view';
import { QueuesView } from '@/components/dispatch/queues-view';
import { mockProfiles } from '@/lib/mock-data';

const TABS = [
  { id: 'map', label: 'Dispatch Map', icon: Map },
  { id: 'tasks', label: 'Tasks', icon: ListChecks },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'schedules', label: 'Staff Schedules', icon: Users },
  { id: 'queues', label: 'Queues', icon: Layers },
] as const;

type TabId = (typeof TABS)[number]['id'];

const QUEUE_ACTIONS = [
  { label: 'Parts on Order', icon: Package },
  { label: 'Pending Quotes', icon: Clock },
  { label: 'Workshop', icon: Wrench },
];

export default function DispatchPage() {
  const [activeTab, setActiveTab] = useState<TabId>('schedules');
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const staffMembers = mockProfiles.filter(p => p.role === 'Technician' || p.role === 'Dispatcher');

  const handleJobDoubleClick = (jobId: string) => {
    setSelectedJobId(jobId);
    setJobModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-7rem)] -m-6 mt-0">
        {/* ── Top Action Bar ── */}
        <div className="bg-white border-b border-light-gray shrink-0">
          <div className="flex items-center h-[72px] px-4">
            {/* Actions */}
            <div className="flex items-center gap-1 pr-5 border-r border-light-gray">
              <span className="text-[10px] text-mid-gray uppercase tracking-wider mr-2 font-medium">Actions</span>
              <Button
                onClick={() => { setSelectedJobId(undefined); setJobModalOpen(true); }}
                className="bg-solar-orange hover:bg-orange-light text-white gap-1.5 h-9 px-3 text-xs font-semibold shadow-sm shadow-solar-orange/20"
              >
                <Plus className="w-3.5 h-3.5" />
                New Job
              </Button>
            </div>

            {/* Queues */}
            <div className="flex items-center gap-4 px-5 border-r border-light-gray">
              <span className="text-[10px] text-mid-gray uppercase tracking-wider font-medium">Queues</span>
              {QUEUE_ACTIONS.map(q => {
                const Icon = q.icon;
                return (
                  <button
                    key={q.label}
                    onClick={() => setActiveTab('queues')}
                    className="flex flex-col items-center gap-1 px-2 py-1 rounded-lg hover:bg-off-white transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-off-white group-hover:bg-white border border-light-gray flex items-center justify-center transition-colors">
                      <Icon className="w-4 h-4 text-dark-gray" />
                    </div>
                    <span className="text-[10px] text-dark-gray font-medium whitespace-nowrap">{q.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Staff Members */}
            <div className="flex items-center gap-3 px-5 flex-1">
              <span className="text-[10px] text-mid-gray uppercase tracking-wider font-medium">Staff Members</span>
              <div className="flex items-center gap-2">
                {staffMembers.map(s => (
                  <div key={s.id} className="flex flex-col items-center gap-1">
                    <Avatar className="w-9 h-9 border-2 border-green-light/30">
                      <AvatarFallback className="bg-vision-green/10 text-green-dark text-xs font-semibold">
                        {s.full_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[10px] text-dark-gray font-medium truncate max-w-[60px]">
                      {s.full_name.split(' ')[0]}
                    </span>
                  </div>
                ))}
                <button className="flex flex-col items-center gap-1 px-2 py-1 rounded-lg hover:bg-off-white transition-colors">
                  <div className="w-9 h-9 rounded-lg border-2 border-dashed border-light-gray flex items-center justify-center">
                    <UserPlus className="w-4 h-4 text-mid-gray" />
                  </div>
                  <span className="text-[10px] text-mid-gray font-medium">Invite</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tab Bar ── */}
        <div className="bg-white border-b border-light-gray shrink-0 flex items-center px-4">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-all ${
                  isActive
                    ? 'border-vision-green text-vision-green'
                    : 'border-transparent text-dark-gray hover:text-charcoal hover:border-light-gray'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Main Content ── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left: Tab Content */}
          <div className="flex-1 min-w-0 overflow-auto">
            {activeTab === 'map' && <DispatchMap refreshKey={refreshKey} onNewJob={() => { setSelectedJobId(undefined); setJobModalOpen(true); }} />}
            {activeTab === 'tasks' && <TasksView refreshKey={refreshKey} onJobClick={handleJobDoubleClick} />}
            {activeTab === 'calendar' && <CalendarView refreshKey={refreshKey} />}
            {activeTab === 'schedules' && <StaffScheduleView refreshKey={refreshKey} onJobClick={handleJobDoubleClick} />}
            {activeTab === 'queues' && <QueuesView refreshKey={refreshKey} onJobClick={handleJobDoubleClick} />}
          </div>

          {/* Right: Jobs Panel (always visible) */}
          <JobsPanel onJobDoubleClick={handleJobDoubleClick} refreshKey={refreshKey} />
        </div>
      </div>

      <JobModal 
        open={jobModalOpen} 
        onOpenChange={setJobModalOpen} 
        jobId={selectedJobId} 
        onSuccess={handleRefresh}
      />
    </>
  );
}

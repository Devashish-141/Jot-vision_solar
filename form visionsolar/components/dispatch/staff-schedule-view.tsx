import { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { mockProfiles } from '@/lib/mock-data';
import { jobService } from '@/lib/supabase/service';
import type { Job } from '@/lib/types';

const TIME_SLOTS = [
  '7:00 am', '8:00 am', '9:00 am', '10:00 am', '11:00 am',
  '12:00 pm', '1:00 pm', '2:00 pm', '3:00 pm', '4:00 pm',
  '5:00 pm', '6:00 pm',
];

const VIEWS = ['Day', 'Week', '2 weeks', 'Month'] as const;

interface ScheduledBlock {
  jobId: string;
  staffId: string;
  slotIndex: number; // which time slot it starts at
  duration: number;  // how many slots it spans
}

interface StaffScheduleViewProps {
  onJobClick: (jobId: string) => void;
  refreshKey?: number;
}

export function StaffScheduleView({ onJobClick, refreshKey }: StaffScheduleViewProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<string>('Day');
  const [scheduledBlocks, setScheduledBlocks] = useState<ScheduledBlock[]>([]);
  const [dragOverCell, setDragOverCell] = useState<{ staffId: string; slotIndex: number } | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await jobService.fetchJobs();
        setJobs(data);
      } catch (error) {
        console.error('Failed to load schedule data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [refreshKey]);

  const staffMembers = mockProfiles.filter(p => p.role === 'Technician' || p.role === 'Dispatcher');

  const dateLabel = selectedDate.toLocaleDateString('en-AU', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const prevDay = () => setSelectedDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1));
  const nextDay = () => setSelectedDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1));
  const goToday = () => setSelectedDate(new Date());

  const handleDragOver = useCallback((e: React.DragEvent, staffId: string, slotIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCell({ staffId, slotIndex });
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverCell(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, staffId: string, slotIndex: number) => {
    e.preventDefault();
    setDragOverCell(null);

    const jobId = e.dataTransfer.getData('application/job-id');
    if (!jobId) return;

    // Find the job to determine duration
    const job = jobs.find(j => j.id === jobId);
    const duration = job?.estimated_hours ? Math.ceil(job.estimated_hours) : 2;

    // Remove any existing block for this job
    setScheduledBlocks(prev => {
      const filtered = prev.filter(b => b.jobId !== jobId);
      return [...filtered, { jobId, staffId, slotIndex, duration }];
    });
  }, []);

  const removeBlock = (jobId: string) => {
    setScheduledBlocks(prev => prev.filter(b => b.jobId !== jobId));
  };

  const getBlockForCell = (staffId: string, slotIndex: number): ScheduledBlock | undefined => {
    return scheduledBlocks.find(b =>
      b.staffId === staffId && b.slotIndex === slotIndex
    );
  };

  const isCellOccupied = (staffId: string, slotIndex: number): boolean => {
    return scheduledBlocks.some(b =>
      b.staffId === staffId &&
      slotIndex >= b.slotIndex &&
      slotIndex < b.slotIndex + b.duration
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-light-gray bg-white shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={goToday}
            className="text-xs text-mid-gray font-medium hover:text-charcoal px-2 py-1 rounded hover:bg-off-white transition-colors"
          >
            Today
          </button>
          <button onClick={prevDay} className="text-mid-gray hover:text-charcoal p-0.5 rounded hover:bg-off-white">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={nextDay} className="text-mid-gray hover:text-charcoal p-0.5 rounded hover:bg-off-white">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <span className="text-sm font-semibold text-charcoal">{dateLabel}</span>

        <div className="flex items-center bg-off-white rounded-md p-0.5 border border-light-gray">
          {VIEWS.map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-all ${
                view === v
                  ? 'bg-white text-charcoal shadow-sm'
                  : 'text-mid-gray hover:text-dark-gray'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full border-collapse min-w-[900px]">
          {/* Time header */}
          <thead className="sticky top-0 z-10 bg-white">
            <tr>
              <th className="w-[120px] min-w-[120px] px-3 py-2 text-left border-b border-r border-light-gray bg-off-white/70">
                <span className="text-[10px] text-mid-gray uppercase tracking-wider font-semibold">Staff</span>
              </th>
              {TIME_SLOTS.map((slot, i) => (
                <th
                  key={i}
                  className="min-w-[80px] px-2 py-2 text-center border-b border-r border-light-gray bg-off-white/70"
                >
                  <span className="text-[10px] text-mid-gray font-medium">{slot}</span>
                </th>
              ))}
            </tr>
          </thead>

          {/* Staff rows */}
          <tbody>
            {staffMembers.map(staff => (
              <tr key={staff.id} className="group/row">
                {/* Staff name cell */}
                <td className="px-3 py-3 border-b border-r border-light-gray bg-white sticky left-0 z-[5]">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-7 h-7 shrink-0">
                      <AvatarFallback className="bg-vision-green/10 text-green-dark text-[10px] font-semibold">
                        {staff.full_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-charcoal truncate">{staff.full_name}</span>
                  </div>
                </td>

                {/* Time slot cells */}
                {TIME_SLOTS.map((_, slotIndex) => {
                  const block = getBlockForCell(staff.id, slotIndex);
                  const occupied = !block && isCellOccupied(staff.id, slotIndex);
                  const isHovered = dragOverCell?.staffId === staff.id && dragOverCell?.slotIndex === slotIndex;

                  // If this cell is occupied by a block that starts earlier, skip rendering content
                  if (occupied) {
                    return null; // will be covered by colspan of the block
                  }

                  if (block) {
                    const job = jobs.find(j => j.id === block.jobId);
                    const isQuote = job && ['Quote', 'Quote Sent', 'Lead'].includes(job.status);
                    return (
                      <td
                        key={slotIndex}
                        colSpan={block.duration}
                        className="border-b border-r border-light-gray p-1"
                      >
                        <div
                          className={`relative rounded-md px-2.5 py-1.5 h-full min-h-[44px] cursor-pointer group/block transition-all
                            ${isQuote
                              ? 'bg-solar-orange/15 border border-solar-orange/30 hover:bg-solar-orange/25'
                              : 'bg-blue-50 border border-blue-200 hover:bg-blue-100'
                            }`}
                          onClick={() => onJobClick(block.jobId)}
                        >
                          <p className={`text-xs font-semibold truncate ${isQuote ? 'text-orange-dark' : 'text-blue-700'}`}>
                            {job?.client?.first_name} {job?.client?.last_name}
                          </p>
                          <p className={`text-[10px] truncate mt-0.5 ${isQuote ? 'text-solar-orange' : 'text-blue-500'}`}>
                            {job?.job_number} • {block.duration}h
                          </p>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeBlock(block.jobId); }}
                            className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover/block:opacity-100 transition-opacity shadow-sm hover:bg-red-50"
                          >
                            <X className="w-2.5 h-2.5 text-mid-gray hover:text-destructive" />
                          </button>
                        </div>
                      </td>
                    );
                  }

                  return (
                    <td
                      key={slotIndex}
                      className={`border-b border-r border-light-gray transition-colors min-h-[44px] ${
                        isHovered
                          ? 'bg-vision-green/10 ring-2 ring-inset ring-vision-green/30'
                          : 'hover:bg-off-white/50'
                      }`}
                      onDragOver={(e) => handleDragOver(e, staff.id, slotIndex)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, staff.id, slotIndex)}
                    >
                      <div className="min-h-[44px]" />
                    </td>
                  );
                })}
              </tr>
            ))}

            {staffMembers.length === 0 && (
              <tr>
                <td colSpan={TIME_SLOTS.length + 1} className="text-center py-16">
                  <p className="text-sm text-mid-gray">No staff members found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Drop hint */}
      <div className="bg-off-white border-t border-light-gray px-4 py-2 shrink-0">
        <p className="text-[10px] text-mid-gray text-center">
          Drag jobs from the Jobs panel and drop them on a staff member&apos;s time slot to schedule
        </p>
      </div>
    </div>
  );
}

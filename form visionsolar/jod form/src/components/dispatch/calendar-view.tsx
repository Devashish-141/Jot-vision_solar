'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VIEWS = ['Day', 'Week', '2 Weeks', 'Month'] as const;
type ViewType = (typeof VIEWS)[number];

const HOURS = Array.from({ length: 12 }, (_, i) => i + 7); // 7am to 6pm

const DAYS_OF_WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function MiniCalendar({ selectedDate, onSelect }: { selectedDate: Date; onSelect: (d: Date) => void }) {
  const [viewMonth, setViewMonth] = useState(new Date(selectedDate));

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const prevMonth = () => setViewMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setViewMonth(new Date(year, month + 1, 1));

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const monthName = viewMonth.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <button onClick={prevMonth} className="text-mid-gray hover:text-charcoal p-1">
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <span className="text-xs font-semibold text-charcoal">{monthName}</span>
        <button onClick={nextMonth} className="text-mid-gray hover:text-charcoal p-1">
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-[10px]">
        {DAYS_OF_WEEK.map((d, i) => (
          <div key={i} className="text-mid-gray font-medium py-1">{d}</div>
        ))}
        {days.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />;
          const date = new Date(year, month, day);
          const isToday = date.toDateString() === today.toDateString();
          const isSelected = date.toDateString() === selectedDate.toDateString();
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          return (
            <button
              key={day}
              onClick={() => onSelect(date)}
              className={`py-1 rounded-md text-[10px] transition-all ${
                isSelected ? 'bg-vision-green text-white font-bold'
                : isToday ? 'bg-solar-orange/20 text-solar-orange font-bold ring-1 ring-solar-orange'
                : isWeekend ? 'text-mid-gray hover:bg-off-white'
                : 'text-charcoal hover:bg-off-white'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
      <button
        onClick={() => onSelect(new Date())}
        className="w-full text-center text-xs text-vision-green font-medium mt-2 hover:underline"
      >
        Today
      </button>
    </div>
  );
}

export function CalendarView() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('Day');

  const dayLabel = selectedDate.toLocaleDateString('en-AU', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const prevDay = () => setSelectedDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1));
  const nextDay = () => setSelectedDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1));

  return (
    <div className="h-full flex">
      {/* Mini Calendar Sidebar */}
      <div className="w-[180px] shrink-0 border-r border-light-gray bg-white p-3 space-y-4">
        <MiniCalendar selectedDate={selectedDate} onSelect={setSelectedDate} />
      </div>

      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Day Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-light-gray bg-white shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs text-mid-gray font-medium">Today</span>
            <button onClick={prevDay} className="text-mid-gray hover:text-charcoal p-0.5 rounded hover:bg-off-white">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={nextDay} className="text-mid-gray hover:text-charcoal p-0.5 rounded hover:bg-off-white">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="text-sm font-semibold text-solar-orange">{dayLabel} — Today</span>

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

        {/* Time Grid */}
        <div className="flex-1 overflow-y-auto bg-white">
          {HOURS.map(hour => {
            const label = hour > 12 ? `${hour - 12}pm` : hour === 12 ? '12pm' : `${hour}am`;
            return (
              <div key={hour} className="flex border-b border-light-gray/60 min-h-[60px]">
                <div className="w-16 shrink-0 pr-3 pt-1 text-right">
                  <span className="text-[10px] text-mid-gray font-medium">{label}</span>
                </div>
                <div className="flex-1 border-l border-light-gray/60 hover:bg-off-white/30 transition-colors" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

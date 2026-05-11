'use client';


import { Search, Calendar, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const DATE_RANGES = ['Today', 'Yesterday', 'Last 7 Days', 'This Month', 'Custom'] as const;
const STATUS_OPTIONS = ['Completed', 'Cancelled', 'Archived'] as const;

interface HistoryFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  dateRange: string;
  onDateRangeChange: (value: string) => void;
  statusFilter: string[];
  onStatusFilterChange: (value: string[]) => void;
}

export function HistoryFilters({
  search,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  statusFilter,
  onStatusFilterChange,
}: HistoryFiltersProps) {
  const toggleStatus = (status: string) => {
    if (statusFilter.includes(status)) {
      onStatusFilterChange(statusFilter.filter(s => s !== status));
    } else {
      onStatusFilterChange([...statusFilter, status]);
    }
  };

  const clearFilters = () => {
    onSearchChange('');
    onDateRangeChange('All');
    onStatusFilterChange([]);
  };

  const hasFilters = search || dateRange !== 'All' || statusFilter.length > 0;

  return (
    <div className="bg-white border border-light-gray rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mid-gray" />
          <Input
            id="history-search"
            placeholder="Search by Job #, Client, Address, or Inverter Serial..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-8 h-10 bg-off-white border-light-gray"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-mid-gray hover:text-charcoal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Date Range */}
        <Select value={dateRange} onValueChange={(v) => onDateRangeChange(v ?? 'All')}>
          <SelectTrigger className="w-44 h-10 bg-off-white border-light-gray">
            <Calendar className="w-4 h-4 text-mid-gray mr-2" />
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Time</SelectItem>
            {DATE_RANGES.map(range => (
              <SelectItem key={range} value={range}>{range}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Popover>
          <PopoverTrigger className="inline-flex items-center justify-center h-10 gap-2 px-4 rounded-md border border-light-gray bg-off-white text-sm font-medium whitespace-nowrap hover:bg-gray-100 transition-colors">
              <Filter className="w-4 h-4 text-mid-gray" />
              Status
              {statusFilter.length > 0 && (
                <Badge className="bg-vision-green text-white text-[10px] px-1.5 py-0 h-4 ml-1">
                  {statusFilter.length}
                </Badge>
              )}
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="end">
            {STATUS_OPTIONS.map(status => (
              <button
                key={status}
                onClick={() => toggleStatus(status)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  statusFilter.includes(status) ? 'bg-accent text-green-dark' : 'hover:bg-off-white text-dark-gray'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded border ${
                  statusFilter.includes(status) ? 'bg-vision-green border-vision-green' : 'border-light-gray'
                } flex items-center justify-center`}>
                  {statusFilter.includes(status) && (
                    <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="2,6 5,9 10,3" />
                    </svg>
                  )}
                </div>
                {status}
              </button>
            ))}
          </PopoverContent>
        </Popover>

        {/* Clear Filters */}
        {hasFilters && (
          <button onClick={clearFilters} className="inline-flex items-center h-10 px-3 text-sm text-mid-gray hover:text-charcoal rounded-md hover:bg-off-white transition-colors">
            <X className="w-4 h-4 mr-1" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

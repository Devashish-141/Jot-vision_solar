'use client';

import { useRouter } from 'next/navigation';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockStaffLocations } from '@/lib/mock-data';

export function MapPreview() {
  const router = useRouter();

  return (
    <Card
      className="border-light-gray card-hover cursor-pointer group overflow-hidden"
      onClick={() => router.push('/dispatch')}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-charcoal">Live Team Map</CardTitle>
          <span className="text-xs text-mid-gray flex items-center gap-1 group-hover:text-vision-green transition-colors">
            Open Dispatch Board
            <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        {/* Map placeholder styled as a map card */}
        <div className="relative h-52 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 overflow-hidden">
          {/* Grid lines to simulate map */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" className="text-vision-green">
              {Array.from({ length: 8 }).map((_, i) => (
                <line
                  key={`h${i}`}
                  x1="0" y1={`${12.5 * (i + 1)}%`}
                  x2="100%" y2={`${12.5 * (i + 1)}%`}
                  stroke="currentColor" strokeWidth="0.5"
                />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <line
                  key={`v${i}`}
                  x1={`${10 * (i + 1)}%`} y1="0"
                  x2={`${10 * (i + 1)}%`} y2="100%"
                  stroke="currentColor" strokeWidth="0.5"
                />
              ))}
            </svg>
          </div>

          {/* Staff pins */}
          {mockStaffLocations.map((loc, i) => {
            const positions = [
              { left: '35%', top: '40%' },
              { left: '60%', top: '55%' },
              { left: '45%', top: '25%' },
            ];
            const pos = positions[i % positions.length];
            const colors = ['bg-vision-green', 'bg-solar-orange', 'bg-blue-500'];

            return (
              <div
                key={loc.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: pos.left, top: pos.top }}
              >
                <div className="relative">
                  <div className={`w-3 h-3 rounded-full ${colors[i % colors.length]} animate-pulse-dot`} />
                  <div className={`absolute inset-0 w-3 h-3 rounded-full ${colors[i % colors.length]} opacity-30 animate-ping`} />
                </div>
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-md shadow-sm px-2 py-0.5 whitespace-nowrap">
                  <p className="text-[10px] font-medium text-charcoal">{loc.profile?.full_name.split(' ')[0]}</p>
                </div>
              </div>
            );
          })}

          {/* Melbourne label */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm rounded-md px-2 py-1">
            <Navigation className="w-3 h-3 text-vision-green" />
            <span className="text-xs font-medium text-charcoal">Melbourne, VIC</span>
          </div>

          {/* Staff count */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm rounded-md px-2 py-1">
            <MapPin className="w-3 h-3 text-solar-orange" />
            <span className="text-xs font-medium text-charcoal">{mockStaffLocations.length} active</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

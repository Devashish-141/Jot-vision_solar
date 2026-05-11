'use client';

import { Clock, User } from 'lucide-react';
import { mockSavedVersions } from '@/lib/mock-data';

export function SavedTab() {
  const versions = mockSavedVersions;

  return (
    <div className="p-6 space-y-4">
      <div>
        <label className="text-sm font-medium text-charcoal">Version History</label>
        <p className="text-xs text-mid-gray mt-0.5">All saved versions and changes</p>
      </div>

      <div className="space-y-0">
        {versions.map((version, index) => {
          const date = new Date(version.created_at);
          const formattedDate = date.toLocaleDateString('en-AU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
          const formattedTime = date.toLocaleTimeString('en-AU', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });

          return (
            <div key={version.id} className="relative flex gap-4 pb-6">
              {/* Timeline line */}
              {index < versions.length - 1 && (
                <div className="absolute left-[15px] top-8 bottom-0 w-px bg-light-gray" />
              )}

              {/* Timeline dot */}
              <div className="relative shrink-0 mt-1">
                <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center ${
                  index === 0
                    ? 'bg-vision-green/15 text-vision-green'
                    : 'bg-off-white text-mid-gray'
                }`}>
                  <Clock className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-sm font-medium text-charcoal">{version.action}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-mid-gray">
                  <span>{formattedDate} {formattedTime}</span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {version.user_name}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {versions.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-8 h-8 text-light-gray mx-auto mb-3" />
          <p className="text-sm text-mid-gray">No saved versions yet</p>
          <p className="text-xs text-mid-gray mt-1">Changes will appear here once the job is saved</p>
        </div>
      )}
    </div>
  );
}

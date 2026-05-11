'use client';

import { Clock, User, ArrowRight, FileText, CheckCircle, Send, PlusCircle } from 'lucide-react';
import { mockAuditLogs } from '@/lib/mock-data';

const actionIcons: Record<string, React.ReactNode> = {
  status_change: <ArrowRight className="w-3.5 h-3.5" />,
  assigned: <User className="w-3.5 h-3.5" />,
  completed: <CheckCircle className="w-3.5 h-3.5" />,
  created: <PlusCircle className="w-3.5 h-3.5" />,
  quote_sent: <Send className="w-3.5 h-3.5" />,
};

const actionColors: Record<string, string> = {
  status_change: 'bg-blue-100 text-blue-600',
  assigned: 'bg-purple-100 text-purple-600',
  completed: 'bg-vision-green/15 text-green-dark',
  created: 'bg-solar-orange/15 text-orange-dark',
  quote_sent: 'bg-cyan-100 text-cyan-600',
};

export function AuditLog() {
  return (
    <div className="space-y-0">
      {mockAuditLogs.map((log, index) => {
        const date = new Date(log.created_at);
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
          <div key={log.id} className="relative flex gap-4 pb-5 px-4">
            {/* Timeline line */}
            {index < mockAuditLogs.length - 1 && (
              <div className="absolute left-[31px] top-9 bottom-0 w-px bg-light-gray" />
            )}

            {/* Icon */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
              actionColors[log.action] || 'bg-gray-100 text-mid-gray'
            }`}>
              {actionIcons[log.action] || <FileText className="w-3.5 h-3.5" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-charcoal">
                <span className="font-medium">{log.user_name}</span>
                {' '}
                <span className="text-dark-gray">{log.details}</span>
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-3 h-3 text-mid-gray" />
                <span className="text-xs text-mid-gray">{formattedDate} {formattedTime}</span>
              </div>
            </div>
          </div>
        );
      })}

      {mockAuditLogs.length === 0 && (
        <div className="text-center py-12 px-4">
          <Clock className="w-8 h-8 text-light-gray mx-auto mb-3" />
          <p className="text-sm text-mid-gray">No activity recorded yet</p>
        </div>
      )}
    </div>
  );
}

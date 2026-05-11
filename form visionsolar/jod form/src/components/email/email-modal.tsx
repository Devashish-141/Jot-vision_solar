'use client';

import { useState } from 'react';
import { Send, Paperclip, X, FileText, Image, Music } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE_MB } from '@/lib/constants';
import { toast } from 'sonner';

interface EmailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  to?: string;
  subject?: string;
  jobNumber?: string;
  clientName?: string;
}

interface Attachment {
  name: string;
  type: string;
  size: number;
}

export function EmailModal({ open, onOpenChange, to = '', subject = '', jobNumber, clientName }: EmailModalProps) {
  const defaultSubject = subject || `VisionSolar Quote #${jobNumber || '0000'} for ${clientName || 'Client'}`;

  const [emailTo, setEmailTo] = useState(to);
  const [emailSubject, setEmailSubject] = useState(defaultSubject);
  const [emailBody, setEmailBody] = useState(
    `Hi ${clientName || 'there'},\n\nPlease find your quote attached. You can also view it online at the link below:\n\n{{quote_link}}\n\nIf you have any questions, please don't hesitate to reach out.\n\nKind regards,\nVisionSolar Team`
  );
  const [attachments, setAttachments] = useState<Attachment[]>([
    { name: `Quote_${jobNumber || 'VS-0000'}.pdf`, type: 'application/pdf', size: 245000 },
  ]);
  const [sending, setSending] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(file.type as typeof ALLOWED_FILE_TYPES[number])) {
        toast.error('Invalid file type', {
          description: 'Only PDF, Image (PNG, JPG), and Audio (MP3, WAV) files are allowed.',
        });
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error('File too large', {
          description: `Maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
        });
        return;
      }

      setAttachments(prev => [...prev, {
        name: file.name,
        type: file.type,
        size: file.size,
      }]);
    });
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!emailTo) {
      toast.error('Please enter a recipient email address');
      return;
    }
    setSending(true);
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSending(false);
    toast.success('Email sent successfully!', {
      description: `Quote sent to ${emailTo}`,
    });
    onOpenChange(false);
  };

  const fileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4 text-blue-500" />;
    if (type.startsWith('audio/')) return <Music className="w-4 h-4 text-purple-500" />;
    return <FileText className="w-4 h-4 text-solar-orange" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-light-gray">
          <DialogTitle className="text-lg font-semibold text-charcoal">Send Email</DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {/* To */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-mid-gray uppercase tracking-wider">To</label>
            <Input
              id="email-to"
              type="email"
              value={emailTo}
              onChange={(e) => setEmailTo(e.target.value)}
              className="h-10 bg-off-white border-light-gray"
              placeholder="recipient@email.com"
            />
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-mid-gray uppercase tracking-wider">Subject</label>
            <Input
              id="email-subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="h-10 bg-off-white border-light-gray"
            />
          </div>

          {/* Body */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-mid-gray uppercase tracking-wider">Body</label>
            <Textarea
              id="email-body"
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              className="min-h-40 bg-off-white border-light-gray resize-none text-sm"
            />
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-mid-gray uppercase tracking-wider">Attachments</label>
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg,.mp3,.wav"
                  onChange={handleFileUpload}
                />
                <span className="text-xs text-vision-green hover:text-green-dark font-medium flex items-center gap-1 transition-colors">
                  <Paperclip className="w-3 h-3" />
                  Attach File
                </span>
              </label>
            </div>

            {attachments.length > 0 && (
              <div className="space-y-1.5">
                {attachments.map((att, i) => (
                  <div key={i} className="flex items-center gap-2 bg-off-white rounded-lg px-3 py-2">
                    {fileIcon(att.type)}
                    <span className="text-sm text-charcoal flex-1 truncate">{att.name}</span>
                    <Badge variant="secondary" className="text-[10px] bg-white text-mid-gray">
                      {formatSize(att.size)}
                    </Badge>
                    <button
                      onClick={() => removeAttachment(i)}
                      className="text-mid-gray hover:text-destructive transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-light-gray flex items-center justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-light-gray">
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={sending}
            className="bg-solar-orange hover:bg-orange-light text-white gap-2 shadow-md shadow-solar-orange/20"
          >
            {sending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Email
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

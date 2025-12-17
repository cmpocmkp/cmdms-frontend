/**
 * Tracker Modal - Add/Edit Tracker
 * Matches old CMDMS admin/interventions/partials/intervention-modal.blade.php
 */

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tracker } from '../../lib/mocks/data/trackers';

interface TrackerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tracker: Tracker | null;
  onSave: (trackerData: { title: string; description: string; attachments: File[] }) => void;
}

export function TrackerModal({ open, onOpenChange, tracker, onSave }: TrackerModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attachmentFiles, setAttachmentFiles] = useState<FileList | null>(null);

  useEffect(() => {
    if (open) {
      if (tracker) {
        // Edit mode - populate form with tracker data
        setTitle(tracker.title);
        setDescription(tracker.description);
        setAttachmentFiles(null);
      } else {
        // Add mode - reset form
        setTitle('');
        setDescription('');
        setAttachmentFiles(null);
      }
    }
  }, [tracker, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const files = attachmentFiles ? Array.from(attachmentFiles) : [];
    
    onSave({
      title,
      description,
      attachments: files
    });
    
    // Reset form
    setTitle('');
    setDescription('');
    setAttachmentFiles(null);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setAttachmentFiles(null);
    onOpenChange(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachmentFiles(e.target.files);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{tracker ? 'Edit Tracker' : 'Add Tracker'}</DialogTitle>
          <DialogDescription>
            {tracker ? 'Update tracker information' : 'Create a new tracker'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Tracker title"
                required
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                className="w-full min-h-[100px] p-2 border border-gray-300 rounded-md"
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="attachments">Attachments</Label>
              <Input
                id="attachments"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.png"
                onChange={handleFileChange}
                className="w-full"
              />
              <p className="text-sm text-gray-500">
                Accepted formats: PDF, DOC, DOCX, JPG, PNG
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="default">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

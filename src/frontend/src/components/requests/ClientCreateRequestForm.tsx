import { useState } from 'react';
import { useCreateRequest } from '../../hooks/useRequests';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ClientCreateRequestFormProps {
  open: boolean;
  onClose: () => void;
}

export default function ClientCreateRequestForm({ open, onClose }: ClientCreateRequestFormProps) {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [deadline, setDeadline] = useState('');
  const createRequest = useCreateRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !details.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createRequest.mutateAsync({
        title: title.trim(),
        details: details.trim(),
        deadline: deadline ? new Date(deadline).getTime() * 1000000 : null,
      });

      toast.success('Request created successfully');
      setTitle('');
      setDetails('');
      setDeadline('');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create request');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Buat Permintaan Baru</DialogTitle>
          <DialogDescription>
            Fill in the details for your service request
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Permintaan *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter request title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Detail Permintaan *</Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe your request in detail"
              rows={5}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline Permintaan (Optional)</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createRequest.isPending}>
              {createRequest.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Kirim Permintaan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

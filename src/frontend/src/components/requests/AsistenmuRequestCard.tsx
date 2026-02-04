import { useState } from 'react';
import { useUpdateRequestStatus } from '../../hooks/useRequests';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AsistenmuRequestCardProps {
  request: any;
}

export default function AsistenmuRequestCard({ request }: AsistenmuRequestCardProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [reviewLink, setReviewLink] = useState('');
  const updateStatus = useUpdateRequestStatus();

  const isCompleted = request.status.__kind__ === 'completed';

  const handleStatusChange = async (value: string) => {
    setSelectedStatus(value);

    if (value === 'inProgress') {
      try {
        await updateStatus.mutateAsync({
          requestId: request.id,
          status: { __kind__: 'inProgress', inProgress: null },
        });
        toast.success('Status updated to In Progress');
        setSelectedStatus('');
      } catch (error: any) {
        toast.error(error.message || 'Failed to update status');
      }
    }
  };

  const handleRequestReview = async () => {
    if (!reviewLink.trim()) {
      toast.error('Please provide a review link');
      return;
    }

    try {
      await updateStatus.mutateAsync({
        requestId: request.id,
        status: { 
          __kind__: 'clientReviewPending', 
          clientReviewPending: { reviewLink: reviewLink.trim() } 
        },
      });
      toast.success('Review request sent to client');
      setSelectedStatus('');
      setReviewLink('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to request review');
    }
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <div className="space-y-2">
        <h3 className="font-semibold">{request.title}</h3>
        <p className="text-sm text-muted-foreground">{request.details}</p>
        {request.deadline && (
          <p className="text-xs text-muted-foreground">
            Deadline: {new Date(Number(request.deadline) / 1000000).toLocaleDateString()}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Created: {new Date(Number(request.createdAt) / 1000000).toLocaleDateString()}
        </p>
      </div>

      {!isCompleted && (
        <div className="space-y-3 pt-3 border-t">
          <div className="space-y-2">
            <Label>Update Status</Label>
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inProgress">Dalam Proses Pengerjaan</SelectItem>
                <SelectItem value="requestReview">Meminta Review Client</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedStatus === 'requestReview' && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="reviewLink">Google Drive Link (Optional)</Label>
                <Input
                  id="reviewLink"
                  type="url"
                  value={reviewLink}
                  onChange={(e) => setReviewLink(e.target.value)}
                  placeholder="https://drive.google.com/..."
                />
              </div>
              <Button
                onClick={handleRequestReview}
                disabled={updateStatus.isPending}
                className="w-full"
              >
                {updateStatus.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Send Review Request
              </Button>
            </div>
          )}
        </div>
      )}

      {isCompleted && (
        <div className="pt-3 border-t">
          <p className="text-sm text-green-600 font-medium">✓ Request Completed</p>
        </div>
      )}
    </div>
  );
}

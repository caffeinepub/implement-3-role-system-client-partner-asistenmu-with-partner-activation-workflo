import { useState } from 'react';
import { useRequestRevision, useCompleteRequest } from '../../hooks/useRequests';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface ClientReviewActionsProps {
  requestId: bigint;
}

export default function ClientReviewActions({ requestId }: ClientReviewActionsProps) {
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [revisionDetails, setRevisionDetails] = useState('');
  const requestRevision = useRequestRevision();
  const completeRequest = useCompleteRequest();

  const handleRequestRevision = async () => {
    if (!revisionDetails.trim()) {
      toast.error('Please provide revision details');
      return;
    }

    try {
      await requestRevision.mutateAsync({
        requestId,
        revisionDetails: revisionDetails.trim(),
      });
      toast.success('Revision request submitted');
      setRevisionDetails('');
      setShowRevisionForm(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to request revision');
    }
  };

  const handleComplete = async () => {
    try {
      await completeRequest.mutateAsync(requestId);
      toast.success('Request marked as completed');
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete request');
    }
  };

  return (
    <div className="space-y-3 pt-2 border-t">
      {!showRevisionForm ? (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRevisionForm(true)}
            className="flex-1"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Meminta Revisi
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" className="flex-1">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Selesai
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Completion</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to mark this request as completed? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleComplete} disabled={completeRequest.isPending}>
                  {completeRequest.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Yes, Complete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="revisionDetails">Detail Revisi *</Label>
            <Textarea
              id="revisionDetails"
              value={revisionDetails}
              onChange={(e) => setRevisionDetails(e.target.value)}
              placeholder="Describe what needs to be revised"
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowRevisionForm(false);
                setRevisionDetails('');
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleRequestRevision}
              disabled={!revisionDetails.trim() || requestRevision.isPending}
              className="flex-1"
            >
              {requestRevision.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Kirim Permintaan Revisi
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

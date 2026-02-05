import { useState } from 'react';
import { useGetAsistenmuRequests, useRequestRevision, useCompleteTask } from '../../hooks/useRequests';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function AsistenmuQARequestsTab() {
  const { data: requests, isLoading } = useGetAsistenmuRequests();
  const revisionMutation = useRequestRevision();
  const completeMutation = useCompleteTask();

  const [revisionRequestId, setRevisionRequestId] = useState<bigint | null>(null);
  const [revisionDetails, setRevisionDetails] = useState('');
  const [completeRequestId, setCompleteRequestId] = useState<bigint | null>(null);
  const [finalReport, setFinalReport] = useState('');

  const qaRequests = requests?.filter(
    (req) => req.status.__kind__ === 'qaRequestedByPartner'
  ) || [];

  const handleRevision = async () => {
    if (!revisionRequestId) return;
    if (!revisionDetails.trim()) {
      toast.error('Masukkan detail revisi');
      return;
    }

    try {
      await revisionMutation.mutateAsync({
        requestId: revisionRequestId,
        revisionDetails,
      });
      toast.success('Permintaan revisi berhasil dikirim');
      setRevisionRequestId(null);
      setRevisionDetails('');
    } catch (error) {
      toast.error('Gagal mengirim permintaan revisi');
      console.error(error);
    }
  };

  const handleComplete = async () => {
    if (!completeRequestId) return;

    try {
      await completeMutation.mutateAsync({
        requestId: completeRequestId,
        finalReport: finalReport || 'Pekerjaan selesai dan disetujui',
      });
      toast.success('Pekerjaan berhasil diselesaikan');
      setCompleteRequestId(null);
      setFinalReport('');
    } catch (error) {
      toast.error('Gagal menyelesaikan pekerjaan');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Permintaan QA Pekerjaan ({qaRequests.length})</CardTitle>
          <CardDescription>Partner meminta review dan persetujuan pekerjaan</CardDescription>
        </CardHeader>
        <CardContent>
          {qaRequests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Tidak ada permintaan QA
            </div>
          ) : (
            <div className="space-y-4">
              {qaRequests.map((request) => (
                <div key={request.id.toString()} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">#{request.id.toString()} - {request.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{request.details}</p>
                    </div>
                    <Badge>QA Request</Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRevisionRequestId(request.id)}
                      disabled={revisionMutation.isPending}
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Revisi
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setCompleteRequestId(request.id)}
                      disabled={completeMutation.isPending}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Selesai
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revision Dialog */}
      <AlertDialog open={!!revisionRequestId} onOpenChange={(open) => !open && setRevisionRequestId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Minta Revisi</AlertDialogTitle>
            <AlertDialogDescription>
              Jelaskan detail revisi yang diperlukan
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Detail revisi..."
            value={revisionDetails}
            onChange={(e) => setRevisionDetails(e.target.value)}
            rows={4}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleRevision} disabled={revisionMutation.isPending}>
              {revisionMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Mengirim...
                </>
              ) : (
                'Kirim Revisi'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Complete Dialog */}
      <AlertDialog open={!!completeRequestId} onOpenChange={(open) => !open && setCompleteRequestId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Selesaikan Pekerjaan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin pekerjaan ini sudah selesai dan memenuhi standar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Catatan akhir (opsional)..."
            value={finalReport}
            onChange={(e) => setFinalReport(e.target.value)}
            rows={3}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleComplete} disabled={completeMutation.isPending}>
              {completeMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                'Selesaikan'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

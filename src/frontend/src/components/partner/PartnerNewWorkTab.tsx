import { useGetPartnerRequests, useAcceptOffer, useRejectOffer } from '../../hooks/useRequests';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Clock, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';

export default function PartnerNewWorkTab() {
  const { data: requests, isLoading } = useGetPartnerRequests();
  const acceptMutation = useAcceptOffer();
  const rejectMutation = useRejectOffer();

  const [rejectRequestId, setRejectRequestId] = useState<bigint | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const newWorkRequests = requests?.filter(
    (req) => req.status.__kind__ === 'offerSentToPartner'
  ) || [];

  const handleAccept = async (requestId: bigint) => {
    try {
      await acceptMutation.mutateAsync(requestId);
      toast.success('Pekerjaan berhasil diterima');
    } catch (error) {
      toast.error('Gagal menerima pekerjaan');
      console.error(error);
    }
  };

  const handleReject = async () => {
    if (!rejectRequestId) return;
    if (!rejectReason.trim()) {
      toast.error('Masukkan alasan penolakan');
      return;
    }

    try {
      await rejectMutation.mutateAsync({
        requestId: rejectRequestId,
        reason: rejectReason,
      });
      toast.success('Pekerjaan ditolak');
      setRejectRequestId(null);
      setRejectReason('');
    } catch (error) {
      toast.error('Gagal menolak pekerjaan');
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
          <CardTitle>Pekerjaan Baru Tersedia ({newWorkRequests.length})</CardTitle>
          <CardDescription>Tawaran pekerjaan dari Asistenmu</CardDescription>
        </CardHeader>
        <CardContent>
          {newWorkRequests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Tidak ada pekerjaan baru
            </div>
          ) : (
            <div className="space-y-4">
              {newWorkRequests.map((request) => {
                const offerData = request.status.__kind__ === 'offerSentToPartner'
                  ? request.status.offerSentToPartner
                  : null;

                return (
                  <div key={request.id.toString()} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">#{request.id.toString()} - {request.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{request.details}</p>
                      </div>
                      <Badge>Tawaran Baru</Badge>
                    </div>

                    {offerData && (
                      <div className="bg-accent rounded p-3 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Briefcase className="w-4 h-4" />
                          <span className="font-medium">Briefing:</span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{offerData.workBriefing}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          Jam Efektif: {Number(offerData.effectiveHours)} jam
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAccept(request.id)}
                        disabled={acceptMutation.isPending}
                      >
                        {acceptMutation.isPending ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        )}
                        Terima
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setRejectRequestId(request.id)}
                        disabled={rejectMutation.isPending}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Tolak
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <AlertDialog open={!!rejectRequestId} onOpenChange={(open) => !open && setRejectRequestId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tolak Pekerjaan</AlertDialogTitle>
            <AlertDialogDescription>
              Jelaskan alasan Anda menolak pekerjaan ini
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Alasan penolakan..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} disabled={rejectMutation.isPending}>
              {rejectMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Mengirim...
                </>
              ) : (
                'Tolak Pekerjaan'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

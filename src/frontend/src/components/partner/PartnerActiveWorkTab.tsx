import { useGetPartnerRequests, useRequestQA } from '../../hooks/useRequests';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function PartnerActiveWorkTab() {
  const { data: requests, isLoading } = useGetPartnerRequests();
  const qaRequestMutation = useRequestQA();

  const activeRequests = requests?.filter(
    (req) => req.status.__kind__ === 'inProgressByPartner'
  ) || [];

  const handleRequestQA = async (requestId: bigint) => {
    try {
      await qaRequestMutation.mutateAsync(requestId);
      toast.success('Permintaan QA berhasil dikirim');
    } catch (error) {
      toast.error('Gagal mengirim permintaan QA');
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
    <Card>
      <CardHeader>
        <CardTitle>Pekerjaan Aktif ({activeRequests.length})</CardTitle>
        <CardDescription>Pekerjaan yang sedang Anda kerjakan</CardDescription>
      </CardHeader>
      <CardContent>
        {activeRequests.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Tidak ada pekerjaan aktif
          </div>
        ) : (
          <div className="space-y-4">
            {activeRequests.map((request) => (
              <div key={request.id.toString()} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">#{request.id.toString()} - {request.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{request.details}</p>
                  </div>
                  <Badge variant="outline">Aktif</Badge>
                </div>

                <Button
                  size="sm"
                  onClick={() => handleRequestQA(request.id)}
                  disabled={qaRequestMutation.isPending}
                >
                  {qaRequestMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Meminta QA Asistenmu
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

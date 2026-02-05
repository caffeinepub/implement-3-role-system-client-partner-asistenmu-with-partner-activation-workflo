import { useGetAsistenmuRequests } from '../../hooks/useRequests';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, XCircle } from 'lucide-react';

export default function AsistenmuRejectedTab() {
  const { data: requests, isLoading } = useGetAsistenmuRequests();

  const rejectedRequests = requests?.filter(
    (req) => req.status.__kind__ === 'rejectedByPartner'
  ) || [];

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
        <CardTitle>Partner Menolak Tugas ({rejectedRequests.length})</CardTitle>
        <CardDescription>Tugas yang ditolak oleh partner</CardDescription>
      </CardHeader>
      <CardContent>
        {rejectedRequests.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Tidak ada tugas yang ditolak
          </div>
        ) : (
          <div className="space-y-4">
            {rejectedRequests.map((request) => {
              const rejectionData = request.status.__kind__ === 'rejectedByPartner'
                ? request.status.rejectedByPartner
                : null;

              return (
                <div key={request.id.toString()} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">#{request.id.toString()} - {request.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{request.details}</p>
                    </div>
                    <Badge variant="destructive">
                      <XCircle className="w-3 h-3 mr-1" />
                      Ditolak
                    </Badge>
                  </div>
                  {rejectionData && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded p-3">
                      <div className="text-sm font-medium text-destructive mb-1">Alasan Penolakan:</div>
                      <div className="text-sm">{rejectionData.revisionByPartner}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

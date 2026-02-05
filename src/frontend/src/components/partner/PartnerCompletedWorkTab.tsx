import { useGetPartnerRequests } from '../../hooks/useRequests';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle } from 'lucide-react';

export default function PartnerCompletedWorkTab() {
  const { data: requests, isLoading } = useGetPartnerRequests();

  const completedRequests = requests?.filter(
    (req) => req.status.__kind__ === 'completedBYPartnerAndAsistenmu'
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
        <CardTitle>Pekerjaan Selesai ({completedRequests.length})</CardTitle>
        <CardDescription>Pekerjaan yang telah diselesaikan dan disetujui</CardDescription>
      </CardHeader>
      <CardContent>
        {completedRequests.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Belum ada pekerjaan yang selesai
          </div>
        ) : (
          <div className="space-y-4">
            {completedRequests.map((request) => {
              const completionData = request.status.__kind__ === 'completedBYPartnerAndAsistenmu'
                ? request.status.completedBYPartnerAndAsistenmu
                : null;

              return (
                <div key={request.id.toString()} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">#{request.id.toString()} - {request.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{request.details}</p>
                    </div>
                    <Badge className="bg-green-500">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Selesai
                    </Badge>
                  </div>
                  {completionData && completionData.finalReport && (
                    <div className="bg-accent rounded p-3">
                      <div className="text-sm font-medium mb-1">Laporan Akhir:</div>
                      <div className="text-sm text-muted-foreground">{completionData.finalReport}</div>
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

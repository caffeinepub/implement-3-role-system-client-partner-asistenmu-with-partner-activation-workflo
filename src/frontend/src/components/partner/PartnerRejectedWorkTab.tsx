import { useGetPartnerRequests, useGetPartnerProfile } from '../../hooks/useRequests';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, XCircle, TrendingDown } from 'lucide-react';

export default function PartnerRejectedWorkTab() {
  const { data: requests, isLoading: requestsLoading } = useGetPartnerRequests();
  const { data: profile, isLoading: profileLoading } = useGetPartnerProfile();

  const rejectedRequests = requests?.filter(
    (req) => req.recordStatus === 'rejected'
  ) || [];

  if (requestsLoading || profileLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Rejection Stats Card */}
      {profile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              Statistik Penolakan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">
              {Number(profile.rejectedTasks)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Total pekerjaan yang ditolak
            </p>
          </CardContent>
        </Card>
      )}

      {/* Rejected Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle>Pekerjaan yang Ditolak ({rejectedRequests.length})</CardTitle>
          <CardDescription>Riwayat pekerjaan yang Anda tolak</CardDescription>
        </CardHeader>
        <CardContent>
          {rejectedRequests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Tidak ada pekerjaan yang ditolak
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
    </div>
  );
}

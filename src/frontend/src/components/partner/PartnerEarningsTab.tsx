import { useGetPartnerRequests, useGetPartnerProfile } from '../../hooks/useRequests';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, DollarSign, TrendingUp } from 'lucide-react';

export default function PartnerEarningsTab() {
  const { data: requests, isLoading: requestsLoading } = useGetPartnerRequests();
  const { data: profile, isLoading: profileLoading } = useGetPartnerProfile();

  const completedRequests = requests?.filter(
    (req) => req.status.__kind__ === 'completedBYPartnerAndAsistenmu'
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
      {/* Earnings Summary Card */}
      {profile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Total Pendapatan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              Rp {Number(profile.pendingEarnings).toLocaleString('id-ID')}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Dari {Number(profile.completedTasks)} pekerjaan selesai
            </p>
            <div className="mt-4 p-3 bg-accent rounded-lg">
              <div className="text-sm text-muted-foreground">Rate per jam:</div>
              <div className="text-lg font-semibold">
                Rp {Number(profile.hourlyRate).toLocaleString('id-ID')}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Tasks with Earnings */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Pendapatan ({completedRequests.length})</CardTitle>
          <CardDescription>Detail pendapatan dari setiap pekerjaan yang diselesaikan</CardDescription>
        </CardHeader>
        <CardContent>
          {completedRequests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Belum ada pendapatan
            </div>
          ) : (
            <div className="space-y-4">
              {completedRequests.map((request) => (
                <div key={request.id.toString()} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">#{request.id.toString()} - {request.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{request.details}</p>
                    </div>
                    <Badge className="bg-green-500">Selesai</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span className="font-medium">
                      Pendapatan tersimpan saat penyelesaian
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Selesai: {new Date(Number(request.updatedAt) / 1_000_000).toLocaleDateString('id-ID')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

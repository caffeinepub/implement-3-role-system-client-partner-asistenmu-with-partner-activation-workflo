import { useGetPartnerRequests } from '../../hooks/useRequests';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle } from 'lucide-react';

export default function PartnerRevisionRequestsTab() {
  const { data: requests, isLoading } = useGetPartnerRequests();

  const revisionRequests = requests?.filter(
    (req) => req.status.__kind__ === 'revisionRequestedByAsistenmu'
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
        <CardTitle>Permintaan Revisi ({revisionRequests.length})</CardTitle>
        <CardDescription>Pekerjaan yang memerlukan revisi dari Asistenmu</CardDescription>
      </CardHeader>
      <CardContent>
        {revisionRequests.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Tidak ada permintaan revisi
          </div>
        ) : (
          <div className="space-y-4">
            {revisionRequests.map((request) => {
              const revisionData = request.status.__kind__ === 'revisionRequestedByAsistenmu'
                ? request.status.revisionRequestedByAsistenmu
                : null;

              return (
                <div key={request.id.toString()} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">#{request.id.toString()} - {request.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{request.details}</p>
                    </div>
                    <Badge variant="outline">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Revisi
                    </Badge>
                  </div>
                  {revisionData && (
                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded p-3">
                      <div className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">
                        Detail Revisi:
                      </div>
                      <div className="text-sm text-amber-800 dark:text-amber-200">
                        {revisionData.revisionByAsistenmu}
                      </div>
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

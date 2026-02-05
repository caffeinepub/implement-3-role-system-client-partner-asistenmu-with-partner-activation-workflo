import { useGetAsistenmuRequests } from '../../hooks/useRequests';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Clock, Calendar } from 'lucide-react';

export default function AsistenmuIncomingRequestsTab() {
  const { data: requests, isLoading } = useGetAsistenmuRequests();

  const incomingRequests = requests?.filter(
    (req) => req.status.__kind__ === 'newlyCreated'
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
        <CardTitle>Permintaan Masuk ({incomingRequests.length})</CardTitle>
        <CardDescription>Permintaan baru dari client yang perlu ditugaskan</CardDescription>
      </CardHeader>
      <CardContent>
        {incomingRequests.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Tidak ada permintaan baru
          </div>
        ) : (
          <div className="space-y-4">
            {incomingRequests.map((request) => (
              <div key={request.id.toString()} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">#{request.id.toString()} - {request.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{request.details}</p>
                  </div>
                  <Badge>Baru</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(Number(request.createdAt) / 1_000_000).toLocaleDateString('id-ID')}
                  </div>
                  {request.deadline && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Deadline: {new Date(Number(request.deadline) / 1_000_000).toLocaleDateString('id-ID')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { useGetAsistenmuRequests } from '../../hooks/useRequests';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, User } from 'lucide-react';

export default function AsistenmuInProgressTab() {
  const { data: requests, isLoading } = useGetAsistenmuRequests();

  const inProgressRequests = requests?.filter(
    (req) => req.status.__kind__ === 'inProgressByPartner'
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
        <CardTitle>Sedang Dikerjakan Partner ({inProgressRequests.length})</CardTitle>
        <CardDescription>Pekerjaan yang sedang dikerjakan oleh partner</CardDescription>
      </CardHeader>
      <CardContent>
        {inProgressRequests.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Tidak ada pekerjaan yang sedang dikerjakan
          </div>
        ) : (
          <div className="space-y-4">
            {inProgressRequests.map((request) => {
              const partnerData = request.status.__kind__ === 'inProgressByPartner' 
                ? request.status.inProgressByPartner 
                : null;
              
              return (
                <div key={request.id.toString()} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">#{request.id.toString()} - {request.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{request.details}</p>
                    </div>
                    <Badge variant="outline">Dalam Proses</Badge>
                  </div>
                  {partnerData && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4" />
                      Partner: {partnerData.partnerId.toString()}
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

import { Card, CardContent } from '@/components/ui/card';
import { useGetAsistenmuRequests } from '../../hooks/useRequests';
import RequestListState from './RequestListState';
import AsistenmuRequestCard from './AsistenmuRequestCard';

export default function AsistenmuRequestsTab() {
  const { data: requests, isLoading, error } = useGetAsistenmuRequests();

  const newRequests = requests?.filter(r => 
    r.status.__kind__ === 'inProgress' && !r.status.inProgress
  ) || [];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">New Client Requests ({newRequests.length})</h3>
          <RequestListState
            requests={newRequests}
            isLoading={isLoading}
            error={error}
            emptyMessage="No new requests from clients"
            renderRequest={(request) => (
              <AsistenmuRequestCard request={request} />
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}

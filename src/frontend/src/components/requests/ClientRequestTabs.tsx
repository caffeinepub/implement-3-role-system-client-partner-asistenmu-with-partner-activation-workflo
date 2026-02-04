import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Wrench, Eye, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useGetClientRequests } from '../../hooks/useRequests';
import RequestListState from './RequestListState';
import ClientReviewActions from './ClientReviewActions';

export default function ClientRequestTabs() {
  const { data: requests, isLoading, error } = useGetClientRequests();

  const delegatingRequests = requests?.filter(r => 
    r.status.__kind__ === 'inProgress' && !r.status.inProgress
  ) || [];

  const inProgressRequests = requests?.filter(r => 
    r.status.__kind__ === 'inProgress' && r.status.inProgress
  ) || [];

  const reviewRequests = requests?.filter(r => 
    r.status.__kind__ === 'clientReviewPending'
  ) || [];

  const revisingRequests = requests?.filter(r => 
    r.status.__kind__ === 'revisionRequested'
  ) || [];

  const completedRequests = requests?.filter(r => 
    r.status.__kind__ === 'completed'
  ) || [];

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs defaultValue="delegating" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="delegating" className="text-xs sm:text-sm">
              <Clock className="w-4 h-4 mr-1" />
              Delegating ({delegatingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="inProgress" className="text-xs sm:text-sm">
              <Wrench className="w-4 h-4 mr-1" />
              In Progress ({inProgressRequests.length})
            </TabsTrigger>
            <TabsTrigger value="review" className="text-xs sm:text-sm">
              <Eye className="w-4 h-4 mr-1" />
              Review ({reviewRequests.length})
            </TabsTrigger>
            <TabsTrigger value="revising" className="text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              Revising ({revisingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Completed ({completedRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="delegating">
            <RequestListState
              requests={delegatingRequests}
              isLoading={isLoading}
              error={error}
              emptyMessage="No requests in delegation process"
              renderRequest={(request) => (
                <div className="p-4 border rounded-lg space-y-2">
                  <h3 className="font-semibold">{request.title}</h3>
                  <p className="text-sm text-muted-foreground">{request.details}</p>
                  {request.deadline && (
                    <p className="text-xs text-muted-foreground">
                      Deadline: {new Date(Number(request.deadline) / 1000000).toLocaleDateString()}
                    </p>
                  )}
                  <p className="text-xs text-amber-600">Status: Sedang dalam proses delegasi permintaan</p>
                </div>
              )}
            />
          </TabsContent>

          <TabsContent value="inProgress">
            <RequestListState
              requests={inProgressRequests}
              isLoading={isLoading}
              error={error}
              emptyMessage="No requests in progress"
              renderRequest={(request) => (
                <div className="p-4 border rounded-lg space-y-2">
                  <h3 className="font-semibold">{request.title}</h3>
                  <p className="text-sm text-muted-foreground">{request.details}</p>
                  {request.deadline && (
                    <p className="text-xs text-muted-foreground">
                      Deadline: {new Date(Number(request.deadline) / 1000000).toLocaleDateString()}
                    </p>
                  )}
                  <p className="text-xs text-blue-600">Status: Dalam proses pengerjaan</p>
                </div>
              )}
            />
          </TabsContent>

          <TabsContent value="review">
            <RequestListState
              requests={reviewRequests}
              isLoading={isLoading}
              error={error}
              emptyMessage="No requests awaiting review"
              renderRequest={(request) => (
                <div className="p-4 border rounded-lg space-y-3">
                  <h3 className="font-semibold">{request.title}</h3>
                  <p className="text-sm text-muted-foreground">{request.details}</p>
                  {request.deadline && (
                    <p className="text-xs text-muted-foreground">
                      Deadline: {new Date(Number(request.deadline) / 1000000).toLocaleDateString()}
                    </p>
                  )}
                  {request.status.__kind__ === 'clientReviewPending' && request.status.clientReviewPending.reviewLink && (
                    <a
                      href={request.status.clientReviewPending.reviewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      View Review Link →
                    </a>
                  )}
                  <ClientReviewActions requestId={request.id} />
                </div>
              )}
            />
          </TabsContent>

          <TabsContent value="revising">
            <RequestListState
              requests={revisingRequests}
              isLoading={isLoading}
              error={error}
              emptyMessage="No requests under revision"
              renderRequest={(request) => (
                <div className="p-4 border rounded-lg space-y-2">
                  <h3 className="font-semibold">{request.title}</h3>
                  <p className="text-sm text-muted-foreground">{request.details}</p>
                  {request.deadline && (
                    <p className="text-xs text-muted-foreground">
                      Deadline: {new Date(Number(request.deadline) / 1000000).toLocaleDateString()}
                    </p>
                  )}
                  {request.status.__kind__ === 'revisionRequested' && (
                    <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-950/20 rounded">
                      <p className="text-xs font-medium text-amber-800 dark:text-amber-200">Revision Notes:</p>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        {request.status.revisionRequested.revisionDetails}
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-amber-600">Status: Sedang direvisi, mohon tunggu</p>
                </div>
              )}
            />
          </TabsContent>

          <TabsContent value="completed">
            <RequestListState
              requests={completedRequests}
              isLoading={isLoading}
              error={error}
              emptyMessage="No completed requests"
              renderRequest={(request) => (
                <div className="p-4 border rounded-lg space-y-2 bg-green-50 dark:bg-green-950/20">
                  <h3 className="font-semibold">{request.title}</h3>
                  <p className="text-sm text-muted-foreground">{request.details}</p>
                  {request.deadline && (
                    <p className="text-xs text-muted-foreground">
                      Deadline: {new Date(Number(request.deadline) / 1000000).toLocaleDateString()}
                    </p>
                  )}
                  <p className="text-xs text-green-600">Status: Selesai</p>
                </div>
              )}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Wrench, Eye, AlertCircle, CheckCircle2 } from 'lucide-react';
import RequestListState from './RequestListState';
import { Badge } from '@/components/ui/badge';
import { Request } from '../../backend';

interface ClientRequestTabsProps {
  requests?: Request[];
  isLoading?: boolean;
  error?: Error | null;
}

export default function ClientRequestTabs({ requests, isLoading, error }: ClientRequestTabsProps) {
  // Filter requests by status
  const newRequests = requests?.filter(r => 
    r.status.__kind__ === 'newlyCreated'
  ) || [];

  const assignedRequests = requests?.filter(r => 
    r.status.__kind__ === 'offerSentToPartner' || r.status.__kind__ === 'assignedAsPartner'
  ) || [];

  const inProgressRequests = requests?.filter(r => 
    r.status.__kind__ === 'inProgressByPartner'
  ) || [];

  const qaRequests = requests?.filter(r => 
    r.status.__kind__ === 'qaRequestedByPartner'
  ) || [];

  const revisionRequests = requests?.filter(r => 
    r.status.__kind__ === 'revisionRequestedByAsistenmu'
  ) || [];

  const completedRequests = requests?.filter(r => 
    r.status.__kind__ === 'completedBYPartnerAndAsistenmu'
  ) || [];

  const rejectedRequests = requests?.filter(r => 
    r.recordStatus === 'rejected'
  ) || [];

  return (
    <Tabs defaultValue="new" className="w-full">
      <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 mb-6">
        <TabsTrigger value="new" className="text-xs sm:text-sm">
          <Clock className="w-4 h-4 mr-1" />
          Baru ({newRequests.length})
        </TabsTrigger>
        <TabsTrigger value="assigned" className="text-xs sm:text-sm">
          <Wrench className="w-4 h-4 mr-1" />
          Ditugaskan ({assignedRequests.length})
        </TabsTrigger>
        <TabsTrigger value="inProgress" className="text-xs sm:text-sm">
          <Wrench className="w-4 h-4 mr-1" />
          Dikerjakan ({inProgressRequests.length})
        </TabsTrigger>
        <TabsTrigger value="qa" className="text-xs sm:text-sm">
          <Eye className="w-4 h-4 mr-1" />
          QA ({qaRequests.length})
        </TabsTrigger>
        <TabsTrigger value="revision" className="text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 mr-1" />
          Revisi ({revisionRequests.length})
        </TabsTrigger>
        <TabsTrigger value="completed" className="text-xs sm:text-sm">
          <CheckCircle2 className="w-4 h-4 mr-1" />
          Selesai ({completedRequests.length})
        </TabsTrigger>
        <TabsTrigger value="rejected" className="text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 mr-1" />
          Ditolak ({rejectedRequests.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="new">
        <RequestListState
          requests={newRequests}
          isLoading={isLoading || false}
          error={error || null}
          emptyMessage="Tidak ada permintaan baru"
          renderRequest={(request) => (
            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold">#{request.id.toString()} - {request.title}</h3>
                <Badge>Baru</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{request.details}</p>
              {request.deadline && (
                <p className="text-xs text-muted-foreground">
                  Deadline: {new Date(Number(request.deadline) / 1000000).toLocaleDateString('id-ID')}
                </p>
              )}
              <p className="text-xs text-amber-600">Status: Menunggu penugasan ke partner</p>
            </div>
          )}
        />
      </TabsContent>

      <TabsContent value="assigned">
        <RequestListState
          requests={assignedRequests}
          isLoading={isLoading || false}
          error={error || null}
          emptyMessage="Tidak ada permintaan yang ditugaskan"
          renderRequest={(request) => (
            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold">#{request.id.toString()} - {request.title}</h3>
                <Badge variant="outline">Ditugaskan</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{request.details}</p>
              {request.deadline && (
                <p className="text-xs text-muted-foreground">
                  Deadline: {new Date(Number(request.deadline) / 1000000).toLocaleDateString('id-ID')}
                </p>
              )}
              <p className="text-xs text-blue-600">Status: Telah ditugaskan ke partner</p>
            </div>
          )}
        />
      </TabsContent>

      <TabsContent value="inProgress">
        <RequestListState
          requests={inProgressRequests}
          isLoading={isLoading || false}
          error={error || null}
          emptyMessage="Tidak ada permintaan dalam pengerjaan"
          renderRequest={(request) => (
            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold">#{request.id.toString()} - {request.title}</h3>
                <Badge variant="outline">Dikerjakan</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{request.details}</p>
              {request.deadline && (
                <p className="text-xs text-muted-foreground">
                  Deadline: {new Date(Number(request.deadline) / 1000000).toLocaleDateString('id-ID')}
                </p>
              )}
              <p className="text-xs text-blue-600">Status: Sedang dikerjakan partner</p>
            </div>
          )}
        />
      </TabsContent>

      <TabsContent value="qa">
        <RequestListState
          requests={qaRequests}
          isLoading={isLoading || false}
          error={error || null}
          emptyMessage="Tidak ada permintaan QA"
          renderRequest={(request) => (
            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold">#{request.id.toString()} - {request.title}</h3>
                <Badge>QA Review</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{request.details}</p>
              {request.deadline && (
                <p className="text-xs text-muted-foreground">
                  Deadline: {new Date(Number(request.deadline) / 1000000).toLocaleDateString('id-ID')}
                </p>
              )}
              <p className="text-xs text-purple-600">Status: Menunggu review dari Asistenmu</p>
            </div>
          )}
        />
      </TabsContent>

      <TabsContent value="revision">
        <RequestListState
          requests={revisionRequests}
          isLoading={isLoading || false}
          error={error || null}
          emptyMessage="Tidak ada permintaan revisi"
          renderRequest={(request) => {
            const revisionData = request.status.__kind__ === 'revisionRequestedByAsistenmu'
              ? request.status.revisionRequestedByAsistenmu
              : null;

            return (
              <div className="p-4 border rounded-lg space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold">#{request.id.toString()} - {request.title}</h3>
                  <Badge variant="outline">Revisi</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{request.details}</p>
                {request.deadline && (
                  <p className="text-xs text-muted-foreground">
                    Deadline: {new Date(Number(request.deadline) / 1000000).toLocaleDateString('id-ID')}
                  </p>
                )}
                {revisionData && (
                  <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded border border-amber-200 dark:border-amber-800">
                    <p className="text-xs font-medium text-amber-800 dark:text-amber-200 mb-1">
                      Catatan Revisi:
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      {revisionData.revisionByAsistenmu}
                    </p>
                  </div>
                )}
                <p className="text-xs text-amber-600">Status: Sedang direvisi partner</p>
              </div>
            );
          }}
        />
      </TabsContent>

      <TabsContent value="completed">
        <RequestListState
          requests={completedRequests}
          isLoading={isLoading || false}
          error={error || null}
          emptyMessage="Belum ada permintaan yang selesai"
          renderRequest={(request) => {
            const completionData = request.status.__kind__ === 'completedBYPartnerAndAsistenmu'
              ? request.status.completedBYPartnerAndAsistenmu
              : null;

            return (
              <div className="p-4 border rounded-lg space-y-2 bg-green-50 dark:bg-green-950/20">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold">#{request.id.toString()} - {request.title}</h3>
                  <Badge className="bg-green-500">Selesai</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{request.details}</p>
                {request.deadline && (
                  <p className="text-xs text-muted-foreground">
                    Deadline: {new Date(Number(request.deadline) / 1000000).toLocaleDateString('id-ID')}
                  </p>
                )}
                {completionData && completionData.finalReport && (
                  <div className="mt-2 p-3 bg-accent rounded">
                    <p className="text-xs font-medium mb-1">Laporan Akhir:</p>
                    <p className="text-sm text-muted-foreground">{completionData.finalReport}</p>
                  </div>
                )}
                <p className="text-xs text-green-600">Status: Selesai dan disetujui</p>
              </div>
            );
          }}
        />
      </TabsContent>

      <TabsContent value="rejected">
        <RequestListState
          requests={rejectedRequests}
          isLoading={isLoading || false}
          error={error || null}
          emptyMessage="Tidak ada permintaan yang ditolak"
          renderRequest={(request) => {
            const rejectionData = request.status.__kind__ === 'rejectedByPartner'
              ? request.status.rejectedByPartner
              : null;

            return (
              <div className="p-4 border rounded-lg space-y-2 bg-destructive/5">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold">#{request.id.toString()} - {request.title}</h3>
                  <Badge variant="destructive">Ditolak</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{request.details}</p>
                {request.deadline && (
                  <p className="text-xs text-muted-foreground">
                    Deadline: {new Date(Number(request.deadline) / 1000000).toLocaleDateString('id-ID')}
                  </p>
                )}
                {rejectionData && (
                  <div className="mt-2 p-3 bg-destructive/10 rounded border border-destructive/20">
                    <p className="text-xs font-medium text-destructive mb-1">
                      Alasan Penolakan:
                    </p>
                    <p className="text-sm text-destructive/90">
                      {rejectionData.revisionByPartner}
                    </p>
                  </div>
                )}
                <p className="text-xs text-destructive">Status: Ditolak oleh partner</p>
              </div>
            );
          }}
        />
      </TabsContent>
    </Tabs>
  );
}

import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useGetPartnerProfile } from '../hooks/useRequests';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogOut, Briefcase, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import PartnerNewWorkTab from '../components/partner/PartnerNewWorkTab';
import PartnerActiveWorkTab from '../components/partner/PartnerActiveWorkTab';
import PartnerRevisionRequestsTab from '../components/partner/PartnerRevisionRequestsTab';
import PartnerCompletedWorkTab from '../components/partner/PartnerCompletedWorkTab';
import PartnerRejectedWorkTab from '../components/partner/PartnerRejectedWorkTab';
import PartnerEarningsTab from '../components/partner/PartnerEarningsTab';

export default function PartnerDashboardPage() {
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: partnerProfile, isLoading: partnerProfileLoading } = useGetPartnerProfile();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  if (profileLoading || partnerProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="header-translucent">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Partner Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                {partnerProfile?.companyName || profile?.name || 'Partner'}
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Cards */}
          {partnerProfile && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tugas Aktif</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Number(partnerProfile.pendingTasks)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Selesai</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Number(partnerProfile.completedTasks)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ditolak</CardTitle>
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Number(partnerProfile.rejectedTasks)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pendapatan</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    Rp {Number(partnerProfile.pendingEarnings).toLocaleString('id-ID')}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tabs */}
          <Tabs defaultValue="newwork" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
              <TabsTrigger value="newwork">Pekerjaan Baru</TabsTrigger>
              <TabsTrigger value="active">Pekerjaan Aktif</TabsTrigger>
              <TabsTrigger value="revision">Permintaan Revisi</TabsTrigger>
              <TabsTrigger value="completed">Selesai</TabsTrigger>
              <TabsTrigger value="rejected">Ditolak</TabsTrigger>
              <TabsTrigger value="earnings">Pendapatan</TabsTrigger>
            </TabsList>

            <TabsContent value="newwork">
              <PartnerNewWorkTab />
            </TabsContent>

            <TabsContent value="active">
              <PartnerActiveWorkTab />
            </TabsContent>

            <TabsContent value="revision">
              <PartnerRevisionRequestsTab />
            </TabsContent>

            <TabsContent value="completed">
              <PartnerCompletedWorkTab />
            </TabsContent>

            <TabsContent value="rejected">
              <PartnerRejectedWorkTab />
            </TabsContent>

            <TabsContent value="earnings">
              <PartnerEarningsTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

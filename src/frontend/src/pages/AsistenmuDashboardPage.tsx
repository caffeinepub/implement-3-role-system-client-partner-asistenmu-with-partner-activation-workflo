import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, LogOut } from 'lucide-react';
import PartnerAssignmentTab from '../components/asistenmu/PartnerAssignmentTab';
import AsistenmuIncomingRequestsTab from '../components/asistenmu/AsistenmuIncomingRequestsTab';
import AsistenmuInProgressTab from '../components/asistenmu/AsistenmuInProgressTab';
import AsistenmuQARequestsTab from '../components/asistenmu/AsistenmuQARequestsTab';
import AsistenmuRejectedTab from '../components/asistenmu/AsistenmuRejectedTab';
import AsistenmuCompletedTab from '../components/asistenmu/AsistenmuCompletedTab';

export default function AsistenmuDashboardPage() {
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  if (profileLoading) {
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
              <h1 className="text-2xl font-bold text-foreground">Asistenmu Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {profile?.name || 'Asistenmu'}
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
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="incoming" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
              <TabsTrigger value="incoming">Permintaan Masuk</TabsTrigger>
              <TabsTrigger value="assignment">Penugasan Partner</TabsTrigger>
              <TabsTrigger value="inprogress">Sedang Dikerjakan</TabsTrigger>
              <TabsTrigger value="qa">Permintaan QA</TabsTrigger>
              <TabsTrigger value="rejected">Partner Menolak</TabsTrigger>
              <TabsTrigger value="completed">Selesai</TabsTrigger>
            </TabsList>

            <TabsContent value="incoming">
              <AsistenmuIncomingRequestsTab />
            </TabsContent>

            <TabsContent value="assignment">
              <PartnerAssignmentTab />
            </TabsContent>

            <TabsContent value="inprogress">
              <AsistenmuInProgressTab />
            </TabsContent>

            <TabsContent value="qa">
              <AsistenmuQARequestsTab />
            </TabsContent>

            <TabsContent value="rejected">
              <AsistenmuRejectedTab />
            </TabsContent>

            <TabsContent value="completed">
              <AsistenmuCompletedTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

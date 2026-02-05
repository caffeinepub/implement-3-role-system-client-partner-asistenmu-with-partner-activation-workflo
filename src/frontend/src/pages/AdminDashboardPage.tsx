import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import AuthButton from '../components/AuthButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import LayananTab from '../components/admin/LayananTab';
import AdminSummaryTab from '../components/admin/AdminSummaryTab';
import ClientsTab from '../components/admin/ClientsTab';
import PendingPartnersPanel from '../components/admin/PendingPartnersPanel';
import AsistenmuManagementPanel from '../components/admin/AsistenmuManagementPanel';
import ReadOnlyPlaceholderPanel from '../components/admin/ReadOnlyPlaceholderPanel';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();

  useEffect(() => {
    if (!isInitializing && !identity) {
      navigate({ to: '/' });
    }
  }, [identity, isInitializing, navigate]);

  if (isInitializing || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="header-translucent">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Asistenku</h1>
              <p className="text-xs text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>
          <AuthButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome Card */}
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Shield className="w-6 h-6 text-primary" />
                    Welcome, {userProfile?.name || 'Admin'}!
                  </CardTitle>
                  <CardDescription>
                    Your admin dashboard - manage all aspects of the platform
                  </CardDescription>
                </div>
                <Badge className="gap-1.5 px-3 py-1 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0">
                  <Shield className="w-3.5 h-3.5" />
                  Admin
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Admin Tabs */}
          <Tabs defaultValue="summary" className="space-y-6">
            <div className="overflow-x-auto">
              <TabsList className="inline-flex h-auto p-1 bg-muted/50 rounded-lg gap-1 min-w-full lg:min-w-0">
                <TabsTrigger value="summary" className="rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap">
                  Ringkasan
                </TabsTrigger>
                <TabsTrigger value="clients" className="rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap">
                  Klien
                </TabsTrigger>
                <TabsTrigger value="services" className="rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap">
                  Layanan
                </TabsTrigger>
                <TabsTrigger value="partners" className="rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap">
                  Partner
                </TabsTrigger>
                <TabsTrigger value="asistenmu" className="rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap">
                  Asistenmu
                </TabsTrigger>
                <TabsTrigger value="requests" className="rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap">
                  Permintaan
                </TabsTrigger>
                <TabsTrigger value="audit" className="rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap">
                  Audit
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="summary" className="space-y-4">
              <AdminSummaryTab />
            </TabsContent>

            <TabsContent value="clients" className="space-y-4">
              <ClientsTab />
            </TabsContent>

            <TabsContent value="services" className="space-y-4">
              <LayananTab />
            </TabsContent>

            <TabsContent value="partners" className="space-y-4">
              <PendingPartnersPanel />
            </TabsContent>

            <TabsContent value="asistenmu" className="space-y-4">
              <AsistenmuManagementPanel />
            </TabsContent>

            <TabsContent value="requests" className="space-y-4">
              <ReadOnlyPlaceholderPanel
                title="Requests Management"
                description="This feature is coming soon. You will be able to view and manage all service requests here."
              />
            </TabsContent>

            <TabsContent value="audit" className="space-y-4">
              <ReadOnlyPlaceholderPanel
                title="Audit Logs"
                description="This feature is coming soon. You will be able to view system audit logs and activity history here."
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © 2026. Built with{' '}
            <span className="inline-block text-red-500 animate-pulse">♥</span>{' '}
            using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

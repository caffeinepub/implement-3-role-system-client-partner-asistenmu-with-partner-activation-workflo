import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogOut } from 'lucide-react';
import AsistenmuRequestsTab from '../components/requests/AsistenmuRequestsTab';

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
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
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
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Welcome Card */}
          <Card>
            <CardHeader>
              <CardTitle>Client Requests</CardTitle>
              <CardDescription>Manage service requests from your assigned clients</CardDescription>
            </CardHeader>
          </Card>

          {/* Requests Tab */}
          <AsistenmuRequestsTab />
        </div>
      </main>
    </div>
  );
}

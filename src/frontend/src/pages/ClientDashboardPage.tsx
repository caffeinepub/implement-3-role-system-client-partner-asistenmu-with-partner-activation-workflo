import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetSubscriptionSummary } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, LogOut, FileText, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import ClientCreateRequestForm from '../components/requests/ClientCreateRequestForm';
import ClientRequestTabs from '../components/requests/ClientRequestTabs';

export default function ClientDashboardPage() {
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: subscriptionSummary, isLoading: summaryLoading } = useGetSubscriptionSummary();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  if (profileLoading || summaryLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const canCreateRequest = 
    subscriptionSummary && 
    Number(subscriptionSummary.totalSubscriptions) > 0 && 
    Number(subscriptionSummary.activeSubscriptions) > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Client Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {profile?.name || 'Client'}
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
          {/* Subscription Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Status</CardTitle>
              <CardDescription>Your current service subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Total Subscriptions</p>
                  <p className="text-2xl font-bold">
                    {subscriptionSummary ? Number(subscriptionSummary.totalSubscriptions) : 0}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                  <p className="text-2xl font-bold text-green-600">
                    {subscriptionSummary ? Number(subscriptionSummary.activeSubscriptions) : 0}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Asistenmu Assigned</p>
                  <p className="text-2xl font-bold">
                    {subscriptionSummary?.hasActiveAsistenmu ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-amber-600" />
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Create Request Button */}
          <Card>
            <CardHeader>
              <CardTitle>Service Requests</CardTitle>
              <CardDescription>Create and manage your service requests</CardDescription>
            </CardHeader>
            <CardContent>
              {!canCreateRequest && (
                <div className="mb-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Aktifkan layanan terlebih dahulu sebelum membuat permintaan
                  </p>
                </div>
              )}
              <Button
                onClick={() => setShowCreateForm(true)}
                disabled={!canCreateRequest}
                className="w-full md:w-auto"
              >
                <FileText className="w-4 h-4 mr-2" />
                Buat Permintaan
              </Button>
            </CardContent>
          </Card>

          {/* Request Tabs */}
          <ClientRequestTabs />
        </div>
      </main>

      {/* Create Request Dialog */}
      {showCreateForm && (
        <ClientCreateRequestForm
          open={showCreateForm}
          onClose={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
}

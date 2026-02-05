import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetSubscriptionSummary } from '../hooks/useQueries';
import { useGetClientRequests } from '../hooks/useRequests';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, AlertCircle } from 'lucide-react';
import ClientCreateRequestForm from '../components/requests/ClientCreateRequestForm';
import ClientRequestTabs from '../components/requests/ClientRequestTabs';
import ClientProfileSection from '../components/client/ClientProfileSection';
import ClientRequestSummaryCards from '../components/client/ClientRequestSummaryCards';
import CollapsibleSection from '../components/client/CollapsibleSection';

export default function ClientDashboardPage() {
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: profile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: subscriptionSummary, isLoading: summaryLoading } = useGetSubscriptionSummary();
  const { data: requests, isLoading: requestsLoading } = useGetClientRequests();
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="header-translucent">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-primary">Asistenku</div>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              Keluar
            </Button>
          </div>
        </div>
      </header>

      {/* Greeting */}
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold text-foreground">
          Halo, {profile?.name || 'Client'} apa yang akan anda lakukan hari ini?
        </h1>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-8 flex-1">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Profile Section - Collapsible, Collapsed by Default */}
          <ClientProfileSection
            profile={profile}
            identity={identity}
            subscriptionSummary={subscriptionSummary}
            profileLoading={profileLoading}
            isFetched={isFetched}
          />

          {/* Request Summary Cards */}
          <ClientRequestSummaryCards
            requests={requests || []}
            isLoading={requestsLoading}
          />

          {/* Service Requests Section - Collapsible */}
          <CollapsibleSection title="Layanan Permintaan" defaultOpen={true}>
            <div className="space-y-4">
              {!canCreateRequest && (
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
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
            </div>
          </CollapsibleSection>

          {/* Request Tabs - Collapsible */}
          <CollapsibleSection title="Permintaan" defaultOpen={true}>
            <ClientRequestTabs requests={requests} isLoading={requestsLoading} />
          </CollapsibleSection>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Asistenku - PT. Asistenku Digital Indonesia
          </p>
        </div>
      </footer>

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

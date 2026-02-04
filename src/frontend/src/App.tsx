import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetCallerUserRole, useIsCallerAdmin } from './hooks/useQueries';
import AuthButton from './components/AuthButton';
import ProfileSetupModal from './components/ProfileSetupModal';
import AdminOwnerStatusCard from './components/AdminOwnerStatusCard';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();
  const { data: userRole, isLoading: roleLoading } = useGetCallerUserRole();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  // Show profile setup modal only when authenticated, profile is fetched, and no profile exists
  const showProfileSetup = isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Toaster />
      
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Admin Control</h1>
              <p className="text-xs text-muted-foreground">Secure owner pattern</p>
            </div>
          </div>
          <AuthButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {!isAuthenticated ? (
          <div className="max-w-2xl mx-auto text-center space-y-8 py-16">
            <div className="space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-foreground">Welcome to Admin Control</h2>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                A secure admin pattern where the first authenticated user becomes the permanent owner.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 space-y-4 max-w-md mx-auto">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-foreground mb-1">Backend-Enforced Security</h3>
                  <p className="text-sm text-muted-foreground">
                    The first login automatically becomes the permanent admin. This cannot be changed or overridden.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-foreground mb-1">Internet Identity</h3>
                  <p className="text-sm text-muted-foreground">
                    Secure authentication powered by the Internet Computer's decentralized identity system.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-4">Ready to get started?</p>
              <AuthButton />
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            <AdminOwnerStatusCard
              userProfile={userProfile}
              userRole={userRole}
              isAdmin={isAdmin}
              isLoading={profileLoading || roleLoading || adminLoading}
            />
          </div>
        )}
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

      {/* Profile Setup Modal */}
      {showProfileSetup && <ProfileSetupModal />}
    </div>
  );
}

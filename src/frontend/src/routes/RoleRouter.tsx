import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetDomainRole } from '../hooks/useQueries';
import { Loader2, AlertCircle } from 'lucide-react';
import RoleResolutionErrorState from '../components/RoleResolutionErrorState';

export default function RoleRouter() {
  const navigate = useNavigate();
  const { identity, isInitializing } = useInternetIdentity();
  const { data: domainRole, isLoading: roleLoading, isFetched, error, refetch } = useGetDomainRole();
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    // Wait for initialization
    if (isInitializing || roleLoading) return;

    // Not authenticated - redirect to landing (only once)
    if (!identity && !hasNavigated) {
      setHasNavigated(true);
      navigate({ to: '/' });
      return;
    }

    // Authenticated - redirect based on domain role (only once)
    if (identity && isFetched && !hasNavigated) {
      if (!domainRole) {
        // No domain role yet - stay on this page with a message
        // Don't redirect to avoid loop
        return;
      }

      setHasNavigated(true);
      switch (domainRole) {
        case 'admin':
          navigate({ to: '/admin' });
          break;
        case 'client':
          navigate({ to: '/client' });
          break;
        case 'asistenmu':
          navigate({ to: '/asistenmu' });
          break;
        case 'partner':
          navigate({ to: '/partner' });
          break;
        default:
          navigate({ to: '/access-denied' });
      }
    }
  }, [identity, domainRole, isInitializing, roleLoading, isFetched, navigate, hasNavigated]);

  // Show error state if role resolution failed
  if (error && identity) {
    return <RoleResolutionErrorState onRetry={() => refetch()} />;
  }

  // Show "no role" state if authenticated but no domain role
  if (identity && isFetched && !domainRole && !roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-teal-50/30">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center space-y-6 shadow-lg">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-amber-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">No Account Role</h2>
              <p className="text-gray-600">
                Your account is authenticated but doesn't have a role assigned yet. Please register or contact an administrator.
              </p>
            </div>
            <button
              onClick={() => {
                setHasNavigated(true);
                navigate({ to: '/' });
              }}
              className="w-full px-6 py-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors font-medium"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-teal-50/30">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-teal-600" />
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}

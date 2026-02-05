import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetDomainRole } from '../hooks/useQueries';
import { Loader2 } from 'lucide-react';
import RoleResolutionErrorState from '../components/RoleResolutionErrorState';

interface RequireDomainRoleProps {
  children: ReactNode;
  requiredRole: 'admin' | 'client' | 'asistenmu' | 'partner';
}

export default function RequireDomainRole({ children, requiredRole }: RequireDomainRoleProps) {
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

    // Role fetched but doesn't match required role (only redirect once)
    if (isFetched && domainRole !== requiredRole && !hasNavigated) {
      setHasNavigated(true);
      navigate({ to: '/access-denied' });
      return;
    }
  }, [identity, domainRole, isInitializing, roleLoading, isFetched, requiredRole, navigate, hasNavigated]);

  // Show error state if role resolution failed
  if (error && identity) {
    return <RoleResolutionErrorState onRetry={() => refetch()} />;
  }

  // Show loading state while checking authentication and role
  if (isInitializing || roleLoading || !isFetched) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-teal-50/30">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-teal-600" />
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!identity) {
    return null;
  }

  // Role doesn't match
  if (domainRole !== requiredRole) {
    return null;
  }

  // Authorized - render children
  return <>{children}</>;
}

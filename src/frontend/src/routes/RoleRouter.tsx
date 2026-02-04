import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetUserRole } from '../hooks/useQueries';
import { Loader2 } from 'lucide-react';

export default function RoleRouter() {
  const navigate = useNavigate();
  const { identity, isInitializing } = useInternetIdentity();
  const { data: role, isLoading: roleLoading } = useGetUserRole();

  useEffect(() => {
    // Wait for initialization
    if (isInitializing || roleLoading) return;

    // Not authenticated - redirect to landing
    if (!identity) {
      navigate({ to: '/' });
      return;
    }

    // Authenticated - redirect based on role
    if (role) {
      switch (role) {
        case 'admin':
          navigate({ to: '/admin' });
          break;
        case 'user':
          // User role - need to check if they're client or asistenmu
          // For now, default to client dashboard
          navigate({ to: '/client' });
          break;
        case 'guest':
          navigate({ to: '/access-denied' });
          break;
        default:
          navigate({ to: '/access-denied' });
      }
    }
  }, [identity, role, isInitializing, roleLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}

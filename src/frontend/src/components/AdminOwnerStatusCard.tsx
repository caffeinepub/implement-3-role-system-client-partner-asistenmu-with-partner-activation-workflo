import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, User, Crown, CheckCircle2, AlertCircle } from 'lucide-react';
import { UserProfile, UserRole } from '../backend';
import AdminOnlyActions from './AdminOnlyActions';

interface AdminOwnerStatusCardProps {
  userProfile: UserProfile | null | undefined;
  userRole: UserRole | undefined;
  isAdmin: boolean | undefined;
  isLoading: boolean;
}

export default function AdminOwnerStatusCard({
  userProfile,
  userRole,
  isAdmin,
  isLoading,
}: AdminOwnerStatusCardProps) {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString();

  if (isLoading) {
    return (
      <Card className="border-2">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading your status...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRoleBadge = () => {
    if (isAdmin) {
      return (
        <Badge className="gap-1.5 px-3 py-1 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0">
          <Crown className="w-3.5 h-3.5" />
          Admin / Owner
        </Badge>
      );
    }
    
    if (userRole === UserRole.user) {
      return (
        <Badge variant="secondary" className="gap-1.5 px-3 py-1">
          <User className="w-3.5 h-3.5" />
          User
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="gap-1.5 px-3 py-1">
        <AlertCircle className="w-3.5 h-3.5" />
          Guest
        </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 shadow-lg">
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                Your Status
              </CardTitle>
              <CardDescription>
                Your authentication and authorization details
              </CardDescription>
            </div>
            {getRoleBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Profile */}
          {userProfile && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <User className="w-4 h-4" />
                Profile
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-lg font-semibold text-foreground">{userProfile.name}</p>
              </div>
            </div>
          )}

          <Separator />

          {/* Principal ID */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CheckCircle2 className="w-4 h-4" />
              Principal ID
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <code className="text-xs font-mono break-all text-foreground">{principal}</code>
            </div>
          </div>

          <Separator />

          {/* Role Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Shield className="w-4 h-4" />
              Authorization Details
            </div>
            <div className="grid gap-3">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-muted-foreground">Role</span>
                <span className="text-sm font-medium text-foreground capitalize">{userRole || 'guest'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-muted-foreground">Admin Status</span>
                <span className="text-sm font-medium text-foreground">
                  {isAdmin ? (
                    <span className="flex items-center gap-1.5 text-primary">
                      <CheckCircle2 className="w-4 h-4" />
                      Active
                    </span>
                  ) : (
                    'Not Admin'
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          {isAdmin && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Crown className="w-4 h-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">You are the Owner/Admin</p>
                  <p className="text-xs text-muted-foreground">
                    As the first authenticated user, you have permanent admin privileges. This status is backend-enforced and cannot be changed.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!isAdmin && (
            <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">Standard User Access</p>
                  <p className="text-xs text-muted-foreground">
                    You have standard user permissions. The admin/owner was set when the first user authenticated.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Admin-Only Actions */}
      {isAdmin && <AdminOnlyActions />}
    </div>
  );
}

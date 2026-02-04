import { useState } from 'react';
import { useAssignCallerUserRole } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Loader2, UserCog } from 'lucide-react';
import { UserRole } from '../backend';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';

export default function AdminOnlyActions() {
  const [principalInput, setPrincipalInput] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.user);
  const assignRole = useAssignCallerUserRole();

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!principalInput.trim()) {
      toast.error('Please enter a principal ID');
      return;
    }

    try {
      const principal = Principal.fromText(principalInput.trim());
      await assignRole.mutateAsync({ user: principal, role: selectedRole });
      toast.success(`Role "${selectedRole}" assigned successfully!`);
      setPrincipalInput('');
    } catch (error: any) {
      if (error.message?.includes('Unauthorized') || error.message?.includes('Access denied')) {
        toast.error('Access denied: Only admins can assign roles');
      } else if (error.message?.includes('Invalid principal')) {
        toast.error('Invalid principal ID format');
      } else {
        toast.error(error.message || 'Failed to assign role');
      }
    }
  };

  return (
    <Card className="border-2 border-primary/20 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Admin Actions</CardTitle>
            <CardDescription>Manage user roles and permissions</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAssignRole} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="principal" className="flex items-center gap-2">
                <UserCog className="w-4 h-4" />
                User Principal ID
              </Label>
              <Input
                id="principal"
                placeholder="Enter principal ID (e.g., 2vxsx-fae...)"
                value={principalInput}
                onChange={(e) => setPrincipalInput(e.target.value)}
                disabled={assignRole.isPending}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                The unique identifier of the user you want to assign a role to
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value as UserRole)}
                disabled={assignRole.isPending}
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.admin}>Admin</SelectItem>
                  <SelectItem value={UserRole.user}>User</SelectItem>
                  <SelectItem value={UserRole.guest}>Guest</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Select the role to assign to this user
              </p>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 font-medium"
            disabled={assignRole.isPending || !principalInput.trim()}
          >
            {assignRole.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Assigning Role...
              </>
            ) : (
              'Assign Role'
            )}
          </Button>

          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Note:</strong> Role assignments are backend-enforced. 
              If you're not the admin/owner, this action will be rejected by the backend even if the UI allows you to try.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

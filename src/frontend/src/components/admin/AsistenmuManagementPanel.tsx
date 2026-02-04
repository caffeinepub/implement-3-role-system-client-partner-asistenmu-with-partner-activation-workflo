import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserCheck, AlertCircle, Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function AsistenmuManagementPanel() {
  const [principalId, setPrincipalId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data - in a real app, this would come from backend queries
  const asistenmuList: any[] = [];

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setPrincipalId('');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Assign Asistenmu Form */}
      <Card className="shadow-md border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-primary" />
            Assign Asistenmu Role
          </CardTitle>
          <CardDescription>
            Assign the Asistenmu role to a user by entering their principal ID
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAssign} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="principalId">User Principal ID *</Label>
              <Input
                id="principalId"
                value={principalId}
                onChange={(e) => setPrincipalId(e.target.value)}
                placeholder="Enter user principal ID"
                required
              />
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Make sure the user is already registered in the system before assigning the Asistenmu role.
              </AlertDescription>
            </Alert>

            <Button
              type="submit"
              disabled={isSubmitting || !principalId}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Assigning...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Assign Asistenmu Role
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Current Asistenmu List */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Current Asistenmu</CardTitle>
              <CardDescription>Users with Asistenmu role assigned</CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {asistenmuList.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {asistenmuList.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Principal ID</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {asistenmuList.map((asisten, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{asisten.name}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {asisten.principal.substring(0, 20)}...
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          Active
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <UserCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No Asistenmu assigned yet.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardDescription>
            This is a read-only view. Full Asistenmu management features including role assignment and listing will be available once backend role management system is implemented.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

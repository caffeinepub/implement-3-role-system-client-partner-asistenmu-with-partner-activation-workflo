import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Briefcase, CheckCircle, XCircle } from 'lucide-react';

export default function PendingPartnersPanel() {
  // Mock data - in a real app, this would come from backend queries
  const pendingPartners: any[] = [];
  const activePartners: any[] = [];

  return (
    <div className="space-y-6">
      {/* Pending Partners */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Pending Partner Applications
              </CardTitle>
              <CardDescription>Review and approve partner applications</CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {pendingPartners.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {pendingPartners.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Contact Email</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingPartners.map((partner, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{partner.companyName}</TableCell>
                      <TableCell>{partner.contactEmail}</TableCell>
                      <TableCell className="max-w-xs truncate">{partner.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive">
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No pending partner applications.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Partners */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Active Partners
              </CardTitle>
              <CardDescription>Currently active partner accounts</CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {activePartners.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {activePartners.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Contact Email</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activePartners.map((partner, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{partner.companyName}</TableCell>
                      <TableCell>{partner.contactEmail}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
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
              <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No active partners yet.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardDescription>
            This is a read-only view. Partner application management features will be available once backend partner application system is implemented.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

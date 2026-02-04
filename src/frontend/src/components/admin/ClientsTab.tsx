import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Users, UserCheck, UserX } from 'lucide-react';

export default function ClientsTab() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - in a real app, this would come from backend queries
  const clientCounts = {
    registered: 0,
    active: 0,
    passive: 0,
  };

  const clients: any[] = [];

  const filteredClients = clients.filter((client) => {
    const query = searchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(query) ||
      client.principal.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientCounts.registered}</div>
            <p className="text-xs text-muted-foreground">Total registered</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientCounts.active}</div>
            <p className="text-xs text-muted-foreground">With active services</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Passive Clients</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientCounts.passive}</div>
            <p className="text-xs text-muted-foreground">No active services</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Client Management</CardTitle>
          <CardDescription>Search and manage all registered clients</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by client ID, principal ID, or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Clear
            </Button>
          </div>

          {/* Table */}
          {filteredClients.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Principal ID</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {client.principal.substring(0, 20)}...
                      </TableCell>
                      <TableCell className="capitalize">{client.role}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Active
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? 'No clients found matching your search.' : 'No clients registered yet.'}
              </p>
            </div>
          )}

          {/* Info */}
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardDescription>
                This is a read-only view. Full client management features including search by principal ID and detailed client information will be available once backend user listing is implemented.
              </CardDescription>
            </CardHeader>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}

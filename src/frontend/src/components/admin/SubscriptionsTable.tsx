import { useState } from 'react';
import { useGetFilteredServices } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronLeft, ChevronRight, AlertCircle, Plus, Search } from 'lucide-react';
import { BaseServiceType, ServiceStatus, SubscriptionRecord } from '../../backend';
import { formatTime } from '../../utils/time';

interface SubscriptionsTableProps {
  onEdit: (subscription: SubscriptionRecord) => void;
  onCreateNew: () => void;
}

export default function SubscriptionsTable({ onEdit, onCreateNew }: SubscriptionsTableProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [serviceType, setServiceType] = useState<BaseServiceType | 'all'>('all');
  const [status, setStatus] = useState<ServiceStatus | 'all'>('all');
  const [minQuantity, setMinQuantity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filter = {
    serviceType: serviceType !== 'all' ? serviceType : undefined,
    status: status !== 'all' ? status : undefined,
    minQuantity: minQuantity ? BigInt(minQuantity) : undefined,
    startDate: startDate ? BigInt(new Date(startDate).getTime() * 1_000_000) : undefined,
    endDate: endDate ? BigInt(new Date(endDate).getTime() * 1_000_000) : undefined,
  };

  const { data, isLoading, isError, error } = useGetFilteredServices(filter, currentPage);

  const totalPages = data ? Math.ceil(Number(data.total) / Number(data.pageSize)) : 0;

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFilterChange = () => {
    setCurrentPage(0); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setServiceType('all');
    setStatus('all');
    setMinQuantity('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load subscriptions: {error instanceof Error ? error.message : 'Unknown error'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="space-y-2">
          <label className="text-sm font-medium">Service Type</label>
          <Select value={serviceType} onValueChange={(value) => { setServiceType(value as BaseServiceType | 'all'); handleFilterChange(); }}>
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value={BaseServiceType.tenang}>Tenang</SelectItem>
              <SelectItem value={BaseServiceType.rapi}>Rapi</SelectItem>
              <SelectItem value={BaseServiceType.fokus}>Fokus</SelectItem>
              <SelectItem value={BaseServiceType.jaga}>Jaga</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select value={status} onValueChange={(value) => { setStatus(value as ServiceStatus | 'all'); handleFilterChange(); }}>
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value={ServiceStatus.active}>Active</SelectItem>
              <SelectItem value={ServiceStatus.hold}>Hold</SelectItem>
              <SelectItem value={ServiceStatus.suspended}>Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Min Quantity</label>
          <Input
            type="number"
            placeholder="Min quantity"
            value={minQuantity}
            onChange={(e) => { setMinQuantity(e.target.value); handleFilterChange(); }}
            min="0"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Start Date</label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); handleFilterChange(); }}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">End Date</label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); handleFilterChange(); }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={clearFilters}>
          Clear Filters
        </Button>
        <Button onClick={onCreateNew} className="bg-teal-600 hover:bg-teal-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create New Subscription
        </Button>
      </div>

      {/* Table */}
      {data && data.subscriptions.length > 0 ? (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price/Service</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.subscriptions.map((subscription) => (
                  <TableRow key={Number(subscription.id)}>
                    <TableCell className="font-medium">{Number(subscription.id)}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {subscription.client.toString().substring(0, 15)}...
                    </TableCell>
                    <TableCell className="capitalize">{subscription.serviceType}</TableCell>
                    <TableCell>{Number(subscription.quantity)}</TableCell>
                    <TableCell>{Number(subscription.pricePerService).toLocaleString()}</TableCell>
                    <TableCell>{formatTime(subscription.startDate)}</TableCell>
                    <TableCell>{formatTime(subscription.endDate)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        subscription.status === ServiceStatus.active
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : subscription.status === ServiceStatus.hold
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {subscription.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => onEdit(subscription)}>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {currentPage + 1} of {totalPages} ({Number(data.total).toLocaleString()} total subscriptions)
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages - 1}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            No subscriptions found. Create your first subscription to get started.
          </p>
        </div>
      )}
    </div>
  );
}

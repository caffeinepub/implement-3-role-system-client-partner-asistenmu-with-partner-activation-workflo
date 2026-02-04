import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

interface RequestListStateProps {
  requests: any[];
  isLoading: boolean;
  error: any;
  emptyMessage: string;
  renderRequest: (request: any) => React.ReactNode;
}

export default function RequestListState({
  requests,
  isLoading,
  error,
  emptyMessage,
  renderRequest,
}: RequestListStateProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-destructive mb-4" />
        <p className="text-sm text-muted-foreground">
          {error.message || 'Failed to load requests'}
        </p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <div key={request.id.toString()}>
          {renderRequest(request)}
        </div>
      ))}
    </div>
  );
}

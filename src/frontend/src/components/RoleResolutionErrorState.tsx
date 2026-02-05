import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

interface RoleResolutionErrorStateProps {
  onRetry: () => void;
}

export default function RoleResolutionErrorState({ onRetry }: RoleResolutionErrorStateProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full">
        <div className="bg-card border border-border rounded-lg p-8 text-center space-y-6 shadow-lg">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Unable to Determine Account Role</h2>
            <p className="text-muted-foreground">
              We couldn't verify your account role. This might be a temporary network issue. Please try again.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={onRetry}
              className="w-full"
              variant="default"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
            
            <Button
              onClick={() => navigate({ to: '/' })}
              className="w-full"
              variant="outline"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Lock } from 'lucide-react';

interface ReadOnlyPlaceholderPanelProps {
  title: string;
  description: string;
}

export default function ReadOnlyPlaceholderPanel({ title, description }: ReadOnlyPlaceholderPanelProps) {
  return (
    <div className="space-y-6">
      <Card className="shadow-md border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">{title}</CardTitle>
              <CardDescription className="mt-1">{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Alert className="border-primary/30 bg-primary/5">
            <Info className="h-4 w-4" />
            <AlertDescription>
              This feature is currently in development and will be available in a future update. 
              Stay tuned for more functionality!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Placeholder Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-sm opacity-60">
          <CardHeader>
            <CardTitle className="text-base">Feature Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm opacity-60">
          <CardHeader>
            <CardTitle className="text-base">Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

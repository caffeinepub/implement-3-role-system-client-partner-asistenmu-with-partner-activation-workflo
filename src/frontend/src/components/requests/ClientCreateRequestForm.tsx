import { useState, useMemo } from 'react';
import { useCreateRequest } from '../../hooks/useRequests';
import { useGetActiveSubscriptionsForCaller } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { BaseServiceType, SubscriptionRecord } from '../../backend';

interface ClientCreateRequestFormProps {
  open: boolean;
  onClose: () => void;
}

// Service type to English label mapping
const SERVICE_TYPE_LABELS: Record<BaseServiceType, string> = {
  [BaseServiceType.tenang]: 'Tenang',
  [BaseServiceType.rapi]: 'Rapi',
  [BaseServiceType.fokus]: 'Fokus',
  [BaseServiceType.jaga]: 'Jaga',
};

export default function ClientCreateRequestForm({ open, onClose }: ClientCreateRequestFormProps) {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [deadline, setDeadline] = useState('');
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<string>('');
  
  const createRequest = useCreateRequest();
  const { data: activeSubscriptions, isLoading: subscriptionsLoading } = useGetActiveSubscriptionsForCaller();

  // Group subscriptions by serviceType and get distinct types
  const { distinctServiceTypes, subscriptionsByType, autoSelectedSubscription } = useMemo(() => {
    if (!activeSubscriptions || activeSubscriptions.length === 0) {
      return { distinctServiceTypes: [], subscriptionsByType: new Map(), autoSelectedSubscription: null };
    }

    const byType = new Map<BaseServiceType, SubscriptionRecord[]>();
    activeSubscriptions.forEach(sub => {
      const existing = byType.get(sub.serviceType) || [];
      byType.set(sub.serviceType, [...existing, sub]);
    });

    const types = Array.from(byType.keys());
    
    // Auto-select if only one distinct service type
    let autoSelected: SubscriptionRecord | null = null;
    if (types.length === 1) {
      const subsForType = byType.get(types[0]) || [];
      // Pick the first subscription of that type
      autoSelected = subsForType[0] || null;
    }

    return {
      distinctServiceTypes: types,
      subscriptionsByType: byType,
      autoSelectedSubscription: autoSelected,
    };
  }, [activeSubscriptions]);

  const hasNoActiveSubscriptions = !subscriptionsLoading && (!activeSubscriptions || activeSubscriptions.length === 0);
  const showServiceDropdown = distinctServiceTypes.length > 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !details.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (hasNoActiveSubscriptions) {
      toast.error('You need an active subscription to create a request');
      return;
    }

    // Determine which subscription to use
    let subscriptionId: bigint;
    if (autoSelectedSubscription) {
      subscriptionId = autoSelectedSubscription.id;
    } else if (selectedSubscriptionId) {
      subscriptionId = BigInt(selectedSubscriptionId);
    } else {
      toast.error('Please select a service');
      return;
    }

    try {
      const result = await createRequest.mutateAsync({
        title: title.trim(),
        details: details.trim(),
        deadline: deadline ? BigInt(new Date(deadline).getTime() * 1000000) : undefined,
        subscriptionId,
      });

      toast.success(`Request created successfully! ID: ${result.id.toString()}`);
      setTitle('');
      setDetails('');
      setDeadline('');
      setSelectedSubscriptionId('');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create request');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Request</DialogTitle>
          <DialogDescription>
            Fill in the details for your service request
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {hasNoActiveSubscriptions && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                You need an active subscription to create a request. Please contact your administrator.
              </p>
            </div>
          )}

          {showServiceDropdown && (
            <div className="space-y-2">
              <Label htmlFor="service">Select Service *</Label>
              <Select
                value={selectedSubscriptionId}
                onValueChange={setSelectedSubscriptionId}
                disabled={subscriptionsLoading || hasNoActiveSubscriptions}
              >
                <SelectTrigger id="service">
                  <SelectValue placeholder="Choose a service" />
                </SelectTrigger>
                <SelectContent>
                  {distinctServiceTypes.map(serviceType => {
                    const subsForType = subscriptionsByType.get(serviceType) || [];
                    // Use the first subscription for this type
                    const sub = subsForType[0];
                    if (!sub) return null;
                    
                    const label = SERVICE_TYPE_LABELS[serviceType] || serviceType;
                    const remaining = Number(sub.quantity);
                    
                    return (
                      <SelectItem key={sub.id.toString()} value={sub.id.toString()}>
                        {label} — {remaining} remaining
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Request Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter request title"
              required
              disabled={hasNoActiveSubscriptions}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Request Details *</Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe your request in detail"
              rows={5}
              required
              disabled={hasNoActiveSubscriptions}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Request Deadline (Optional)</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              disabled={hasNoActiveSubscriptions}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createRequest.isPending || hasNoActiveSubscriptions || subscriptionsLoading}
            >
              {createRequest.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

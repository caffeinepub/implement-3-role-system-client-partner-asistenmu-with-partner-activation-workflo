import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, X, Plus, Loader2 } from 'lucide-react';
import { BaseServiceType, ServiceStatus, SubscriptionRecord } from '../../backend';
import { useCreateSubscription, useUpdateSubscription, useGetUserIdentity, useGetUserIdentities } from '../../hooks/useQueries';
import { validatePrincipal, normalizePrincipals } from '../../utils/principals';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';

interface SubscriptionManagementFormProps {
  subscription: SubscriptionRecord | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function SubscriptionManagementForm({ subscription, onCancel, onSuccess }: SubscriptionManagementFormProps) {
  const isEditMode = !!subscription;

  // Form state
  const [clientPrincipal, setClientPrincipal] = useState('');
  const [serviceType, setServiceType] = useState<BaseServiceType>(BaseServiceType.tenang);
  const [quantity, setQuantity] = useState('20');
  const [pricePerService, setPricePerService] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<ServiceStatus>(ServiceStatus.active);
  const [asistenmuPrincipal, setAsistenmuPrincipal] = useState('');
  const [sharedPrincipals, setSharedPrincipals] = useState<string[]>([]);
  const [newSharedPrincipal, setNewSharedPrincipal] = useState('');

  // Validation state
  const [clientError, setClientError] = useState('');
  const [asistenmuError, setAsistenmuError] = useState('');
  const [sharedError, setSharedError] = useState('');

  // Mutations
  const createMutation = useCreateSubscription();
  const updateMutation = useUpdateSubscription();

  // Identity resolution
  const clientIdentityQuery = useGetUserIdentity(clientPrincipal);
  const asistenmuIdentityQuery = useGetUserIdentity(asistenmuPrincipal);
  const sharedIdentitiesQuery = useGetUserIdentities(sharedPrincipals);

  // Initialize form with subscription data in edit mode
  useEffect(() => {
    if (subscription) {
      setClientPrincipal(subscription.client.toString());
      setServiceType(subscription.serviceType);
      setQuantity(Number(subscription.quantity).toString());
      setPricePerService(Number(subscription.pricePerService).toString());
      setStartDate(new Date(Number(subscription.startDate) / 1_000_000).toISOString().split('T')[0]);
      setEndDate(new Date(Number(subscription.endDate) / 1_000_000).toISOString().split('T')[0]);
      setStatus(subscription.status);
      setAsistenmuPrincipal(subscription.asistenmu ? subscription.asistenmu.toString() : '');
      setSharedPrincipals(subscription.sharedPrincipals.map(p => p.toString()));
    }
  }, [subscription]);

  // Validate client principal
  useEffect(() => {
    if (!clientPrincipal) {
      setClientError('');
      return;
    }

    const validation = validatePrincipal(clientPrincipal);
    if (!validation.valid) {
      setClientError(validation.error || 'Invalid principal');
      return;
    }

    if (clientIdentityQuery.data === null) {
      setClientError('User not found');
    } else if (clientIdentityQuery.data) {
      if (clientIdentityQuery.data.role.__kind__ !== 'client') {
        setClientError('Principal must have role "client"');
      } else {
        setClientError('');
      }
    }
  }, [clientPrincipal, clientIdentityQuery.data]);

  // Validate asistenmu principal
  useEffect(() => {
    if (!asistenmuPrincipal) {
      setAsistenmuError('');
      return;
    }

    const validation = validatePrincipal(asistenmuPrincipal);
    if (!validation.valid) {
      setAsistenmuError(validation.error || 'Invalid principal');
      return;
    }

    if (asistenmuIdentityQuery.data === null) {
      setAsistenmuError('User not found');
    } else if (asistenmuIdentityQuery.data) {
      if (asistenmuIdentityQuery.data.role.__kind__ !== 'asistenmu') {
        setAsistenmuError('Principal must have role "asistenmu"');
      } else {
        setAsistenmuError('');
      }
    }
  }, [asistenmuPrincipal, asistenmuIdentityQuery.data]);

  const handleAddSharedPrincipal = () => {
    if (!newSharedPrincipal.trim()) return;

    if (sharedPrincipals.length >= 6) {
      setSharedError('Maximum of 6 shared principals allowed');
      return;
    }

    const validation = validatePrincipal(newSharedPrincipal);
    if (!validation.valid) {
      setSharedError(validation.error || 'Invalid principal');
      return;
    }

    if (sharedPrincipals.includes(newSharedPrincipal.trim())) {
      setSharedError('Principal already added');
      return;
    }

    setSharedPrincipals([...sharedPrincipals, newSharedPrincipal.trim()]);
    setNewSharedPrincipal('');
    setSharedError('');
  };

  const handleRemoveSharedPrincipal = (index: number) => {
    setSharedPrincipals(sharedPrincipals.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!clientPrincipal || clientError) {
      toast.error('Please provide a valid client principal');
      return;
    }

    if (asistenmuPrincipal && asistenmuError) {
      toast.error('Please provide a valid Asistenmu principal or leave it empty');
      return;
    }

    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum < 20) {
      toast.error('Minimum service quantity is 20');
      return;
    }

    const priceNum = parseInt(pricePerService);
    if (isNaN(priceNum) || priceNum > 999_999_999) {
      toast.error('Price per service cannot exceed 9 digits');
      return;
    }

    if (!startDate || !endDate) {
      toast.error('Please provide start and end dates');
      return;
    }

    const startDateTime = new Date(startDate).getTime();
    const endDateTime = new Date(endDate).getTime();

    if (startDateTime > endDateTime) {
      toast.error('Start date must be before or equal to end date');
      return;
    }

    try {
      const clientPrincipalObj = Principal.fromText(clientPrincipal);
      const asistenmuPrincipalObj = asistenmuPrincipal ? Principal.fromText(asistenmuPrincipal) : null;
      const sharedPrincipalsObjs = normalizePrincipals(sharedPrincipals).map(p => Principal.fromText(p));

      if (isEditMode && subscription) {
        await updateMutation.mutateAsync({
          id: subscription.id,
          client: clientPrincipalObj,
          serviceType,
          quantity: BigInt(quantityNum),
          pricePerService: BigInt(priceNum),
          startDate: BigInt(startDateTime * 1_000_000),
          endDate: BigInt(endDateTime * 1_000_000),
          status,
          asistenmu: asistenmuPrincipalObj,
          sharedPrincipals: sharedPrincipalsObjs,
        });
        toast.success('Subscription updated successfully');
      } else {
        await createMutation.mutateAsync({
          client: clientPrincipalObj,
          serviceType,
          quantity: BigInt(quantityNum),
          pricePerService: BigInt(priceNum),
          startDate: BigInt(startDateTime * 1_000_000),
          endDate: BigInt(endDateTime * 1_000_000),
          status,
          asistenmu: asistenmuPrincipalObj,
          sharedPrincipals: sharedPrincipalsObjs,
        });
        toast.success('Subscription created successfully');
      }

      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save subscription');
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const canSubmit = !clientError && (!asistenmuPrincipal || !asistenmuError) && !isSubmitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Client Principal */}
      <div className="space-y-2">
        <Label htmlFor="clientPrincipal">Client Principal ID *</Label>
        <Input
          id="clientPrincipal"
          value={clientPrincipal}
          onChange={(e) => setClientPrincipal(e.target.value)}
          placeholder="Enter client principal ID"
          className={clientError ? 'border-red-500' : ''}
          required
        />
        {clientError && (
          <p className="text-sm text-red-500">{clientError}</p>
        )}
        {clientIdentityQuery.data && !clientError && (
          <div className="text-sm text-green-600 dark:text-green-400">
            ✓ {clientIdentityQuery.data.name} (Client)
          </div>
        )}
      </div>

      {/* Service Type */}
      <div className="space-y-2">
        <Label htmlFor="serviceType">Service Type *</Label>
        <Select value={serviceType} onValueChange={(value) => setServiceType(value as BaseServiceType)}>
          <SelectTrigger id="serviceType">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={BaseServiceType.tenang}>Tenang</SelectItem>
            <SelectItem value={BaseServiceType.rapi}>Rapi</SelectItem>
            <SelectItem value={BaseServiceType.fokus}>Fokus</SelectItem>
            <SelectItem value={BaseServiceType.jaga}>Jaga</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quantity and Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity (min 20) *</Label>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="20"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pricePerService">Price per Service (max 9 digits) *</Label>
          <Input
            id="pricePerService"
            type="number"
            value={pricePerService}
            onChange={(e) => setPricePerService(e.target.value)}
            max="999999999"
            required
          />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date *</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Select value={status} onValueChange={(value) => setStatus(value as ServiceStatus)}>
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ServiceStatus.active}>Active</SelectItem>
            <SelectItem value={ServiceStatus.hold}>Hold</SelectItem>
            <SelectItem value={ServiceStatus.suspended}>Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Asistenmu Principal (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="asistenmuPrincipal">Asistenmu Principal ID (Optional)</Label>
        <Input
          id="asistenmuPrincipal"
          value={asistenmuPrincipal}
          onChange={(e) => setAsistenmuPrincipal(e.target.value)}
          placeholder="Enter Asistenmu principal ID (optional)"
          className={asistenmuError ? 'border-red-500' : ''}
        />
        {asistenmuError && (
          <p className="text-sm text-red-500">{asistenmuError}</p>
        )}
        {asistenmuIdentityQuery.data && !asistenmuError && (
          <div className="text-sm text-green-600 dark:text-green-400">
            ✓ {asistenmuIdentityQuery.data.name} (Asistenmu)
          </div>
        )}
      </div>

      {/* Shared Principals */}
      <div className="space-y-2">
        <Label>Shared Principals (max 6)</Label>
        <div className="flex gap-2">
          <Input
            value={newSharedPrincipal}
            onChange={(e) => setNewSharedPrincipal(e.target.value)}
            placeholder="Enter principal ID to share"
            disabled={sharedPrincipals.length >= 6}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAddSharedPrincipal}
            disabled={sharedPrincipals.length >= 6 || !newSharedPrincipal.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {sharedError && (
          <p className="text-sm text-red-500">{sharedError}</p>
        )}
        {sharedPrincipals.length > 0 && (
          <div className="space-y-2 mt-4">
            {sharedPrincipals.map((principal, index) => {
              const identity = sharedIdentitiesQuery.data?.find(id => id.principal.toString() === principal);
              return (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                  <div className="flex-1">
                    <p className="font-mono text-xs">{principal.substring(0, 30)}...</p>
                    {identity ? (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        ✓ {identity.name} ({identity.role.__kind__})
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">Loading...</p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSharedPrincipal(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4">
        <Button
          type="submit"
          disabled={!canSubmit}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isEditMode ? 'Update Subscription' : 'Create Subscription'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

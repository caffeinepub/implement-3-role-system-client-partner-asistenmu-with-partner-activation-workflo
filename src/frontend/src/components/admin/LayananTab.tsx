import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SubscriptionsTable from './SubscriptionsTable';
import SubscriptionManagementForm from './SubscriptionManagementForm';
import { SubscriptionRecord } from '../../backend';

export default function LayananTab() {
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionRecord | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'list' | 'manage'>('list');

  const handleEdit = (subscription: SubscriptionRecord) => {
    setSelectedSubscription(subscription);
    setIsCreating(false);
    setActiveSubTab('manage');
  };

  const handleCreateNew = () => {
    setSelectedSubscription(null);
    setIsCreating(true);
    setActiveSubTab('manage');
  };

  const handleCancel = () => {
    setSelectedSubscription(null);
    setIsCreating(false);
    setActiveSubTab('list');
  };

  const handleSuccess = () => {
    setSelectedSubscription(null);
    setIsCreating(false);
    setActiveSubTab('list');
  };

  return (
    <Tabs value={activeSubTab} onValueChange={(value) => setActiveSubTab(value as 'list' | 'manage')} className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-flex">
        <TabsTrigger value="list" className="rounded-md px-4 py-2">
          Subscriptions
        </TabsTrigger>
        <TabsTrigger value="manage" className="rounded-md px-4 py-2" disabled={!isCreating && !selectedSubscription}>
          {isCreating ? 'Create New' : selectedSubscription ? 'Edit' : 'Create/Edit'}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="list" className="space-y-4">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Service Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <SubscriptionsTable onEdit={handleEdit} onCreateNew={handleCreateNew} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="manage" className="space-y-4">
        <Card className="shadow-md border-2 border-teal-500/30">
          <CardHeader>
            <CardTitle className="text-xl">
              {isCreating ? 'Create New Subscription' : 'Edit Subscription'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SubscriptionManagementForm
              subscription={selectedSubscription}
              onCancel={handleCancel}
              onSuccess={handleSuccess}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

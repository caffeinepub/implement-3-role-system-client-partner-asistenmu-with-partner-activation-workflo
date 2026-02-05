import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Copy, Check } from 'lucide-react';
import { UserProfile, SubscriptionSummary } from '../../backend';
import { useSaveCallerUserProfile } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { Identity } from '@dfinity/agent';
import { generateClientId } from './clientIds';
import CollapsibleSection from './CollapsibleSection';

interface ClientProfileSectionProps {
  profile: UserProfile | null | undefined;
  identity: Identity | undefined;
  subscriptionSummary: SubscriptionSummary | undefined;
  profileLoading: boolean;
  isFetched: boolean;
}

export default function ClientProfileSection({
  profile,
  identity,
  subscriptionSummary,
  profileLoading,
  isFetched,
}: ClientProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [whatsapp, setWhatsapp] = useState(profile?.whatsapp || '');
  const [company, setCompany] = useState(profile?.company || '');
  const [copiedClientId, setCopiedClientId] = useState(false);
  const [copiedPrincipalId, setCopiedPrincipalId] = useState(false);

  const saveProfile = useSaveCallerUserProfile();

  const principalId = identity?.getPrincipal().toString() || '';
  const clientId = generateClientId(principalId);

  const handleEdit = () => {
    setName(profile?.name || '');
    setEmail(profile?.email || '');
    setWhatsapp(profile?.whatsapp || '');
    setCompany(profile?.company || '');
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    if (!name.trim()) {
      toast.error('Nama wajib diisi');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        whatsapp: whatsapp.trim(),
        company: company.trim() || undefined,
      });
      toast.success('Profil berhasil diperbarui');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || 'Gagal memperbarui profil');
    }
  };

  const handleCopyClientId = async () => {
    await navigator.clipboard.writeText(clientId);
    setCopiedClientId(true);
    toast.success('ID Klien disalin');
    setTimeout(() => setCopiedClientId(false), 2000);
  };

  const handleCopyPrincipalId = async () => {
    await navigator.clipboard.writeText(principalId);
    setCopiedPrincipalId(true);
    toast.success('PrincipalId disalin');
    setTimeout(() => setCopiedPrincipalId(false), 2000);
  };

  const getSubscriptionStatusText = () => {
    if (!subscriptionSummary) return 'Tidak ada langganan';
    const active = Number(subscriptionSummary.activeSubscriptions);
    const total = Number(subscriptionSummary.totalSubscriptions);
    if (active > 0) {
      return `${active} aktif dari ${total} langganan`;
    }
    return total > 0 ? `${total} langganan (tidak aktif)` : 'Tidak ada langganan';
  };

  return (
    <CollapsibleSection title="Profil" defaultOpen={false}>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Client ID - Read Only */}
            <div className="space-y-2">
              <Label>ID Klien</Label>
              <div className="flex gap-2">
                <Input value={clientId} readOnly className="bg-muted" />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleCopyClientId}
                >
                  {copiedClientId ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Principal ID - Read Only */}
            <div className="space-y-2">
              <Label>PrincipalId</Label>
              <div className="flex gap-2">
                <Input
                  value={principalId}
                  readOnly
                  className="bg-muted font-mono text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleCopyPrincipalId}
                >
                  {copiedPrincipalId ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Name - Editable */}
            <div className="space-y-2">
              <Label htmlFor="name">Nama *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? 'bg-muted' : ''}
              />
            </div>

            {/* Email - Editable */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? 'bg-muted' : ''}
              />
            </div>

            {/* Whatsapp - Editable */}
            <div className="space-y-2">
              <Label htmlFor="whatsapp">Whatsapp</Label>
              <Input
                id="whatsapp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? 'bg-muted' : ''}
              />
            </div>

            {/* Company - Editable, Optional */}
            <div className="space-y-2">
              <Label htmlFor="company">Perusahaan/Usaha (Opsional)</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                disabled={!isEditing}
                className={!isEditing ? 'bg-muted' : ''}
              />
            </div>

            {/* Subscription Status - Read Only */}
            <div className="space-y-2">
              <Label>Status Langganan</Label>
              <Input
                value={getSubscriptionStatusText()}
                readOnly
                className="bg-muted"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              {!isEditing ? (
                <Button onClick={handleEdit} variant="default">
                  Edit
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleUpdate}
                    disabled={saveProfile.isPending}
                  >
                    {saveProfile.isPending && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    Perbarui
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    disabled={saveProfile.isPending}
                  >
                    Batal
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </CollapsibleSection>
  );
}

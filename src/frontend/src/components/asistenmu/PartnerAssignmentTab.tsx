import { useState } from 'react';
import { useGetAsistenmuRequests, useSearchPartners, useAssignTaskToPartner } from '../../hooks/useRequests';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, Send } from 'lucide-react';
import { toast } from 'sonner';
import type { Request, PartnerSearchResult } from '../../backend';

export default function PartnerAssignmentTab() {
  const { data: requests, isLoading: requestsLoading } = useGetAsistenmuRequests();
  const searchPartnersMutation = useSearchPartners();
  const assignMutation = useAssignTaskToPartner();

  const [selectedRequestId, setSelectedRequestId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PartnerSearchResult[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<PartnerSearchResult | null>(null);
  const [workBriefing, setWorkBriefing] = useState('');
  const [effectiveHours, setEffectiveHours] = useState('');
  const [workDeadline, setWorkDeadline] = useState('');
  const [gdriveLink, setGdriveLink] = useState('');

  // Filter only newly created requests
  const availableRequests = requests?.filter(
    (req) => req.status.__kind__ === 'newlyCreated'
  ) || [];

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Masukkan kata kunci pencarian');
      return;
    }

    try {
      const results = await searchPartnersMutation.mutateAsync({
        companyName: searchQuery,
        skills: searchQuery,
        minHourlyRate: undefined,
        maxHourlyRate: undefined,
      });
      setSearchResults(results);
      if (results.length === 0) {
        toast.info('Tidak ada partner ditemukan');
      }
    } catch (error) {
      toast.error('Gagal mencari partner');
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRequestId) {
      toast.error('Pilih ID Permintaan');
      return;
    }
    if (!selectedPartner) {
      toast.error('Pilih Partner');
      return;
    }
    if (!workBriefing.trim()) {
      toast.error('Masukkan Briefing Pekerjaan');
      return;
    }
    if (!effectiveHours || Number(effectiveHours) <= 0) {
      toast.error('Masukkan Jam Efektif yang valid');
      return;
    }

    try {
      const deadlineMs = workDeadline ? new Date(workDeadline).getTime() * 1_000_000 : null;
      
      await assignMutation.mutateAsync({
        requestId: BigInt(selectedRequestId),
        partnerId: selectedPartner.partnerId.toString(),
        workBriefing: `${workBriefing}\n\nLink GDrive: ${gdriveLink || 'Tidak ada'}`,
        effectiveHours: Number(effectiveHours),
        workDeadline: deadlineMs,
      });

      toast.success('Tugas berhasil dikirim ke Partner');
      
      // Reset form
      setSelectedRequestId('');
      setSelectedPartner(null);
      setSearchQuery('');
      setSearchResults([]);
      setWorkBriefing('');
      setEffectiveHours('');
      setWorkDeadline('');
      setGdriveLink('');
    } catch (error) {
      toast.error('Gagal mengirim tugas ke Partner');
      console.error(error);
    }
  };

  if (requestsLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Penugasan Partner</CardTitle>
        <CardDescription>Tugaskan permintaan client ke partner yang tersedia</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Request Selection */}
          <div className="space-y-2">
            <Label htmlFor="request">ID Permintaan *</Label>
            <Select value={selectedRequestId} onValueChange={setSelectedRequestId}>
              <SelectTrigger id="request">
                <SelectValue placeholder="Pilih permintaan..." />
              </SelectTrigger>
              <SelectContent>
                {availableRequests.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">Tidak ada permintaan baru</div>
                ) : (
                  availableRequests.map((req) => (
                    <SelectItem key={req.id.toString()} value={req.id.toString()}>
                      #{req.id.toString()} - {req.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Partner Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Cari Partner *</Label>
            <div className="flex gap-2">
              <Input
                id="search"
                placeholder="Cari berdasarkan nama/keahlian..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
              />
              <Button
                type="button"
                onClick={handleSearch}
                disabled={searchPartnersMutation.isPending}
              >
                {searchPartnersMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <Label>Hasil Pencarian</Label>
              <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
                {searchResults.map((partner) => (
                  <button
                    key={partner.partnerId.toString()}
                    type="button"
                    onClick={() => setSelectedPartner(partner)}
                    className={`w-full p-3 text-left hover:bg-accent transition-colors ${
                      selectedPartner?.partnerId.toString() === partner.partnerId.toString()
                        ? 'bg-accent'
                        : ''
                    }`}
                  >
                    <div className="font-medium">{partner.companyName}</div>
                    <div className="text-sm text-muted-foreground">
                      Rate: Rp {Number(partner.hourlyRate).toLocaleString('id-ID')}/jam | 
                      Selesai: {Number(partner.completedTasks)} | 
                      Ditolak: {Number(partner.rejectedTasks)}
                    </div>
                    {partner.skills.length > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Skills: {partner.skills.join(', ')}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selected Partner Display */}
          {selectedPartner && (
            <div className="p-3 bg-accent rounded-lg">
              <div className="text-sm font-medium">Partner Terpilih:</div>
              <div className="text-sm">{selectedPartner.companyName}</div>
            </div>
          )}

          {/* Work Briefing */}
          <div className="space-y-2">
            <Label htmlFor="briefing">Briefing Pekerjaan *</Label>
            <Textarea
              id="briefing"
              placeholder="Jelaskan detail pekerjaan yang harus dikerjakan..."
              value={workBriefing}
              onChange={(e) => setWorkBriefing(e.target.value)}
              rows={4}
            />
          </div>

          {/* Effective Hours */}
          <div className="space-y-2">
            <Label htmlFor="hours">Jam Efektif Pengerjaan *</Label>
            <Input
              id="hours"
              type="number"
              min="1"
              placeholder="Contoh: 8"
              value={effectiveHours}
              onChange={(e) => setEffectiveHours(e.target.value)}
            />
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline Pekerjaan</Label>
            <Input
              id="deadline"
              type="datetime-local"
              value={workDeadline}
              onChange={(e) => setWorkDeadline(e.target.value)}
            />
          </div>

          {/* GDrive Link */}
          <div className="space-y-2">
            <Label htmlFor="gdrive">Link Google Drive</Label>
            <Input
              id="gdrive"
              type="url"
              placeholder="https://drive.google.com/..."
              value={gdriveLink}
              onChange={(e) => setGdriveLink(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={assignMutation.isPending}
          >
            {assignMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Kirim Pekerjaan Ke Partner
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

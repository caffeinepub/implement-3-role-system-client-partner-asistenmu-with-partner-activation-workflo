import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Wrench, Eye, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Request } from '../../backend';
import { Skeleton } from '@/components/ui/skeleton';

interface ClientRequestSummaryCardsProps {
  requests: Request[];
  isLoading: boolean;
}

export default function ClientRequestSummaryCards({
  requests,
  isLoading,
}: ClientRequestSummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <Skeleton className="h-4 w-16" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const newCount = requests.filter(r => r.status.__kind__ === 'newlyCreated').length;
  const assignedCount = requests.filter(r => 
    r.status.__kind__ === 'offerSentToPartner' || r.status.__kind__ === 'assignedAsPartner'
  ).length;
  const inProgressCount = requests.filter(r => r.status.__kind__ === 'inProgressByPartner').length;
  const qaCount = requests.filter(r => r.status.__kind__ === 'qaRequestedByPartner').length;
  const revisionCount = requests.filter(r => r.status.__kind__ === 'revisionRequestedByAsistenmu').length;
  const completedCount = requests.filter(r => r.status.__kind__ === 'completedBYPartnerAndAsistenmu').length;
  const rejectedCount = requests.filter(r => r.recordStatus === 'rejected').length;

  const cards = [
    { title: 'Baru', count: newCount, icon: Clock, color: 'text-blue-600' },
    { title: 'Ditugaskan', count: assignedCount, icon: Wrench, color: 'text-purple-600' },
    { title: 'Dikerjakan', count: inProgressCount, icon: Wrench, color: 'text-indigo-600' },
    { title: 'QA', count: qaCount, icon: Eye, color: 'text-cyan-600' },
    { title: 'Revisi', count: revisionCount, icon: AlertCircle, color: 'text-amber-600' },
    { title: 'Selesai', count: completedCount, icon: CheckCircle2, color: 'text-green-600' },
    { title: 'Ditolak', count: rejectedCount, icon: XCircle, color: 'text-red-600' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon className={`w-4 h-4 ${card.color}`} />
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${card.color}`}>{card.count}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

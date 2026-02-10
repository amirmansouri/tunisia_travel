import EditTournamentClient from './EditTournamentClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EditTournamentPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <EditTournamentClient tournamentId={resolvedParams.id} />;
}

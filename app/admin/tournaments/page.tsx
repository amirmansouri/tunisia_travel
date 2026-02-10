import Link from 'next/link';
import { Plus, Edit, MapPin, Users } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import DeleteTournamentButton from '@/components/admin/DeleteTournamentButton';
import { createAdminClient } from '@/lib/supabase';
import { Tournament } from '@/types/database';
import { cn } from '@/lib/utils';

async function getTournaments(): Promise<(Tournament & { team_count: number })[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('tournaments' as never)
    .select('*')
    .order('created_at', { ascending: false })
    .returns<Tournament[]>();

  if (error) {
    console.error('Error fetching tournaments:', error);
    return [];
  }

  // Get team counts
  const results = [];
  for (const t of data || []) {
    const { count } = await supabase
      .from('tournament_teams' as never)
      .select('*', { count: 'exact', head: true })
      .eq('tournament_id', t.id);
    results.push({ ...t, team_count: count || 0 });
  }

  return results;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const statusColors: Record<string, string> = {
  registration: 'bg-blue-100 text-blue-700',
  pools: 'bg-amber-100 text-amber-700',
  knockout: 'bg-purple-100 text-purple-700',
  finished: 'bg-gray-100 text-gray-600',
};

const statusLabels: Record<string, string> = {
  registration: 'Registration',
  pools: 'Pool Stage',
  knockout: 'Knockout',
  finished: 'Finished',
};

export default async function AdminTournamentsPage() {
  const tournaments = await getTournaments();

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="lg:pl-64">
        <div className="pt-14 lg:pt-0">
          <AdminHeader
            title="Tournaments"
            description={`${tournaments.length} tournament(s)`}
            action={
              <Link href="/admin/tournaments/new" className="btn-primary">
                <Plus className="h-5 w-5 mr-2" />
                New Tournament
              </Link>
            }
          />

          <main className="p-4 sm:p-6 lg:p-8">
            {tournaments.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <h3 className="text-lg font-semibold text-gray-700">
                  No Tournaments Yet
                </h3>
                <p className="text-gray-500 mt-2">
                  Create your first pétanque tournament to get started.
                </p>
                <Link
                  href="/admin/tournaments/new"
                  className="btn-primary mt-6 inline-flex"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Tournament
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Tournament
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Teams
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Dates
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Published
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {tournaments.map((tournament) => (
                        <tr key={tournament.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900 line-clamp-1">
                              {tournament.name}
                            </div>
                            {tournament.location && (
                              <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                <MapPin className="h-3 w-3" />
                                {tournament.location}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                              statusColors[tournament.status]
                            )}>
                              {statusLabels[tournament.status]}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="flex items-center gap-1 text-sm text-gray-600">
                              <Users className="h-4 w-4" />
                              {tournament.team_count} / {tournament.max_teams}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {tournament.start_date ? (
                              <>
                                {new Date(tournament.start_date).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                                {tournament.end_date && (
                                  <> — {new Date(tournament.end_date).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'short',
                                  })}</>
                                )}
                              </>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                              tournament.is_published
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-600'
                            )}>
                              {tournament.is_published ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Link
                                href={`/admin/tournaments/edit/${tournament.id}`}
                                className="p-2 text-gray-500 hover:text-tunisia-sand transition-colors"
                                title="Edit"
                              >
                                <Edit className="h-5 w-5" />
                              </Link>
                              <DeleteTournamentButton tournamentId={tournament.id} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

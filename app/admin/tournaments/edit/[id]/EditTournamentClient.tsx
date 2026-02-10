'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import TournamentForm from '@/components/admin/TournamentForm';
import TournamentTeams from '@/components/admin/TournamentTeams';
import TournamentMatches from '@/components/admin/TournamentMatches';
import TournamentStandings from '@/components/admin/TournamentStandings';
import { Tournament, TournamentTeam, TournamentMatch, TournamentStanding } from '@/types/database';
import { cn } from '@/lib/utils';

interface EditTournamentClientProps {
  tournamentId: string;
}

type Tab = 'details' | 'teams' | 'matches' | 'standings';

export default function EditTournamentClient({ tournamentId }: EditTournamentClientProps) {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [teams, setTeams] = useState<TournamentTeam[]>([]);
  const [matches, setMatches] = useState<TournamentMatch[]>([]);
  const [standings, setStandings] = useState<TournamentStanding[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [tournamentRes, teamsRes, matchesRes, standingsRes] = await Promise.all([
        fetch(`/api/tournaments/${tournamentId}`),
        fetch(`/api/tournaments/${tournamentId}/teams`),
        fetch(`/api/tournaments/${tournamentId}/matches`),
        fetch(`/api/tournaments/${tournamentId}/standings`),
      ]);

      if (tournamentRes.ok) {
        const data = await tournamentRes.json();
        setTournament(data);
      }
      if (teamsRes.ok) {
        const data = await teamsRes.json();
        setTeams(Array.isArray(data) ? data : []);
      }
      if (matchesRes.ok) {
        const data = await matchesRes.json();
        setMatches(Array.isArray(data) ? data : []);
      }
      if (standingsRes.ok) {
        const data = await standingsRes.json();
        setStandings(Array.isArray(data) ? data : []);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, [tournamentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const handleFocus = () => fetchData();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminSidebar />
        <div className="lg:pl-64 pt-14 lg:pt-0">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tunisia-red"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminSidebar />
        <div className="lg:pl-64 pt-14 lg:pt-0">
          <div className="text-center py-20 text-gray-500">Tournament not found.</div>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'details', label: 'Details' },
    { key: 'teams', label: 'Teams', count: teams.length },
    { key: 'matches', label: 'Matches', count: matches.length },
    { key: 'standings', label: 'Standings' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="lg:pl-64">
        <div className="pt-14 lg:pt-0">
          <AdminHeader
            title="Edit Tournament"
            description={tournament.name}
          />

          <main className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
              <Link
                href="/admin/tournaments"
                className="inline-flex items-center text-gray-600 hover:text-tunisia-red transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tournaments
              </Link>
            </div>

            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key);
                      if (tab.key !== 'details') fetchData();
                    }}
                    className={cn(
                      'py-3 px-1 border-b-2 font-medium text-sm transition-colors',
                      activeTab === tab.key
                        ? 'border-tunisia-red text-tunisia-red'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    )}
                  >
                    {tab.label}
                    {tab.count !== undefined && (
                      <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'details' && (
              <TournamentForm tournament={tournament} mode="edit" />
            )}

            {activeTab === 'teams' && (
              <TournamentTeams
                tournamentId={tournament.id}
                teams={teams}
                numPools={tournament.num_pools}
              />
            )}

            {activeTab === 'matches' && (
              <TournamentMatches
                tournamentId={tournament.id}
                matches={matches}
              />
            )}

            {activeTab === 'standings' && (
              <TournamentStandings standings={standings} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

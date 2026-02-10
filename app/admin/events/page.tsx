import Link from 'next/link';
import { Plus, Edit, Calendar, Trophy, MapPin } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import DeleteEventButton from '@/components/admin/DeleteEventButton';
import LiveEventsToggle from '@/components/admin/LiveEventsToggle';
import { createAdminClient } from '@/lib/supabase';
import { LiveEvent } from '@/types/database';
import { cn } from '@/lib/utils';

async function getEvents(): Promise<LiveEvent[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('live_events')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }

  return data || [];
}

async function getLiveEventsEnabled(): Promise<boolean> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('site_settings' as never)
    .select('value')
    .eq('key', 'live_events_enabled')
    .single<{ value: { enabled: boolean } }>();

  return !!data?.value?.enabled;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const statusColors: Record<string, string> = {
  upcoming: 'bg-blue-100 text-blue-700',
  live: 'bg-red-100 text-red-700',
  halftime: 'bg-yellow-100 text-yellow-700',
  finished: 'bg-gray-100 text-gray-600',
};

const statusLabels: Record<string, string> = {
  upcoming: 'A venir',
  live: 'En Direct',
  halftime: 'Mi-temps',
  finished: 'Terminé',
};

export default async function AdminEventsPage() {
  const [events, enabled] = await Promise.all([
    getEvents(),
    getLiveEventsEnabled(),
  ]);

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="lg:pl-64">
        <div className="pt-14 lg:pt-0">
          <AdminHeader
            title="Live Events"
            description={`${events.length} events`}
            action={
              <Link href="/admin/events/new" className="btn-primary">
                <Plus className="h-5 w-5 mr-2" />
                New Event
              </Link>
            }
          />

          <main className="p-4 sm:p-6 lg:p-8">
            {/* Global Toggle */}
            <div className="mb-6">
              <LiveEventsToggle initialEnabled={enabled} />
            </div>

            {events.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <h3 className="text-lg font-semibold text-gray-700">
                  No Events Yet
                </h3>
                <p className="text-gray-500 mt-2">
                  Create your first event to get started.
                </p>
                <Link
                  href="/admin/events/new"
                  className="btn-primary mt-6 inline-flex"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Event
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Event
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Active
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {events.map((event) => (
                        <tr key={event.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900 line-clamp-1">
                              {event.name}
                            </div>
                            {event.event_type === 'match' && event.team_a && event.team_b && (
                              <div className="text-sm text-gray-500 mt-1">
                                {event.team_a} {event.score_a} - {event.score_b} {event.team_b}
                              </div>
                            )}
                            {event.location && (
                              <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
                              event.event_type === 'match'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-blue-100 text-blue-700'
                            )}>
                              {event.event_type === 'match' ? (
                                <><Trophy className="h-3 w-3" /> Match</>
                              ) : (
                                <><Calendar className="h-3 w-3" /> General</>
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(event.event_date).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="px-6 py-4">
                            {event.event_type === 'match' && event.match_status ? (
                              <span className={cn(
                                'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                                statusColors[event.match_status]
                              )}>
                                {event.match_status === 'live' && (
                                  <span className="relative flex h-2 w-2 mr-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                  </span>
                                )}
                                {statusLabels[event.match_status]}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                              event.is_active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-600'
                            )}>
                              {event.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Link
                                href={`/admin/events/edit/${event.id}`}
                                className="p-2 text-gray-500 hover:text-tunisia-sand transition-colors"
                                title="Edit"
                              >
                                <Edit className="h-5 w-5" />
                              </Link>
                              <DeleteEventButton eventId={event.id} />
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

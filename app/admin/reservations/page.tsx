import { Mail, Phone, Calendar, MessageSquare } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { createAdminClient } from '@/lib/supabase';
import { Reservation, ReservationWithProgram } from '@/types/database';
import { formatDate } from '@/lib/utils';

async function getReservations(): Promise<ReservationWithProgram[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('Error fetching reservations:', error);
    return [];
  }

  const reservations = data as Reservation[];

  // Fetch associated programs
  const programIds = [...new Set(reservations.map((r) => r.program_id))];
  const { data: programs } = await supabase
    .from('programs')
    .select('*')
    .in('id', programIds);

  // Map programs to reservations
  return reservations.map((reservation) => ({
    ...reservation,
    program: programs?.find((p) => p.id === reservation.program_id),
  }));
}

export const dynamic = 'force-dynamic';

export default async function AdminReservationsPage() {
  const reservations = await getReservations();

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="lg:pl-64">
        <div className="pt-14 lg:pt-0">
          <AdminHeader
            title="Reservations"
            description={`${reservations.length} reservation requests`}
          />

          <main className="p-4 sm:p-6 lg:p-8">
            {reservations.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <h3 className="text-lg font-semibold text-gray-700">
                  No Reservations Yet
                </h3>
                <p className="text-gray-500 mt-2">
                  Reservation requests will appear here when customers submit
                  them.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="bg-white rounded-xl shadow-sm p-6"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      {/* Customer Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {reservation.full_name}
                        </h3>

                        <div className="mt-3 space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 text-gray-400 mr-2" />
                            <a
                              href={`mailto:${reservation.email}`}
                              className="text-tunisia-blue hover:underline"
                            >
                              {reservation.email}
                            </a>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-gray-400 mr-2" />
                            <a
                              href={`tel:${reservation.phone}`}
                              className="text-tunisia-blue hover:underline"
                            >
                              {reservation.phone}
                            </a>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            <span>
                              Submitted {formatDate(reservation.created_at)}
                            </span>
                          </div>
                        </div>

                        {reservation.message && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-start">
                              <MessageSquare className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                              <p className="text-sm text-gray-600">
                                {reservation.message}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Program Info */}
                      <div className="lg:w-80 lg:border-l lg:pl-6">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Program
                        </p>
                        {reservation.program ? (
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {reservation.program.title}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              {reservation.program.location}
                            </p>
                            <p className="text-sm font-semibold text-tunisia-red mt-2">
                              {new Intl.NumberFormat('en-TN', {
                                style: 'currency',
                                currency: 'TND',
                              }).format(reservation.program.price)}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 italic">
                            Program not found
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 pt-4 border-t flex flex-wrap gap-3">
                      <a
                        href={`mailto:${reservation.email}?subject=Re: Your Tunisia Travel Reservation - ${reservation.program?.title || 'Inquiry'}`}
                        className="btn-primary text-sm"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Reply via Email
                      </a>
                      <a
                        href={`tel:${reservation.phone}`}
                        className="btn-secondary text-sm"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

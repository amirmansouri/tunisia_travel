import { Globe, Monitor, MapPin, Clock } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { createAdminClient } from '@/lib/supabase';

interface Visitor {
  id: string;
  ip_address: string;
  user_agent: string;
  country: string | null;
  city: string | null;
  created_at: string;
}

async function getVisitors(): Promise<Visitor[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('visitors')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    console.error('Error fetching visitors:', error);
    return [];
  }

  return (data || []) as Visitor[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getDeviceType(userAgent: string): string {
  if (/mobile/i.test(userAgent)) return 'Mobile';
  if (/tablet/i.test(userAgent)) return 'Tablet';
  return 'Desktop';
}

function getBrowser(userAgent: string): string {
  if (/chrome/i.test(userAgent) && !/edge/i.test(userAgent)) return 'Chrome';
  if (/firefox/i.test(userAgent)) return 'Firefox';
  if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return 'Safari';
  if (/edge/i.test(userAgent)) return 'Edge';
  if (/opera|opr/i.test(userAgent)) return 'Opera';
  return 'Other';
}

function getCountryFlag(countryCode: string | null): string {
  if (!countryCode || countryCode.length !== 2) return '';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminVisitorsPage() {
  const visitors = await getVisitors();

  // Calculate stats
  const uniqueIPs = new Set(visitors.map((v) => v.ip_address)).size;
  const todayVisits = visitors.filter((v) => {
    const visitDate = new Date(v.created_at);
    const today = new Date();
    return visitDate.toDateString() === today.toDateString();
  }).length;

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="lg:pl-64">
        <div className="pt-14 lg:pt-0">
          <AdminHeader
            title="Visitors"
            description={`${visitors.length} total visits tracked`}
          />

          <main className="p-4 sm:p-6 lg:p-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Globe className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Total Visits</p>
                    <p className="text-2xl font-bold text-gray-900">{visitors.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Monitor className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Unique Visitors</p>
                    <p className="text-2xl font-bold text-gray-900">{uniqueIPs}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Today</p>
                    <p className="text-2xl font-bold text-gray-900">{todayVisits}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visitors Table */}
            {visitors.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <Globe className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700">
                  No Visitors Yet
                </h3>
                <p className="text-gray-500 mt-2">
                  Visitor data will appear here when people visit your site.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          IP Address
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Device
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {visitors.map((visitor) => (
                        <tr key={visitor.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(visitor.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-mono text-gray-900">
                              {visitor.ip_address}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {visitor.country || visitor.city ? (
                              <div className="flex items-center text-sm text-gray-600">
                                <span className="text-xl mr-2">{getCountryFlag(visitor.country)}</span>
                                {[visitor.city, visitor.country].filter(Boolean).join(', ')}
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-600">
                              {getDeviceType(visitor.user_agent)} / {getBrowser(visitor.user_agent)}
                            </span>
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

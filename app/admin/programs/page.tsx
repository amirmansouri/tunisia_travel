import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import ProgramImport from '@/components/admin/ProgramImport';
import { createAdminClient } from '@/lib/supabase';
import { Program } from '@/types/database';
import { formatPrice, formatDateRange } from '@/lib/utils';
import DeleteProgramButton from '@/components/admin/DeleteProgramButton';
import TogglePublishButton from '@/components/admin/TogglePublishButton';

async function getPrograms(): Promise<Program[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching programs:', error);
    return [];
  }

  return data || [];
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminProgramsPage() {
  const programs = await getPrograms();

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="lg:pl-64">
        <div className="pt-14 lg:pt-0">
          <AdminHeader
            title="Programs"
            description={`${programs.length} travel programs`}
            action={
              <Link href="/admin/programs/new" className="btn-primary">
                <Plus className="h-5 w-5 mr-2" />
                New Program
              </Link>
            }
          />

          <main className="p-4 sm:p-6 lg:p-8">
            {/* Import/Export Section */}
            <div className="mb-6">
              <ProgramImport />
            </div>

            {programs.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <h3 className="text-lg font-semibold text-gray-700">
                  No Programs Yet
                </h3>
                <p className="text-gray-500 mt-2">
                  Create your first travel program to get started.
                </p>
                <Link
                  href="/admin/programs/new"
                  className="btn-primary mt-6 inline-flex"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Program
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Program
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Dates
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {programs.map((program) => (
                        <tr key={program.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="relative h-12 w-16 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={
                                    program.images[0] ||
                                    '/images/placeholder.jpg'
                                  }
                                  alt={program.title}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-900 line-clamp-1">
                                  {program.title}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {program.location}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {formatDateRange(
                              program.start_date,
                              program.end_date
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {formatPrice(program.price)}
                          </td>
                          <td className="px-6 py-4">
                            <TogglePublishButton
                              programId={program.id}
                              published={program.published}
                            />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Link
                                href={`/programs/${program.id}`}
                                target="_blank"
                                className="p-2 text-gray-500 hover:text-tunisia-blue transition-colors"
                                title="View"
                              >
                                <Eye className="h-5 w-5" />
                              </Link>
                              <Link
                                href={`/admin/programs/edit/${program.id}`}
                                className="p-2 text-gray-500 hover:text-tunisia-sand transition-colors"
                                title="Edit"
                              >
                                <Edit className="h-5 w-5" />
                              </Link>
                              <DeleteProgramButton programId={program.id} />
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

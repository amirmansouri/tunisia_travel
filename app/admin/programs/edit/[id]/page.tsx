import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import ProgramForm from '@/components/admin/ProgramForm';
import { createAdminClient } from '@/lib/supabase';
import { Program } from '@/types/database';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getProgram(id: string): Promise<Program | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EditProgramPage({ params }: PageProps) {
  const resolvedParams = await params;
  const program = await getProgram(resolvedParams.id);

  if (!program) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="lg:pl-64">
        <div className="pt-14 lg:pt-0">
          <AdminHeader
            title="Edit Program"
            description={program.title}
          />

          <main className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
              <Link
                href="/admin/programs"
                className="inline-flex items-center text-gray-600 hover:text-tunisia-red transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Programs
              </Link>
            </div>

            <ProgramForm program={program} mode="edit" />
          </main>
        </div>
      </div>
    </div>
  );
}

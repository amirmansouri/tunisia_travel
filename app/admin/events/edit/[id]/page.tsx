import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import EventForm from '@/components/admin/EventForm';
import { createAdminClient } from '@/lib/supabase';
import { LiveEvent } from '@/types/database';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getEvent(id: string): Promise<LiveEvent | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('live_events')
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

export default async function EditEventPage({ params }: PageProps) {
  const resolvedParams = await params;
  const event = await getEvent(resolvedParams.id);

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="lg:pl-64">
        <div className="pt-14 lg:pt-0">
          <AdminHeader
            title="Edit Event"
            description={event.name}
          />

          <main className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
              <Link
                href="/admin/events"
                className="inline-flex items-center text-gray-600 hover:text-tunisia-red transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
              </Link>
            </div>

            <EventForm event={event} mode="edit" />
          </main>
        </div>
      </div>
    </div>
  );
}

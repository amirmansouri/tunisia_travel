import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import EventForm from '@/components/admin/EventForm';

export default function NewEventPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="lg:pl-64">
        <div className="pt-14 lg:pt-0">
          <AdminHeader
            title="Create New Event"
            description="Add a new live event"
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

            <EventForm mode="create" />
          </main>
        </div>
      </div>
    </div>
  );
}

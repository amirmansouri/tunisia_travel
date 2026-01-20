'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Phone, Calendar, MessageSquare, MoreVertical, Trash2, StickyNote } from 'lucide-react';
import { ReservationWithProgram, ReservationStatus } from '@/types/database';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ReservationCardProps {
  reservation: ReservationWithProgram;
}

const statusConfig: Record<ReservationStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  confirmed: { label: 'Confirmed', color: 'text-blue-700', bg: 'bg-blue-100' },
  completed: { label: 'Completed', color: 'text-green-700', bg: 'bg-green-100' },
  cancelled: { label: 'Cancelled', color: 'text-red-700', bg: 'bg-red-100' },
};

export default function ReservationCard({ reservation }: ReservationCardProps) {
  const router = useRouter();
  const [status, setStatus] = useState<ReservationStatus>(reservation.status || 'pending');
  const [notes, setNotes] = useState(reservation.admin_notes || '');
  const [showNotes, setShowNotes] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [updating, setUpdating] = useState(false);

  const updateStatus = async (newStatus: ReservationStatus) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/reservations/${reservation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setStatus(newStatus);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdating(false);
      setShowMenu(false);
    }
  };

  const saveNotes = async () => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/reservations/${reservation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_notes: notes }),
      });

      if (response.ok) {
        setShowNotes(false);
      }
    } catch (error) {
      console.error('Failed to save notes:', error);
    } finally {
      setUpdating(false);
    }
  };

  const deleteReservation = async () => {
    if (!confirm('Are you sure you want to delete this reservation?')) return;

    try {
      const response = await fetch(`/api/admin/reservations/${reservation.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const currentStatus = statusConfig[status];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        {/* Customer Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {reservation.full_name}
              </h3>
              <span className={cn(
                'inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium',
                currentStatus.bg,
                currentStatus.color
              )}>
                {currentStatus.label}
              </span>
            </div>

            {/* Status Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical className="h-5 w-5 text-gray-500" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border z-20 py-1">
                    <p className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                      Change Status
                    </p>
                    {(Object.keys(statusConfig) as ReservationStatus[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(s)}
                        disabled={updating}
                        className={cn(
                          'w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center',
                          status === s && 'bg-gray-50 font-medium'
                        )}
                      >
                        <span className={cn('w-2 h-2 rounded-full mr-2', statusConfig[s].bg.replace('100', '500'))} />
                        {statusConfig[s].label}
                      </button>
                    ))}
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setShowNotes(true);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                    >
                      <StickyNote className="h-4 w-4 mr-2 text-gray-500" />
                      Add Notes
                    </button>
                    <button
                      onClick={deleteReservation}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

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

          {/* Admin Notes */}
          {(reservation.admin_notes || showNotes) && (
            <div className="mt-4">
              {showNotes ? (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    rows={3}
                    placeholder="Add internal notes about this reservation..."
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={saveNotes}
                      disabled={updating}
                      className="btn-primary text-sm py-1.5"
                    >
                      Save Notes
                    </button>
                    <button
                      onClick={() => setShowNotes(false)}
                      className="btn-outline text-sm py-1.5"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : reservation.admin_notes ? (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start">
                    <StickyNote className="h-4 w-4 text-yellow-600 mr-2 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-yellow-700 uppercase mb-1">Admin Notes</p>
                      <p className="text-sm text-gray-700">{reservation.admin_notes}</p>
                    </div>
                  </div>
                </div>
              ) : null}
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
          href={`mailto:${reservation.email}?subject=Re: Your Arivo Travel Reservation - ${reservation.program?.title || 'Inquiry'}`}
          className="btn-primary text-sm"
        >
          <Mail className="h-4 w-4 mr-2" />
          Reply via Email
        </a>
        <a
          href={`https://wa.me/${reservation.phone.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-sm"
        >
          <Phone className="h-4 w-4 mr-2" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}

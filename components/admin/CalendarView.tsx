'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Program, ReservationWithProgram } from '@/types/database';

interface CalendarViewProps {
  programs: Program[];
  reservations: ReservationWithProgram[];
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface CalendarEvent {
  id: string;
  title: string;
  type: 'program-start' | 'program-end' | 'reservation';
  color: string;
  programId?: string;
}

export default function CalendarView({ programs, reservations }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get the first day of the month and total days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDay = firstDayOfMonth.getDay();

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  }, [startingDay, daysInMonth]);

  // Map events to dates
  const eventsByDate = useMemo(() => {
    const events: Record<string, CalendarEvent[]> = {};

    // Add program start and end dates
    programs.forEach((program) => {
      const startDate = new Date(program.start_date).toISOString().split('T')[0];
      const endDate = new Date(program.end_date).toISOString().split('T')[0];

      if (!events[startDate]) events[startDate] = [];
      events[startDate].push({
        id: `${program.id}-start`,
        title: program.title,
        type: 'program-start',
        color: 'bg-green-500',
        programId: program.id,
      });

      if (!events[endDate]) events[endDate] = [];
      events[endDate].push({
        id: `${program.id}-end`,
        title: program.title,
        type: 'program-end',
        color: 'bg-red-500',
        programId: program.id,
      });
    });

    // Add reservation dates
    reservations.forEach((reservation) => {
      const date = new Date(reservation.created_at).toISOString().split('T')[0];
      if (!events[date]) events[date] = [];
      events[date].push({
        id: reservation.id,
        title: `${reservation.full_name} - ${reservation.program?.title || 'Unknown'}`,
        type: 'reservation',
        color: reservation.status === 'confirmed' ? 'bg-blue-500' :
               reservation.status === 'completed' ? 'bg-green-500' :
               reservation.status === 'cancelled' ? 'bg-gray-400' : 'bg-yellow-500',
      });
    });

    return events;
  }, [programs, reservations]);

  const getDateKey = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const today = new Date();
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const getEventsForSelectedDate = () => {
    if (!selectedDate) return [];
    const dateKey = selectedDate.toISOString().split('T')[0];
    return eventsByDate[dateKey] || [];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">
              {MONTHS[month]} {year}
            </h2>
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Today
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b">
          {DAYS.map((day) => (
            <div
              key={day}
              className="py-3 text-center text-sm font-semibold text-gray-600 bg-gray-50"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const dateKey = day ? getDateKey(day) : null;
            const events = dateKey ? eventsByDate[dateKey] || [] : [];
            const isSelected = selectedDate && day &&
              selectedDate.getDate() === day &&
              selectedDate.getMonth() === month &&
              selectedDate.getFullYear() === year;

            return (
              <div
                key={index}
                onClick={() => day && setSelectedDate(new Date(year, month, day))}
                className={cn(
                  'min-h-[100px] p-2 border-r border-b cursor-pointer transition-colors',
                  day ? 'hover:bg-gray-50' : 'bg-gray-50',
                  isSelected && 'bg-tunisia-red/5',
                  index % 7 === 6 && 'border-r-0'
                )}
              >
                {day && (
                  <>
                    <div
                      className={cn(
                        'w-7 h-7 flex items-center justify-center text-sm rounded-full mb-1',
                        isToday(day) && 'bg-tunisia-red text-white font-bold',
                        isSelected && !isToday(day) && 'bg-tunisia-red/20 text-tunisia-red font-semibold'
                      )}
                    >
                      {day}
                    </div>
                    <div className="space-y-1">
                      {events.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className={cn(
                            'text-xs px-1.5 py-0.5 rounded truncate text-white',
                            event.color
                          )}
                          title={event.title}
                        >
                          {event.type === 'program-start' && '▶ '}
                          {event.type === 'program-end' && '◼ '}
                          {event.title}
                        </div>
                      ))}
                      {events.length > 3 && (
                        <div className="text-xs text-gray-500 px-1.5">
                          +{events.length - 3} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Details Sidebar */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {selectedDate
            ? selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })
            : 'Select a date'}
        </h3>

        {selectedDate ? (
          getEventsForSelectedDate().length > 0 ? (
            <div className="space-y-3">
              {getEventsForSelectedDate().map((event) => (
                <div
                  key={event.id}
                  className={cn(
                    'p-3 rounded-lg border-l-4',
                    event.type === 'program-start' && 'border-l-green-500 bg-green-50',
                    event.type === 'program-end' && 'border-l-red-500 bg-red-50',
                    event.type === 'reservation' && 'border-l-blue-500 bg-blue-50'
                  )}
                >
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    {event.type === 'program-start' && (
                      <span className="text-green-600 font-medium">Program Start</span>
                    )}
                    {event.type === 'program-end' && (
                      <span className="text-red-600 font-medium">Program End</span>
                    )}
                    {event.type === 'reservation' && (
                      <span className="text-blue-600 font-medium">Reservation</span>
                    )}
                  </div>
                  <p className="font-medium text-gray-900">{event.title}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No events on this date</p>
          )
        ) : (
          <p className="text-gray-500 text-sm">
            Click on a date to see events
          </p>
        )}

        {/* Legend */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Legend</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500" />
              <span className="text-gray-600">Program Start</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500" />
              <span className="text-gray-600">Program End</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-yellow-500" />
              <span className="text-gray-600">Pending Reservation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500" />
              <span className="text-gray-600">Confirmed Reservation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

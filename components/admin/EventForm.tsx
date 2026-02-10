'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { LiveEvent, EventType, MatchStatus } from '@/types/database';

const matchStatuses: { value: MatchStatus; label: string }[] = [
  { value: 'upcoming', label: 'A venir' },
  { value: 'live', label: 'En Direct' },
  { value: 'halftime', label: 'Mi-temps' },
  { value: 'finished', label: 'Terminé' },
];

interface EventFormProps {
  event?: LiveEvent;
  mode: 'create' | 'edit';
}

export default function EventForm({ event, mode }: EventFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    event_type: (event?.event_type || 'match') as EventType,
    name: event?.name || '',
    description: event?.description || '',
    location: event?.location || '',
    event_date: event?.event_date
      ? new Date(event.event_date).toISOString().slice(0, 16)
      : '',
    image_url: event?.image_url || '',
    is_active: event?.is_active ?? true,
    team_a: event?.team_a || '',
    team_b: event?.team_b || '',
    score_a: event?.score_a ?? 0,
    score_b: event?.score_b ?? 0,
    match_status: (event?.match_status || 'upcoming') as MatchStatus,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
          ? parseInt(value) || 0
          : value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url =
        mode === 'create'
          ? '/api/events'
          : `/api/events/${event?.id}`;

      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          event_date: new Date(formData.event_date).toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${mode} event`);
      }

      router.push('/admin/events');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Event Type */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Event Type</h2>
        <div className="flex gap-4">
          {(['match', 'general'] as EventType[]).map((type) => (
            <label
              key={type}
              className={`flex-1 p-4 border-2 rounded-xl cursor-pointer text-center transition-colors ${
                formData.event_type === type
                  ? 'border-tunisia-red bg-tunisia-red/5 text-tunisia-red'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="event_type"
                value={type}
                checked={formData.event_type === type}
                onChange={handleChange}
                className="sr-only"
              />
              <div className="text-2xl mb-1">{type === 'match' ? '🏆' : '📅'}</div>
              <div className="font-semibold capitalize">{type === 'match' ? 'Match' : 'General'}</div>
              <div className="text-sm text-gray-500 mt-1">
                {type === 'match'
                  ? 'Team A vs Team B with scores'
                  : 'General event with details'}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Event Details</h2>
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="label">Event Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input"
              placeholder={formData.event_type === 'match' ? 'e.g., Tournoi Pétanque Cannes' : 'e.g., Soirée Beach Party'}
            />
          </div>

          <div>
            <label htmlFor="description" className="label">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="input resize-none"
              placeholder="Describe the event..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="location" className="label">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input"
                placeholder="e.g., Cannes, France"
              />
            </div>

            <div>
              <label htmlFor="event_date" className="label">Date & Time *</label>
              <input
                type="datetime-local"
                id="event_date"
                name="event_date"
                value={formData.event_date}
                onChange={handleChange}
                required
                className="input"
              />
            </div>
          </div>

          <div>
            <label htmlFor="image_url" className="label">Image URL</label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="input"
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      {/* Match-specific Fields */}
      {formData.event_type === 'match' && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Match Details</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="team_a" className="label">Team A *</label>
                <input
                  type="text"
                  id="team_a"
                  name="team_a"
                  value={formData.team_a}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., Équipe Cannes"
                />
              </div>
              <div>
                <label htmlFor="team_b" className="label">Team B *</label>
                <input
                  type="text"
                  id="team_b"
                  name="team_b"
                  value={formData.team_b}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., Équipe Nice"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="score_a" className="label">Score A</label>
                <input
                  type="number"
                  id="score_a"
                  name="score_a"
                  value={formData.score_a}
                  onChange={handleChange}
                  min="0"
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="score_b" className="label">Score B</label>
                <input
                  type="number"
                  id="score_b"
                  name="score_b"
                  value={formData.score_b}
                  onChange={handleChange}
                  min="0"
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="match_status" className="label">Match Status</label>
                <select
                  id="match_status"
                  name="match_status"
                  value={formData.match_status}
                  onChange={handleChange}
                  className="input"
                >
                  {matchStatuses.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Status */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="w-5 h-5 text-tunisia-red rounded border-gray-300 focus:ring-tunisia-red"
          />
          <span className="font-medium text-gray-700">Active Event</span>
        </label>
        <p className="text-sm text-gray-500 mt-2 ml-8">
          Active events will be shown to visitors when the global toggle is enabled.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              {mode === 'create' ? 'Creating...' : 'Saving...'}
            </>
          ) : mode === 'create' ? (
            'Create Event'
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </form>
  );
}

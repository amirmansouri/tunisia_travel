'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Tournament, TournamentStatus } from '@/types/database';

const statuses: { value: TournamentStatus; label: string }[] = [
  { value: 'registration', label: 'Registration Open' },
  { value: 'pools', label: 'Pool Stage' },
  { value: 'knockout', label: 'Knockout Stage' },
  { value: 'finished', label: 'Finished' },
];

interface TournamentFormProps {
  tournament?: Tournament;
  mode: 'create' | 'edit';
}

export default function TournamentForm({ tournament, mode }: TournamentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: tournament?.name || '',
    description: tournament?.description || '',
    location: tournament?.location || '',
    start_date: tournament?.start_date
      ? new Date(tournament.start_date).toISOString().slice(0, 16)
      : '',
    end_date: tournament?.end_date
      ? new Date(tournament.end_date).toISOString().slice(0, 16)
      : '',
    image_url: tournament?.image_url || '',
    max_teams: tournament?.max_teams ?? 32,
    num_pools: tournament?.num_pools ?? 4,
    status: (tournament?.status || 'registration') as TournamentStatus,
    is_published: tournament?.is_published ?? false,
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
          ? '/api/tournaments'
          : `/api/tournaments/${tournament?.id}`;

      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
          end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${mode} tournament`);
      }

      if (mode === 'create') {
        router.push(`/admin/tournaments/edit/${data.id}`);
      } else {
        router.push('/admin/tournaments');
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Tournament Details</h2>
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="label">Tournament Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input"
              placeholder="e.g., Cannes International Pétanque 2026"
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
              placeholder="Describe the tournament..."
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="start_date" className="label">Start Date</label>
              <input
                type="datetime-local"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div>
              <label htmlFor="end_date" className="label">End Date</label>
              <input
                type="datetime-local"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tournament Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Settings</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="max_teams" className="label">Max Teams</label>
              <input
                type="number"
                id="max_teams"
                name="max_teams"
                value={formData.max_teams}
                onChange={handleChange}
                min="2"
                className="input"
              />
            </div>
            <div>
              <label htmlFor="num_pools" className="label">Number of Pools</label>
              <input
                type="number"
                id="num_pools"
                name="num_pools"
                value={formData.num_pools}
                onChange={handleChange}
                min="1"
                max="8"
                className="input"
              />
            </div>
            <div>
              <label htmlFor="status" className="label">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input"
              >
                {statuses.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Published */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            name="is_published"
            checked={formData.is_published}
            onChange={handleChange}
            className="w-5 h-5 text-tunisia-red rounded border-gray-300 focus:ring-tunisia-red"
          />
          <span className="font-medium text-gray-700">Published</span>
        </label>
        <p className="text-sm text-gray-500 mt-2 ml-8">
          Published tournaments are visible to visitors on the public site.
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
            'Create Tournament'
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </form>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface RegisterFormProps {
  tournamentId: string;
}

export default function RegisterForm({ tournamentId }: RegisterFormProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    country: '',
    captain_name: '',
    captain_phone: '',
    captain_email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'country' ? value.toUpperCase().slice(0, 2) : value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/tournaments/${tournamentId}/teams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to register team');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900 mt-4">
          {t.tournament?.registrationSuccess || 'Registration Successful!'}
        </h2>
        <p className="text-gray-500 mt-2">
          {t.tournament?.registrationMessage || 'Your team has been registered. We will contact you to confirm.'}
        </p>
        <button
          onClick={() => router.push(`/tournaments/${tournamentId}`)}
          className="btn-primary mt-6"
        >
          {t.tournament?.backToTournament || 'Back to Tournament'}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          {t.tournament?.teamName || 'Team Name'} *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="input"
          placeholder="e.g., Les Champions"
        />
      </div>

      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
          {t.tournament?.country || 'Country Code'} *
        </label>
        <input
          type="text"
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          required
          maxLength={2}
          className="input"
          placeholder="e.g., FR, TN, IT"
        />
        <p className="text-xs text-gray-400 mt-1">2-letter country code (ISO 3166-1)</p>
      </div>

      <div>
        <label htmlFor="captain_name" className="block text-sm font-medium text-gray-700 mb-1">
          {t.tournament?.captain || 'Captain Name'} *
        </label>
        <input
          type="text"
          id="captain_name"
          name="captain_name"
          value={formData.captain_name}
          onChange={handleChange}
          required
          className="input"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="captain_phone" className="block text-sm font-medium text-gray-700 mb-1">
            {t.tournament?.phone || 'Phone'}
          </label>
          <input
            type="tel"
            id="captain_phone"
            name="captain_phone"
            value={formData.captain_phone}
            onChange={handleChange}
            className="input"
            placeholder="+33..."
          />
        </div>
        <div>
          <label htmlFor="captain_email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="captain_email"
            name="captain_email"
            value={formData.captain_email}
            onChange={handleChange}
            required
            className="input"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            {t.tournament?.registering || 'Registering...'}
          </>
        ) : (
          t.tournament?.registerTeam || 'Register Team'
        )}
      </button>
    </form>
  );
}

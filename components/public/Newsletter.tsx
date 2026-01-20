'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

export default function Newsletter() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="bg-tunisia-blue py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Mail className="h-12 w-12 text-white mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white">{t.newsletter.title}</h2>
          <p className="mt-2 text-blue-100 max-w-md mx-auto">{t.newsletter.subtitle}</p>
        </div>

        <div className="mt-8 max-w-md mx-auto">
          {status === 'success' ? (
            <div className="flex items-center justify-center gap-2 text-white">
              <CheckCircle className="h-5 w-5" />
              <span>{t.newsletter.success}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="email"
                  required
                  placeholder={t.newsletter.placeholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-3 bg-tunisia-red text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? t.newsletter.subscribing : t.newsletter.subscribe}
              </button>
            </form>
          )}

          {status === 'error' && (
            <div className="mt-3 flex items-center justify-center gap-2 text-red-200">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{t.newsletter.error}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

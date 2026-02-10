'use client';

import { useState } from 'react';
import { Loader2, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiveEventsToggleProps {
  initialEnabled: boolean;
}

export default function LiveEventsToggle({ initialEnabled }: LiveEventsToggleProps) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'live_events_enabled',
          value: { enabled: !enabled },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update setting');
      }

      setEnabled(!enabled);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update setting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn(
      'flex items-center justify-between p-4 rounded-xl border-2 transition-colors',
      enabled ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'
    )}>
      <div className="flex items-center gap-3">
        <Radio className={cn('h-5 w-5', enabled ? 'text-green-600' : 'text-gray-400')} />
        <div>
          <p className="font-semibold text-gray-900">
            Live Events {enabled ? 'Visible' : 'Hidden'}
          </p>
          <p className="text-sm text-gray-500">
            {enabled
              ? 'Visitors can see the LIVE button and events'
              : 'Events are hidden from visitors'}
          </p>
        </div>
      </div>

      <button
        onClick={handleToggle}
        disabled={loading}
        className={cn(
          'relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
          enabled
            ? 'bg-green-500 focus:ring-green-500'
            : 'bg-gray-300 focus:ring-gray-400'
        )}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin mx-auto text-white" />
        ) : (
          <span
            className={cn(
              'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
              enabled ? 'translate-x-6' : 'translate-x-1'
            )}
          />
        )}
      </button>
    </div>
  );
}

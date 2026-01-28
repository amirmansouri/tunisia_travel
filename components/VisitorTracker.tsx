'use client';

import { useEffect } from 'react';

export default function VisitorTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if already tracked today
    const lastTracked = localStorage.getItem('visitor_tracked_date');
    const today = new Date().toDateString();

    if (lastTracked === today) {
      return; // Already tracked today
    }

    const trackVisitor = async () => {
      try {
        const response = await fetch('/api/visitors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });

        if (response.ok) {
          // Mark as tracked for today
          localStorage.setItem('visitor_tracked_date', today);
        }
      } catch (error) {
        console.error('Error tracking visitor:', error);
      }
    };

    trackVisitor();
  }, []);

  return null;
}

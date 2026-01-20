'use client';

import { useEffect } from 'react';

export default function VisitorTracker() {
  useEffect(() => {
    // Only track once per session
    if (sessionStorage.getItem('visitor_tracked')) {
      return;
    }

    // Mark as tracked for this session
    sessionStorage.setItem('visitor_tracked', 'true');

    // Log the visit (just once, no page tracking)
    fetch('/api/visitors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    }).catch(() => {
      // Silently fail
    });
  }, []);

  return null;
}

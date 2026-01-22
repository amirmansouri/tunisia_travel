'use client';

import { useEffect } from 'react';

export default function VisitorTracker() {
  useEffect(() => {
    // Only track once per session
    if (typeof window !== 'undefined' && sessionStorage.getItem('visitor_tracked')) {
      return;
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
          // Mark as tracked for this session
          sessionStorage.setItem('visitor_tracked', 'true');
          console.log('Visitor tracked successfully');
        } else {
          console.error('Failed to track visitor:', response.status);
        }
      } catch (error) {
        console.error('Error tracking visitor:', error);
      }
    };

    trackVisitor();
  }, []);

  return null;
}

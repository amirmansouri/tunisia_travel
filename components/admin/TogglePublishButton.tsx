'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TogglePublishButtonProps {
  programId: string;
  published: boolean;
}

export default function TogglePublishButton({
  programId,
  published,
}: TogglePublishButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isPublished, setIsPublished] = useState(published);

  const handleToggle = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/programs/${programId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !isPublished }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update program');
      }

      setIsPublished(!isPublished);
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update program');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors',
        isPublished
          ? 'bg-green-100 text-green-700 hover:bg-green-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      )}
    >
      {loading ? (
        <Loader2 className="h-3 w-3 animate-spin mr-1" />
      ) : isPublished ? (
        <Eye className="h-3 w-3 mr-1" />
      ) : (
        <EyeOff className="h-3 w-3 mr-1" />
      )}
      {isPublished ? 'Published' : 'Draft'}
    </button>
  );
}

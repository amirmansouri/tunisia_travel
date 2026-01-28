'use client';

import { useState } from 'react';
import { X, FolderOpen, Plus, Link2, HelpCircle } from 'lucide-react';
import SmartImage from '@/components/SmartImage';
import { getImageUrl } from '@/lib/utils';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddImages: (urls: string[]) => void;
}

export default function GoogleDriveModal({ isOpen, onClose, onAddImages }: GoogleDriveModalProps) {
  const [bulkUrls, setBulkUrls] = useState('');
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [showHelp, setShowHelp] = useState(false);

  if (!isOpen) return null;

  const parseUrls = (text: string): string[] => {
    // Split by newlines, commas, or spaces
    const lines = text.split(/[\n,]+/).map(line => line.trim()).filter(Boolean);

    // Extract valid URLs or Google Drive IDs
    const urls: string[] = [];
    for (const line of lines) {
      // Check if it's a Google Drive URL
      if (line.includes('drive.google.com') || /^[a-zA-Z0-9_-]{25,50}$/.test(line)) {
        urls.push(line);
      } else if (line.startsWith('http')) {
        urls.push(line);
      }
    }
    return urls;
  };

  const handlePreview = () => {
    const urls = parseUrls(bulkUrls);
    setPreviewUrls(urls);
  };

  const handleAddAll = () => {
    const urls = parseUrls(bulkUrls);
    if (urls.length > 0) {
      onAddImages(urls);
      setBulkUrls('');
      setPreviewUrls([]);
      onClose();
    }
  };

  const removePreviewUrl = (index: number) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    // Also update the text area
    const urls = parseUrls(bulkUrls);
    urls.splice(index, 1);
    setBulkUrls(urls.join('\n'));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            <FolderOpen className="h-6 w-6 text-tunisia-red" />
            <h2 className="text-lg font-semibold text-gray-900">Add Images from Google Drive</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Help Section */}
          <div className="mb-4">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center gap-2 text-sm text-tunisia-blue hover:underline"
            >
              <HelpCircle className="h-4 w-4" />
              {showHelp ? 'Hide instructions' : 'How to get Google Drive links?'}
            </button>

            {showHelp && (
              <div className="mt-3 p-4 bg-blue-50 rounded-lg text-sm space-y-2">
                <p className="font-medium text-blue-900">Steps to get image links:</p>
                <ol className="list-decimal list-inside space-y-1 text-blue-800">
                  <li>Open <a href="https://drive.google.com" target="_blank" rel="noopener noreferrer" className="underline">Google Drive</a></li>
                  <li>Right-click on an image</li>
                  <li>Click <strong>&quot;Get link&quot;</strong> or <strong>&quot;Share&quot;</strong></li>
                  <li>Set access to <strong>&quot;Anyone with the link&quot;</strong></li>
                  <li>Click <strong>&quot;Copy link&quot;</strong></li>
                  <li>Paste the link below</li>
                </ol>
                <p className="text-blue-700 mt-2">
                  You can paste multiple links at once (one per line).
                </p>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              <Link2 className="h-4 w-4 inline mr-1" />
              Paste Google Drive links (one per line)
            </label>
            <textarea
              value={bulkUrls}
              onChange={(e) => setBulkUrls(e.target.value)}
              placeholder="https://drive.google.com/file/d/xxx/view&#10;https://drive.google.com/file/d/yyy/view&#10;https://drive.google.com/file/d/zzz/view"
              className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tunisia-red focus:border-transparent resize-none font-mono text-sm"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePreview}
                disabled={!bulkUrls.trim()}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                Preview Images
              </button>
              <span className="text-sm text-gray-500 self-center">
                {parseUrls(bulkUrls).length} link(s) detected
              </span>
            </div>
          </div>

          {/* Preview Grid */}
          {previewUrls.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Preview ({previewUrls.length} images)
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group aspect-square">
                    <SmartImage
                      src={url}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                      sizes="150px"
                    />
                    <button
                      type="button"
                      onClick={() => removePreviewUrl(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 text-white text-xs rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAddAll}
            disabled={parseUrls(bulkUrls).length === 0}
            className="px-6 py-2 bg-tunisia-red text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add {parseUrls(bulkUrls).length} Image{parseUrls(bulkUrls).length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
}

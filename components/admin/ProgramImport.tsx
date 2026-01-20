'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function ProgramImport() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{
    type: 'success' | 'error';
    message: string;
    details?: string[];
  } | null>(null);

  const handleDownloadTemplate = () => {
    window.location.href = '/api/admin/programs/template';
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset
    setResult(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/programs/import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setResult({
          type: 'error',
          message: data.error || 'Failed to import',
          details: data.details,
        });
      } else {
        setResult({
          type: 'success',
          message: data.message || `Imported ${data.imported} programs`,
        });
        // Refresh the page to show new programs
        router.refresh();
      }
    } catch (error) {
      setResult({
        type: 'error',
        message: 'Failed to upload file',
      });
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleDownloadTemplate}
          className="btn-secondary text-sm"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Template
        </button>

        <button
          onClick={handleUploadClick}
          disabled={uploading}
          className="btn-outline text-sm"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </>
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {result && (
        <div
          className={`p-4 rounded-lg flex items-start ${
            result.type === 'success'
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          {result.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
          )}
          <div>
            <p
              className={`font-medium ${
                result.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {result.message}
            </p>
            {result.details && result.details.length > 0 && (
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {result.details.slice(0, 5).map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
                {result.details.length > 5 && (
                  <li>...and {result.details.length - 5} more errors</li>
                )}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

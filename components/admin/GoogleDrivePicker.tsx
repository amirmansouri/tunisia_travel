'use client';

import { useState, useEffect, useCallback } from 'react';
import { FolderOpen, Loader2 } from 'lucide-react';

// Google Picker API types
declare global {
  interface Window {
    gapi: {
      load: (api: string, callback: () => void) => void;
      client: {
        init: (config: { apiKey: string; discoveryDocs: string[] }) => Promise<void>;
        getToken: () => { access_token: string } | null;
      };
    };
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string }) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
      picker: {
        PickerBuilder: new () => GooglePickerBuilder;
        ViewId: {
          DOCS_IMAGES: string;
          FOLDERS: string;
        };
        Action: {
          PICKED: string;
          CANCEL: string;
        };
        DocsView: new (viewId?: string) => GoogleDocsView;
      };
    };
  }
}

interface GooglePickerBuilder {
  setOAuthToken: (token: string) => GooglePickerBuilder;
  setDeveloperKey: (key: string) => GooglePickerBuilder;
  addView: (view: GoogleDocsView) => GooglePickerBuilder;
  setCallback: (callback: (data: GooglePickerResponse) => void) => GooglePickerBuilder;
  enableFeature: (feature: string) => GooglePickerBuilder;
  setTitle: (title: string) => GooglePickerBuilder;
  build: () => { setVisible: (visible: boolean) => void };
}

interface GoogleDocsView {
  setMimeTypes: (mimeTypes: string) => GoogleDocsView;
  setIncludeFolders: (include: boolean) => GoogleDocsView;
  setSelectFolderEnabled: (enabled: boolean) => GoogleDocsView;
}

interface GooglePickerResponse {
  action: string;
  docs?: Array<{
    id: string;
    name: string;
    mimeType: string;
    url: string;
  }>;
}

interface GoogleDrivePickerProps {
  onSelect: (urls: string[]) => void;
  multiple?: boolean;
  buttonText?: string;
  className?: string;
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

export default function GoogleDrivePicker({
  onSelect,
  multiple = true,
  buttonText = 'Google Drive',
  className = '',
}: GoogleDrivePickerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Check if API keys are configured
  const isConfigured = API_KEY && CLIENT_ID;

  // Load Google APIs
  useEffect(() => {
    if (!isConfigured) return;

    const loadGoogleApis = () => {
      // Load GAPI
      const gapiScript = document.createElement('script');
      gapiScript.src = 'https://apis.google.com/js/api.js';
      gapiScript.async = true;
      gapiScript.defer = true;
      gapiScript.onload = () => {
        window.gapi.load('client:picker', () => {
          setIsApiLoaded(true);
        });
      };
      document.body.appendChild(gapiScript);

      // Load Google Identity Services
      const gisScript = document.createElement('script');
      gisScript.src = 'https://accounts.google.com/gsi/client';
      gisScript.async = true;
      gisScript.defer = true;
      document.body.appendChild(gisScript);
    };

    if (!window.gapi) {
      loadGoogleApis();
    } else {
      window.gapi.load('client:picker', () => {
        setIsApiLoaded(true);
      });
    }
  }, [isConfigured]);

  const handleAuth = useCallback(() => {
    if (!CLIENT_ID) return;

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (response) => {
        if (response.access_token) {
          setAccessToken(response.access_token);
          createPicker(response.access_token);
        }
      },
    });
    tokenClient.requestAccessToken();
  }, []);

  const createPicker = useCallback((token: string) => {
    if (!API_KEY) return;

    const view = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS_IMAGES);
    view.setMimeTypes('image/png,image/jpeg,image/gif,image/webp');
    view.setIncludeFolders(true);

    const picker = new window.google.picker.PickerBuilder()
      .setOAuthToken(token)
      .setDeveloperKey(API_KEY)
      .addView(view)
      .setTitle('Select Images from Google Drive')
      .setCallback((data: GooglePickerResponse) => {
        if (data.action === window.google.picker.Action.PICKED && data.docs) {
          const urls = data.docs.map((doc) =>
            `https://drive.google.com/uc?export=view&id=${doc.id}`
          );
          onSelect(urls);
        }
        setIsLoading(false);
      })
      .build();

    picker.setVisible(true);
    setIsLoading(false);
  }, [onSelect]);

  const handleClick = () => {
    if (!isConfigured) {
      alert('Google Drive API is not configured. Please add NEXT_PUBLIC_GOOGLE_API_KEY and NEXT_PUBLIC_GOOGLE_CLIENT_ID to your environment variables.');
      return;
    }

    setIsLoading(true);

    if (accessToken) {
      createPicker(accessToken);
    } else {
      handleAuth();
    }
  };

  // If not configured, show a link to open Google Drive manually
  if (!isConfigured) {
    return (
      <a
        href="https://drive.google.com"
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors ${className}`}
      >
        <FolderOpen className="h-5 w-5" />
        Open Google Drive
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading || !isApiLoaded}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <FolderOpen className="h-5 w-5" />
      )}
      {buttonText}
    </button>
  );
}

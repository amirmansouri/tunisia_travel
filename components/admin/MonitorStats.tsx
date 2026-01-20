'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, AlertCircle, Activity, HardDrive, Users, FileText, Calendar } from 'lucide-react';

interface Stats {
  counts: {
    programs: number;
    reservations: number;
    visitors: number;
    total_rows: number;
  };
  storage: {
    estimated_kb: number;
    estimated_mb: number;
    limit_mb: number;
    usage_percent: number;
  };
  last_activity: {
    last_visitor: string | null;
    last_reservation: string | null;
  };
  timestamp: string;
}

export default function MonitorStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [pinging, setPinging] = useState(false);
  const [pingResult, setPingResult] = useState<{ success: boolean; message: string } | null>(null);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const pingDatabase = async () => {
    setPinging(true);
    setPingResult(null);

    try {
      const response = await fetch('/api/health');
      const data = await response.json();

      if (response.ok) {
        setPingResult({ success: true, message: data.message || 'Database is healthy!' });
        // Refresh stats after ping
        fetchStats();
      } else {
        setPingResult({ success: false, message: data.message || 'Ping failed' });
      }
    } catch (error) {
      setPingResult({ success: false, message: 'Failed to ping database' });
    } finally {
      setPinging(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getUsageColor = (percent: number) => {
    if (percent < 50) return 'bg-green-500';
    if (percent < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-gray-200 rounded-xl"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-gray-200 rounded-xl"></div>
          <div className="h-24 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Database Health Check */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-green-600" />
            Database Health
          </h3>
          <button
            onClick={pingDatabase}
            disabled={pinging}
            className="btn-primary text-sm"
          >
            {pinging ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Pinging...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Ping Now
              </>
            )}
          </button>
        </div>

        {pingResult && (
          <div
            className={`p-3 rounded-lg flex items-center mb-4 ${
              pingResult.success
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {pingResult.success ? (
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            )}
            <span
              className={`text-sm ${
                pingResult.success ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {pingResult.message}
            </span>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Auto-ping Setup:</strong> To keep Supabase active, set up a free cron job at{' '}
            <a
              href="https://cron-job.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              cron-job.org
            </a>{' '}
            to ping this URL every 5 days:
          </p>
          <code className="block mt-2 p-2 bg-white rounded text-xs break-all">
            https://tunisia-travel-one.vercel.app/api/health
          </code>
        </div>
      </div>

      {/* Storage Usage */}
      {stats && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 flex items-center mb-4">
            <HardDrive className="h-5 w-5 mr-2 text-purple-600" />
            Storage Usage (Estimated)
          </h3>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Database Storage</span>
              <span className="font-medium">
                {stats.storage.estimated_mb.toFixed(2)} MB / {stats.storage.limit_mb} MB
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${getUsageColor(stats.storage.usage_percent)}`}
                style={{ width: `${Math.min(stats.storage.usage_percent, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.storage.usage_percent.toFixed(2)}% used
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-gray-50 rounded-lg">
              <FileText className="h-5 w-5 mx-auto text-blue-600 mb-1" />
              <p className="text-lg font-bold text-gray-900">{stats.counts.programs}</p>
              <p className="text-xs text-gray-500">Programs</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 mx-auto text-purple-600 mb-1" />
              <p className="text-lg font-bold text-gray-900">{stats.counts.reservations}</p>
              <p className="text-xs text-gray-500">Reservations</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <Users className="h-5 w-5 mx-auto text-green-600 mb-1" />
              <p className="text-lg font-bold text-gray-900">{stats.counts.visitors}</p>
              <p className="text-xs text-gray-500">Visitors</p>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Total rows: {stats.counts.total_rows} | Estimated size: {stats.storage.estimated_kb.toFixed(1)} KB
          </p>
        </div>
      )}

      {/* Last Activity */}
      {stats && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Last Activity</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Last Visitor</p>
              <p className="font-medium text-gray-900">
                {formatDate(stats.last_activity.last_visitor)}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Last Reservation</p>
              <p className="font-medium text-gray-900">
                {formatDate(stats.last_activity.last_reservation)}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Last updated: {formatDate(stats.timestamp)}
          </p>
        </div>
      )}
    </div>
  );
}

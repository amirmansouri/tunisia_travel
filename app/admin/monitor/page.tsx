import { Server, Database, Globe, Clock, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import MonitorStats from '@/components/admin/MonitorStats';

interface ServiceStatus {
  name: string;
  status: 'active' | 'warning' | 'error';
  plan: string;
  usage?: string;
  expiry?: string;
  url: string;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AdminMonitorPage() {
  const services: ServiceStatus[] = [
    {
      name: 'Vercel',
      status: 'active',
      plan: 'Hobby (Free)',
      usage: 'Unlimited deployments',
      expiry: 'No expiration',
      url: 'https://vercel.com/amirmansouris-projects/tunisia-travel',
    },
    {
      name: 'Supabase',
      status: 'active',
      plan: 'Free Tier',
      usage: '500 MB Database, 1 GB Storage',
      expiry: 'Pauses after 7 days inactive',
      url: 'https://supabase.com/dashboard/project/cpkutlpasefpqyvbhfun',
    },
  ];

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="lg:pl-64">
        <div className="pt-14 lg:pt-0">
          <AdminHeader
            title="System Monitor"
            description="Monitor your services, database health, and storage usage"
          />

          <main className="p-4 sm:p-6 lg:p-8">
            {/* Services Status */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <div key={service.name} className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        {service.name === 'Vercel' ? (
                          <div className="p-3 bg-black rounded-lg">
                            <Globe className="h-6 w-6 text-white" />
                          </div>
                        ) : (
                          <div className="p-3 bg-green-600 rounded-lg">
                            <Database className="h-6 w-6 text-white" />
                          </div>
                        )}
                        <div className="ml-4">
                          <h3 className="font-semibold text-gray-900">{service.name}</h3>
                          <p className="text-sm text-gray-500">{service.plan}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                        {getStatusIcon(service.status)}
                        <span className="ml-1 capitalize">{service.status}</span>
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-sm">
                      {service.usage && (
                        <div className="flex items-center text-gray-600">
                          <Server className="h-4 w-4 mr-2 text-gray-400" />
                          {service.usage}
                        </div>
                      )}
                      {service.expiry && (
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          {service.expiry}
                        </div>
                      )}
                    </div>

                    <a
                      href={service.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center text-sm text-tunisia-blue hover:underline"
                    >
                      Open Dashboard
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Database Stats & Health Check */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Database Health & Usage</h2>
              <MonitorStats />
            </div>

            {/* Free Tier Limits Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Free Tier Limits</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Vercel (Hobby Plan)
                  </h3>
                  <ul className="mt-2 ml-7 space-y-1 text-sm text-gray-600">
                    <li>• Unlimited deployments</li>
                    <li>• 100 GB bandwidth per month</li>
                    <li>• Serverless functions: 100 GB-hours</li>
                    <li>• No team collaboration</li>
                    <li>• Custom domains supported</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Supabase (Free Plan)
                  </h3>
                  <ul className="mt-2 ml-7 space-y-1 text-sm text-gray-600">
                    <li>• 500 MB database storage</li>
                    <li>• 1 GB file storage</li>
                    <li>• 2 GB bandwidth per month</li>
                    <li>• 50,000 monthly active users</li>
                    <li>• Project pauses after 7 days of inactivity</li>
                    <li>• 2 free projects</li>
                  </ul>
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 mb-3">Quick Links</h3>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://vercel.com/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Vercel Docs
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                  <a
                    href="https://supabase.com/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Supabase Docs
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                  <a
                    href="https://cron-job.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Cron-Job.org
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

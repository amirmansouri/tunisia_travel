import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';

interface PageProps {
  searchParams: Promise<{ name?: string; program?: string }>;
}

export const metadata = {
  title: 'Reservation Confirmed | Tunisia Travel',
  description: 'Your reservation request has been successfully submitted.',
};

export default async function ReservationSuccessPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const name = resolvedSearchParams.name || 'Guest';
  const program = resolvedSearchParams.program || 'your selected program';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-tunisia-cream flex items-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>

            {/* Title */}
            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Reservation Request Submitted!
            </h1>

            {/* Message */}
            <div className="mt-6 space-y-4 text-gray-600">
              <p className="text-lg">
                Thank you, <span className="font-semibold">{name}</span>!
              </p>
              <p>
                Your reservation request for{' '}
                <span className="font-semibold text-tunisia-red">{program}</span>{' '}
                has been successfully submitted.
              </p>
              <p>
                Our team will review your request and contact you within{' '}
                <span className="font-semibold">24 hours</span> to confirm
                availability and discuss the next steps.
              </p>
            </div>

            {/* What's Next */}
            <div className="mt-8 bg-gray-50 rounded-xl p-6 text-left">
              <h2 className="font-semibold text-gray-900 mb-3">
                What happens next?
              </h2>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-tunisia-red rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">
                    1
                  </span>
                  <span>
                    You&apos;ll receive an email confirmation with your request
                    details
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-tunisia-red rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">
                    2
                  </span>
                  <span>
                    Our travel specialist will contact you to confirm availability
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-tunisia-red rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">
                    3
                  </span>
                  <span>
                    We&apos;ll finalize your booking and send you all the trip
                    details
                  </span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/programs" className="btn-primary">
                Browse More Programs
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
              <Link href="/" className="btn-outline">
                Back to Home
              </Link>
            </div>

            {/* Contact Info */}
            <p className="mt-8 text-sm text-gray-500">
              Have questions? Contact us at{' '}
              <a
                href="mailto:info@tunisia-travel.com"
                className="text-tunisia-blue hover:underline"
              >
                info@tunisia-travel.com
              </a>{' '}
              or call{' '}
              <a
                href="tel:+21671123456"
                className="text-tunisia-blue hover:underline"
              >
                +216 71 123 456
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

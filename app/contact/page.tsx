import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import ContactForm from '@/components/public/ContactForm';
import { MapPin, Mail, Phone } from 'lucide-react';

export const metadata = {
  title: 'Contact Us | Yalla Habibi',
  description: 'Get in touch with Yalla Habibi. We\'re here to help with your Tunisia travel plans.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-r from-tunisia-red to-red-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
            <p className="mt-4 text-xl text-red-100 max-w-2xl mx-auto">
              Have questions? We&apos;d love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-tunisia-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Info */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-tunisia-red/10 rounded-lg">
                        <MapPin className="h-6 w-6 text-tunisia-red" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Address</h3>
                        <p className="text-gray-600 mt-1">Tunis, Tunisia</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-tunisia-red/10 rounded-lg">
                        <Mail className="h-6 w-6 text-tunisia-red" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Email</h3>
                        <a href="mailto:contact@arivotravel.com" className="text-tunisia-blue hover:underline mt-1 block">
                          contact@arivotravel.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-tunisia-red/10 rounded-lg">
                        <Phone className="h-6 w-6 text-tunisia-red" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Phone</h3>
                        <a href="tel:+21612345678" className="text-tunisia-blue hover:underline mt-1 block">
                          +216 12 345 678
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

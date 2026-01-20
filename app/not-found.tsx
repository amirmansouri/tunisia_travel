import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import NotFoundContent from '@/components/public/NotFoundContent';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <NotFoundContent />
      <Footer />
    </div>
  );
}

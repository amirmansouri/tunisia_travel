import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel | Yalla Habibi',
  description: 'Manage travel programs and reservations',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

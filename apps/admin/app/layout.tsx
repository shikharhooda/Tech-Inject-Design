import './globals.css';
import { AdminLayoutWrapper } from '@/components/AdminLayoutWrapper';

export const metadata = {
  title: 'Tech Inject Admin Dashboard',
  description: 'Management portal for Tech Inject Design Library components and licenses',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased">
        <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
      </body>
    </html>
  );
}

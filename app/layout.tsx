import type { Metadata, Viewport } from 'next';
import { Atkinson_Hyperlegible } from 'next/font/google';
import BottomNav from '@/components/BottomNav';
import { VerificationProvider } from '@/components/VerificationProvider';
import './globals.css';

const font = Atkinson_Hyperlegible({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Ciudadanía Clara',
  description: 'Verifica, entiende y aprende con fuentes claras',
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0B3D91' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL">
      <body className={font.className}>
        <VerificationProvider>
          <main className="mx-auto min-h-dvh w-full max-w-6xl pb-28">{children}</main>
          <BottomNav />
        </VerificationProvider>
      </body>
    </html>
  );
}

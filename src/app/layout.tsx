import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Zaira Furnishing | Bespoke Interior & Furnishing Showroom',
  description:
    'Experience premier furnishings at Zaira Furnishing. Explore bespoke curtains & drapes, architectural blinds, luxury sofa upholstery, wooden flooring, and curated living decor.',
  keywords: [
    'Zaira Furnishing',
    'luxury curtains',
    'bespoke drapery',
    'window blinds',
    'sofa upholstery fabric',
    'wooden flooring',
    'interior showroom',
    'home decor',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jakarta.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#FDFBF7] text-[#1C1917] selection:bg-[#9A7B56] selection:text-white">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

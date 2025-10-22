import type { Metadata } from 'next';
import { IM_Fell_DW_Pica, Source_Sans_3 } from 'next/font/google';
import './globals.css';

const fell = IM_Fell_DW_Pica({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-fell',
  display: 'swap',
  adjustFontFallback: false
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Alexander Expedition Tracker',
  description: 'Follow Alexander the Great\'s campaign through an immersive map-first experience.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fell.variable} ${sourceSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}

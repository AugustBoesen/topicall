import type { Metadata } from 'next';

import './globals.css';
import './mongoconnect.js';

export const metadata: Metadata = {
  title: 'TopicAll',
  description: 'A conversational helper app',
  generator: 'Next.js',
  manifest: '/manifest.json',
  keywords: ['nextjs', 'next14', 'pwa', 'next-pwa'],
  icons: [
    { rel: 'apple-touch-icon', url: 'icon-192x192.png' },
    { rel: 'icon', url: 'icon-192x192.png' },
  ],
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}

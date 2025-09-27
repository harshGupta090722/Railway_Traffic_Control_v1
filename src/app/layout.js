import { Inter, Roboto } from 'next/font/google';
import CustomThemeProvider from '@/components/providers/ThemeProvider';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata = {
  title: 'AI-Powered Railway Traffic Control | SIH 2025',
  description: 'Advanced railway traffic management system using AI for maximizing section throughput and intelligent train control.',
  keywords: ['railway', 'traffic control', 'AI', 'machine learning', 'transportation', 'SIH 2025'],
  authors: [{ name: 'SIH Team' }],
  creator: 'SIH 2025 Team',
  publisher: 'SIH 2025',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'AI-Powered Railway Traffic Control',
    description: 'Revolutionary railway management system with AI optimization',
    url: 'http://localhost:3000',
    siteName: 'Railway Traffic Control System',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI-Powered Railway Traffic Control',
    description: 'Revolutionary railway management system with AI optimization',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto.variable}`}>
      <head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          as="style"
        />
        {/* Material Icons */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          as="style"
        />
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#1976d2" />
        
        {/* Viewport settings for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </head>
      <body className={inter.className}>
        <CustomThemeProvider>
          <div id="__next">
            {children}
          </div>
        </CustomThemeProvider>
      </body>
    </html>
  );
}
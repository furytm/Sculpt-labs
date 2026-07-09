import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import Header from '@/src/components/Header'
import Footer from '@/src/components/Footer'

const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
})

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Sculpt LAB Pilates | Premium Pilates Studio',
  description: 'Experience luxury pilates at Sculpt LAB. Transform your body and mind with expert instructors and personalized sessions.',
  generator: 'v0.app',
  icons: {
    icon: '/logo.png',
    apple: '/logo.jpg',
  },
}

export const viewport: Viewport = {
  themeColor: '#8b7b6f',
  userScalable: true,
  initialScale: 1,
  width: 'device-width',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`bg-background scroll-smooth ${cormorant.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <Header />
        <main>
          {children}
        </main>
        <Footer />
        {process.env.NODE_ENV === 'production' && <Analytics />}
        
      </body>
    </html>
  )
}

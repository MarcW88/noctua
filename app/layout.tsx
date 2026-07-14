import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Noctua — Organic Search Ops',
  description: 'Plateforme roadmap-first pour les équipes SEO/GEO. Transformez vos signaux organiques en initiatives priorisées.',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}

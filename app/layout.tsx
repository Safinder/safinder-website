import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Safinder',
  description: 'Find your perfect match with Safinder, an app made by women for women.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

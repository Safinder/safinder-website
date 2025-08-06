import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Safinder',
  description: 'Find your perfect match with Safinder, an app made by women for women.',
   verification: {
    google: 'BAtI_Huq1liy3qI4o-Luz1d-2eoIRkv-dvpIJ-Z9YtQ',
  },
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

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'STARR Reflectie Assistent',
  description: 'Een AI-gestuurde assistent die studenten helpt bij het maken van gestructureerde STARR reflecties',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body className="bg-gray-100 min-h-screen" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}
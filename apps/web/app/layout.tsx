import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Constructora 360° - Plataforma E2E',
  description: 'Plataforma completa para gestión constructora con wood/steel frame, multi-perfil y chatbot inteligente',
  keywords: 'constructora, steel frame, wood frame, gestión proyectos, ERP constructora',
  authors: [{ name: 'Equipo Nexa-MVP' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} min-h-screen bg-gray-50 antialiased`}>
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </body>
    </html>
  )
}

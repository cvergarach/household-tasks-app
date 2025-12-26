import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tareas del Hogar - Gestión Inteligente',
  description: 'Distribución equitativa de tareas del hogar con IA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link href="/" className="flex items-center px-2 text-gray-900 font-bold text-xl">
                  🏠 Tareas del Hogar
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                  Diario
                </Link>
                <Link href="/calendar" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                  Calendario
                </Link>
                <Link href="/settings" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                  Ajustes
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 text-sm">
              © 2025 Tareas del Hogar - Powered by Gemini AI
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}

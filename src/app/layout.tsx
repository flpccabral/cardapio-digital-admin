import { Toaster } from "@/components/ui/toaster"
import AuthContext from '@/context/AuthContext'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cardápio - Admin',
  description: 'Cardápio Admin',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <Toaster />
        <AuthContext>
          {children}
        </AuthContext>
      </body>
    </html>
  )
}

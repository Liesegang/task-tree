import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import clsx from 'clsx';
import './globals.css'
import '@fortawesome/fontawesome-free/css/all.min.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Task Tree',
  description: 'Todo App support infinite level sub tasks.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={clsx("bg-slate-100", "dark:bg-slate-900", "text-slate-900", "dark:text-slate-100", inter.className)}>{children}</body>
    </html>
  )
}

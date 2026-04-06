import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mission Control Dashboard',
  description: 'Central hub for managing AI agents and their tasks',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">MC</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">Mission Control</span>
                  </Link>
                  <div className="ml-10 flex gap-6">
                    <Link
                      href="/"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                    >
                      Agents
                    </Link>
                    <Link
                      href="/tasks"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                    >
                      Tasks
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
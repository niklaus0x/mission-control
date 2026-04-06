import type { Metadata } from 'next';
import { Inter, Space_Mono } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceMono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-space-mono' });

export const metadata: Metadata = {
  title: 'Mission Control Dashboard',
  description: 'Central hub for managing AI agents and their tasks',
};

function AgentsIcon({ className }: { className?: string }) {
  return (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>);
}

function TasksIcon({ className }: { className?: string }) {
  return (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>);
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceMono.variable}`}>
        <div className="flex min-h-screen bg-zinc-950">
          <div className="fixed left-0 top-0 h-screen w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col z-40">
            <div className="p-6 border-b border-zinc-800">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <span className="text-white font-bold text-xl mono">MC</span>
                </div>
                <div>
                  <span className="text-xl font-bold text-zinc-100 mono block leading-tight">MISSION</span>
                  <span className="text-xl font-bold text-zinc-100 mono block leading-tight">CONTROL</span>
                </div>
              </Link>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              <Link href="/" className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 rounded-lg transition-all duration-200">
                <AgentsIcon className="w-5 h-5" />
                <span className="font-medium mono">Agents</span>
              </Link>
              <Link href="/tasks" className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 rounded-lg transition-all duration-200">
                <TasksIcon className="w-5 h-5" />
                <span className="font-medium mono">Tasks</span>
              </Link>
            </nav>
            <div className="p-4 border-t border-zinc-800">
              <div className="bg-zinc-900/50 rounded-lg p-3 border border-zinc-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="status-light status-light-idle"></span>
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mono">System Status</span>
                </div>
                <p className="text-xs text-zinc-500 mono">All systems operational</p>
              </div>
            </div>
          </div>
          <main className="flex-1 ml-64">{children}</main>
        </div>
      </body>
    </html>
  );
}
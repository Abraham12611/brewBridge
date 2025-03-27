'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ArrowLeftRight,
  History,
  Droplets,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Bridge', href: '/bridge', icon: ArrowLeftRight },
  { name: 'History', href: '/history', icon: History },
  { name: 'Pool', href: '/app/pool', icon: Droplets },
  { name: 'Settings', href: '/appsettings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white hover:bg-white/10"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed top-0 left-0 z-40 h-screen w-64 bg-[#1A1B23] border-r border-white/10',
          'transition-transform duration-200 ease-in-out lg:translate-x-0',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link href="/app/dashboard" className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <Image
                src="/Brew-bridge-logo.png"
                alt="BrewBridge Logo"
                width={32}
                height={32}
                className="w-full h-full"
                priority
              />
            </div>
            <span className="text-xl font-bold text-white bg-gradient-to-r from-[#00C2FF] to-[#7B00FF] bg-clip-text text-transparent">
              BrewBridge
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  'hover:bg-white/5',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00C2FF] to-[#7B00FF]" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Connected Wallet</p>
              <p className="text-xs text-gray-400 truncate">0x1234...5678</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
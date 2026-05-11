'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  LogOut,
  FileText,
  PenTool
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { mockProfiles } from '@/lib/mock-data';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Form', href: '/form', icon: FileText },
  { label: 'eSign', href: '/sign', icon: PenTool },
];

const currentUser = mockProfiles[0]; // Rahul Mandal (Admin)

export function SidebarContent({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="flex items-center px-4 h-16 shrink-0 overflow-visible">
        {collapsed ? (
          <div className="flex items-center justify-center w-full">
            <Image
              src="/images/logo-icon.svg"
              alt="VisionSolar"
              width={32}
              height={32}
              className="shrink-0"
              priority
            />
          </div>
        ) : (
          <Image
            src="/images/logo.svg"
            alt="VisionSolar"
            width={170}
            height={42}
            className="shrink-0 animate-fade-in"
            priority
          />
        )}
      </div>

      <Separator className="bg-light-gray" />

      {/* Nav Items */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          const linkContent = (
            <Link
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200 group relative
                ${isActive
                  ? 'bg-accent text-green-dark'
                  : 'text-dark-gray hover:bg-off-white hover:text-charcoal'
                }
              `}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-vision-green" />
              )}
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-vision-green' : 'text-mid-gray group-hover:text-dark-gray'}`} />
              {!collapsed && (
                <span className="whitespace-nowrap overflow-hidden">{item.label}</span>
              )}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger className="w-full text-left">{linkContent}</TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return <div key={item.href}>{linkContent}</div>;
        })}
      </nav>

      <Separator className="bg-light-gray" />

      {/* User Section */}
      <div className={`p-3 shrink-0 ${collapsed ? 'flex flex-col items-center gap-2' : ''}`}>
        <div className={`flex items-center ${collapsed ? 'flex-col gap-2' : 'gap-3'}`}>
          <Avatar className="w-9 h-9 shrink-0 border-2 border-green-light/30">
            <AvatarFallback className="bg-vision-green text-white text-xs font-semibold">
              {currentUser.full_name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-charcoal truncate">{currentUser.full_name}</p>
              <p className="text-xs text-mid-gray truncate">{currentUser.role}</p>
            </div>
          )}
          <Tooltip>
            <TooltipTrigger
              onClick={handleLogout}
              className="inline-flex items-center justify-center w-8 h-8 rounded-md text-mid-gray hover:text-destructive hover:bg-red-50 shrink-0 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </TooltipTrigger>
            <TooltipContent side={collapsed ? 'right' : 'top'}>Sign out</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        relative hidden lg:flex flex-col h-full bg-white border-r border-light-gray
        transition-all duration-300 ease-in-out shrink-0
        ${collapsed ? 'w-[68px]' : 'w-[240px]'}
      `}
    >
      <SidebarContent collapsed={collapsed} />

      {/* Collapse Toggle */}
      <div className="absolute -right-3 top-20 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="w-6 h-6 rounded-full bg-white border-light-gray shadow-sm hover:bg-off-white text-mid-gray"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </Button>
      </div>
    </aside>
  );
}

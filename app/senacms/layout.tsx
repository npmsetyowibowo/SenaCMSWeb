import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Tag,
  Image as ImageIcon,
  Briefcase,
  Star,
  DollarSign,
  HelpCircle,
  Inbox,
  FileCode,
  Search,
  Settings,
  UserCheck,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { AdminHeader } from './AdminHeader';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // If this is the login page or user is logged in, allow rendering
  // Note: if user is null on protected route, redirect to login is handled inside or by server check.
  // However, we don't want to redirect if the current path is /senacms/login!
  // In Next.js App Router, layout wraps child pages. We can check if child is login page or let client handle or check headers.

  return (
    <div className="min-h-screen bg-[#eef2f6] text-slate-800 flex flex-col">
      <AdminHeader user={user} />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { 
  Ticket as TicketIcon, 
  Smartphone, 
  Globe, 
  ShieldCheck, 
  QrCode, 
  User as UserIcon, 
  LogOut, 
  FileText, 
  ChevronDown, 
  Sparkles 
} from 'lucide-react';
import { User, UserRole } from '../types';
import { DEFAULT_USERS } from '../services/ticketService';

interface NavbarProps {
  currentUser: User;
  onSwitchRole: (role: UserRole) => void;
  activeTab: 'events' | 'my-tickets' | 'scanner' | 'admin';
  setActiveTab: (tab: 'events' | 'my-tickets' | 'scanner' | 'admin') => void;
  platformMode: 'web' | 'mobile';
  setPlatformMode: (mode: 'web' | 'mobile') => void;
  onOpenAuth: () => void;
  onOpenDocs: () => void;
  onOpenEventDetail?: (eventId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSwitchRole,
  activeTab,
  setActiveTab,
  platformMode,
  setPlatformMode,
  onOpenAuth,
  onOpenDocs,
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0F19]/95 backdrop-blur-md border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setActiveTab('events')} 
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <TicketIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
              SMART<span className="text-indigo-400">TICKET</span>
            </span>
          </button>

          {/* Mode Switcher: Web vs Native Android Flutter Simulator */}
          <div className="hidden sm:flex items-center p-0.5 bg-slate-900/90 border border-slate-800 rounded-lg ml-3">
            <button
              onClick={() => setPlatformMode('web')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                platformMode === 'web'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Web Platform</span>
            </button>
            <button
              onClick={() => setPlatformMode('mobile')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                platformMode === 'mobile'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android Flutter App</span>
            </button>
          </div>
        </div>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => {
              setPlatformMode('web');
              setActiveTab('events');
            }}
            className={`transition-colors whitespace-nowrap hover:text-white ${
              activeTab === 'events' && platformMode === 'web'
                ? 'text-indigo-400 font-semibold'
                : 'text-slate-300'
            }`}
          >
            Explore Events
          </button>

          <button
            onClick={() => {
              setPlatformMode('web');
              setActiveTab('my-tickets');
            }}
            className={`transition-colors whitespace-nowrap hover:text-white ${
              activeTab === 'my-tickets' && platformMode === 'web'
                ? 'text-indigo-400 font-semibold'
                : 'text-slate-300'
            }`}
          >
            My Tickets
          </button>

          <button
            onClick={() => {
              setPlatformMode('web');
              setActiveTab('scanner');
            }}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap hover:text-white ${
              activeTab === 'scanner' && platformMode === 'web'
                ? 'text-indigo-400 font-semibold'
                : 'text-slate-300'
            }`}
          >
            <QrCode className="w-4 h-4 text-purple-400" />
            <span>Gate Scanner</span>
          </button>

          <button
            onClick={() => {
              setPlatformMode('web');
              setActiveTab('admin');
            }}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap hover:text-white ${
              activeTab === 'admin' && platformMode === 'web'
                ? 'text-indigo-400 font-semibold'
                : 'text-slate-300'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Admin Console</span>
          </button>

          <button
            onClick={onOpenDocs}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-300 transition-colors whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PS-07 Docs</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action or User/Role dropdown */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Quick Role Switcher for Hackathon Testing */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800/80 transition-colors"
            >
              <span className={`w-2 h-2 rounded-full ${
                currentUser.role === 'admin' ? 'bg-amber-400' : currentUser.role === 'staff' ? 'bg-emerald-400' : 'bg-indigo-400'
              }`} />
              <span className="capitalize">{currentUser.role}: {currentUser.name.split(' ')[0]}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 text-xs"
                onMouseLeave={() => setRoleMenuOpen(false)}
              >
                <div className="px-3 py-1.5 text-slate-400 border-b border-slate-800/80">
                  Switch Role (One-Click Demo):
                </div>
                
                <button
                  onClick={() => {
                    onSwitchRole('customer');
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-800/60 transition-colors ${
                    currentUser.role === 'customer' ? 'text-indigo-400 font-semibold' : 'text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-indigo-400" />
                    <div>
                      <div>Customer View</div>
                      <div className="text-[10px] text-slate-400">{DEFAULT_USERS.customer.email}</div>
                    </div>
                  </div>
                  {currentUser.role === 'customer' && <span className="text-[10px] text-indigo-400 font-bold">ACTIVE</span>}
                </button>

                <button
                  onClick={() => {
                    onSwitchRole('staff');
                    setActiveTab('scanner');
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-800/60 transition-colors ${
                    currentUser.role === 'staff' ? 'text-emerald-400 font-semibold' : 'text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div>Ticket Checker / Staff</div>
                      <div className="text-[10px] text-slate-400">{DEFAULT_USERS.staff.email}</div>
                    </div>
                  </div>
                  {currentUser.role === 'staff' && <span className="text-[10px] text-emerald-400 font-bold">ACTIVE</span>}
                </button>

                <button
                  onClick={() => {
                    onSwitchRole('admin');
                    setActiveTab('admin');
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-800/60 transition-colors ${
                    currentUser.role === 'admin' ? 'text-amber-400 font-semibold' : 'text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <div>
                      <div>Event Admin</div>
                      <div className="text-[10px] text-slate-400">{DEFAULT_USERS.admin.email}</div>
                    </div>
                  </div>
                  {currentUser.role === 'admin' && <span className="text-[10px] text-amber-400 font-bold">ACTIVE</span>}
                </button>

                <div className="border-t border-slate-800/80 mt-1 pt-1">
                  <button
                    onClick={() => {
                      onOpenAuth();
                      setRoleMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-300 hover:bg-slate-800/60"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>Custom Login / Register</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Primary CTA / Mobile view toggle on small screens */}
          <button
            onClick={() => {
              if (platformMode === 'web') {
                setPlatformMode('mobile');
              } else {
                setPlatformMode('web');
              }
            }}
            className="sm:hidden p-2 text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:text-white"
            title="Toggle Android View"
          >
            {platformMode === 'web' ? <Smartphone className="w-4 h-4 text-purple-400" /> : <Globe className="w-4 h-4 text-indigo-400" />}
          </button>
        </div>

      </div>
    </header>
  );
};

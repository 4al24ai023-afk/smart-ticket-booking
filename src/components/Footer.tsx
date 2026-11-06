import React from 'react';
import { Ticket as TicketIcon, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenDocs: () => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDocs, onSelectCategory }) => {
  return (
    <footer className="w-full bg-[#080B12] border-t border-slate-800/80 text-slate-400 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand & Purpose */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center">
                <TicketIcon className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                SMART<span className="text-indigo-400">TICKET</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Hackathon solution for Problem Statement PS-07: Online Ticketing and Booking Management System.
            </p>
            <div className="text-[11px] text-slate-500">
              Cross-platform React Web + Native Android Flutter App with unified Cloud Firestore.
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Explore Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onSelectCategory('Concerts')} className="hover:text-indigo-400 transition-colors">
                  Concerts & Live Music
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Tech & Hackathons')} className="hover:text-indigo-400 transition-colors">
                  Tech & Hackathons
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Sports')} className="hover:text-indigo-400 transition-colors">
                  Collegiate & Pro Sports
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Workshops')} className="hover:text-indigo-400 transition-colors">
                  Workshops & Masterclasses
                </button>
              </li>
            </ul>
          </div>

          {/* System Architecture */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Security & Reliability
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero-Overbooking Locks</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Anti-Scalping QR Passes</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>Single Check-In Gate Control</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Inventory Restoration Logic</span>
              </li>
            </ul>
          </div>

          {/* Hackathon Specs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Hackathon Evaluation
            </h4>
            <p className="text-slate-400 text-[11px] mb-3">
              Inspect database security rules, system architecture, and Flutter Android setup guidelines:
            </p>
            <button
              onClick={onOpenDocs}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
            >
              Open PS-07 Architecture Docs
            </button>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; 2026 SMARTTICKET. Built for PS-07 Online Ticketing & Booking Management System.
          </div>
          <div className="flex items-center gap-1">
            <span>Powered by React 19 + TypeScript + Flutter + Firebase</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

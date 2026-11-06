import React from 'react';
import { Search, Shield, Zap, QrCode, CheckCircle2, Calendar, MapPin } from 'lucide-react';
import { EventCategory } from '../types';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onExploreClick: () => void;
}

const CATEGORIES: { label: string; value: string }[] = [
  { label: 'All Events', value: 'all' },
  { label: 'Concerts', value: 'Concerts' },
  { label: 'Tech & AI', value: 'Tech & Hackathons' },
  { label: 'Sports', value: 'Sports' },
  { label: 'Workshops', value: 'Workshops' },
  { label: 'College', value: 'College Events' },
  { label: 'Film & Arts', value: 'Film & Arts' },
  { label: 'Comedy', value: 'Comedy' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onExploreClick,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 bg-gradient-to-b from-[#0B0F19] via-[#0E1424] to-[#0B0F19] border-b border-slate-800/80">
      
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[250px] bg-purple-600/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Hero 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Column: Value proposition & Search */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Clean unboxed category kicker without pill sandwiches */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-indigo-400 uppercase mb-3">
              <span>PS-07 Solution</span>
              <span aria-hidden="true">·</span>
              <span>Online Ticketing & Booking Management</span>
              <span aria-hidden="true">·</span>
              <span>Unified Web & Mobile</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight mb-5 [text-wrap:balance]">
              Secure, Unforgeable Ticketing for Modern Live Events
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mb-8">
              Eliminate scalping and counterfeit passes with atomic inventory locks, 
              cryptographically signed QR passes, and instant gate verification across 
              web and native Android.
            </p>

            {/* Live Search & Quick Filter Bar */}
            <div className="p-2 sm:p-2.5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md mb-6">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by event title, artist, venue, or city..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/60 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                <button
                  onClick={onExploreClick}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>Explore Schedule</span>
                </button>
              </div>

              {/* Category Segmented Buttons */}
              <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-800/80 overflow-x-auto pb-1 scrollbar-none">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                      selectedCategory === cat.value
                        ? 'bg-indigo-600/90 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Architecture Highlights */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero-Overbooking Guarantee</span>
              </div>
              <span aria-hidden="true">·</span>
              <div className="flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-indigo-400" />
                <span>Sub-Second Gate Scan</span>
              </div>
              <span aria-hidden="true">·</span>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Unified Firestore DB</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Asset Card */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl group">
              <img
                src="/src/assets/images/hero_concert_stage_1793982773354.jpg"
                alt="Concert stage with laser light show and energetic crowd"
                className="w-full h-72 sm:h-80 lg:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-center gap-2 text-xs text-indigo-300 mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>November 20, 2026</span>
                  <span aria-hidden="true">·</span>
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Bengaluru, Karnataka</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Neon Horizon Music & Arts Festival
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 mb-3">
                  Electronic stages, spatial audio, and tamper-proof digital passes with live QR verification.
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-300">
                    From <span className="text-base font-bold text-white tabular-nums">₹999</span>
                  </div>
                  <button
                    onClick={onExploreClick}
                    className="px-3.5 py-1.5 bg-white text-slate-900 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 4-Column KPI Proof Strip placed in a full-width row below the hero split */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10 pt-8 border-t border-slate-800/80">
          <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl">
            <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums mb-0.5">
              100%
            </div>
            <div className="text-xs font-medium text-slate-400">
              Inventory Consistency (Atomic Locks)
            </div>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl">
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 tabular-nums mb-0.5">
              &lt; 0.2s
            </div>
            <div className="text-xs font-medium text-slate-400">
              Camera QR Gate Verification
            </div>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 tabular-nums mb-0.5">
              Dual
            </div>
            <div className="text-xs font-medium text-slate-400">
              Web & Native Android Flutter Client
            </div>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tabular-nums mb-0.5">
              0
            </div>
            <div className="text-xs font-medium text-slate-400">
              Duplicate Check-Ins Allowed
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

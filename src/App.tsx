import React, { useState, useEffect } from 'react';
import { 
  Navbar 
} from './components/Navbar';
import { 
  HeroSection 
} from './components/HeroSection';
import { 
  EventCard 
} from './components/EventCard';
import { 
  EventDetailModal 
} from './components/EventDetailModal';
import { 
  CheckoutModal 
} from './components/CheckoutModal';
import { 
  TicketConfirmationModal 
} from './components/TicketConfirmationModal';
import { 
  MyTicketsView 
} from './components/MyTicketsView';
import { 
  StaffScannerView 
} from './components/StaffScannerView';
import { 
  AdminDashboardView 
} from './components/AdminDashboardView';
import { 
  AndroidSimulator 
} from './components/AndroidSimulator';
import { 
  HackathonDocsModal 
} from './components/HackathonDocsModal';
import { 
  AuthModal 
} from './components/AuthModal';
import { 
  Footer 
} from './components/Footer';
import { 
  ticketService 
} from './services/ticketService';
import { 
  Booking, 
  EventItem, 
  TicketTier, 
  User, 
  UserRole 
} from './types';
import { 
  Calendar, 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  ShieldCheck, 
  QrCode, 
  Zap, 
  Lock, 
  Smartphone, 
  ArrowRight,
  Filter
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(ticketService.getCurrentUser());
  const [events, setEvents] = useState<EventItem[]>(ticketService.getEvents());
  const [activeTab, setActiveTab] = useState<'events' | 'my-tickets' | 'scanner' | 'admin'>('events');
  const [platformMode, setPlatformMode] = useState<'web' | 'mobile'>('web');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'price_low' | 'price_high' | 'capacity'>('date');

  // Modals
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<EventItem | null>(null);
  const [checkoutEvent, setCheckoutEvent] = useState<EventItem | null>(null);
  const [checkoutTier, setCheckoutTier] = useState<TicketTier | null>(null);
  const [checkoutQuantity, setCheckoutQuantity] = useState(1);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);

  // Subscribe to reactive updates from ticketService
  useEffect(() => {
    const unsubscribe = ticketService.subscribe(() => {
      setCurrentUser(ticketService.getCurrentUser());
      setEvents(ticketService.getEvents());
    });
    return unsubscribe;
  }, []);

  const handleSwitchRole = (role: UserRole) => {
    ticketService.switchRole(role);
  };

  const handleOpenCheckout = (event: EventItem, tier: TicketTier, quantity: number) => {
    setSelectedEventForDetail(null);
    setCheckoutEvent(event);
    setCheckoutTier(tier);
    setCheckoutQuantity(quantity);
  };

  const handleBookingSuccess = (booking: Booking) => {
    setConfirmedBooking(booking);
  };

  // Filtered Events Calculation
  const filteredEvents = events.filter((e) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q || 
      e.title.toLowerCase().includes(q) || 
      e.venue.toLowerCase().includes(q) || 
      e.city.toLowerCase().includes(q) ||
      e.organizer.toLowerCase().includes(q) ||
      e.tags.some(t => t.toLowerCase().includes(q));

    const matchesCategory = selectedCategory === 'all' || e.category === selectedCategory;
    const matchesCity = selectedCity === 'all' || e.city.toLowerCase().includes(selectedCity.toLowerCase());

    return matchesSearch && matchesCategory && matchesCity;
  }).sort((a, b) => {
    if (sortBy === 'date') return new Date(a.date).getTime() - new Date(b.date).getTime();
    const minA = Math.min(...a.tiers.map(t => t.price));
    const minB = Math.min(...b.tiers.map(t => t.price));
    if (sortBy === 'price_low') return minA - minB;
    if (sortBy === 'price_high') return minB - minA;
    if (sortBy === 'capacity') return b.remainingCapacity - a.remainingCapacity;
    return 0;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Bar Navigation */}
      <Navbar
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        platformMode={platformMode}
        setPlatformMode={setPlatformMode}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenDocs={() => setIsDocsModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Switch between Web Experience and Native Android Flutter Simulation */}
        {platformMode === 'mobile' ? (
          <AndroidSimulator 
            currentUser={currentUser}
            onBookingCreated={(booking) => {
              setConfirmedBooking(booking);
            }}
          />
        ) : (
          <>
            {/* View 1: Explore Events (Landing Page & Listing) */}
            {activeTab === 'events' && (
              <div>
                {/* Hero Section */}
                <HeroSection
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  onExploreClick={() => {
                    const el = document.getElementById('events-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                />

                {/* Event Directory Section */}
                <section id="events-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                  
                  {/* Filter & Controls Toolbar */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800/80">
                    <div>
                      <h2 className="text-2xl font-extrabold text-white tracking-tight">
                        {selectedCategory === 'all' ? 'All Upcoming Events' : selectedCategory}
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Showing <strong className="text-white">{filteredEvents.length}</strong> available live sessions
                      </p>
                    </div>

                    {/* Filter Dropdowns */}
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Sort Dropdown */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <span>Sort:</span>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as any)}
                          className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
                        >
                          <option value="date">Upcoming Date</option>
                          <option value="price_low">Price: Low to High</option>
                          <option value="price_high">Price: High to Low</option>
                          <option value="capacity">Most Capacity Left</option>
                        </select>
                      </div>

                      {/* City Dropdown */}
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none"
                      >
                        <option value="all">All Cities</option>
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Delhi">Delhi NCR</option>
                        <option value="Hyderabad">Hyderabad</option>
                      </select>
                    </div>
                  </div>

                  {/* Events Grid */}
                  {filteredEvents.length === 0 ? (
                    <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-2xl max-w-lg mx-auto my-12">
                      <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                      <h3 className="text-base font-bold text-white mb-1">No Matching Events Found</h3>
                      <p className="text-xs text-slate-400 mb-4">
                        Try adjusting your search criteria, category filters, or city selection.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('all');
                          setSelectedCity('all');
                        }}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredEvents.map((event) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          onSelect={(e) => setSelectedEventForDetail(e)}
                        />
                      ))}
                    </div>
                  )}

                  {/* "How SMARTTICKET Works" Editorial Section */}
                  <div className="mt-20 pt-12 border-t border-slate-800/80">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                      <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
                        Architecture Pipeline
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        How SMARTTICKET Secures Every Booking
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-400 mt-2">
                        A seamless, transactional pipeline from user discovery to venue turnstiles.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-2xl relative">
                        <div className="text-2xl font-black text-indigo-500/30 mb-3 font-mono">01.</div>
                        <h4 className="text-base font-bold text-white mb-2">Atomic Reservation</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Firestore Transactions lock remaining inventory instantly. Even under high concurrency, seats cannot be double-booked or overdrawn.
                        </p>
                      </div>

                      <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-2xl relative">
                        <div className="text-2xl font-black text-indigo-500/30 mb-3 font-mono">02.</div>
                        <h4 className="text-base font-bold text-white mb-2">Cryptographic QR Passes</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Each confirmed ticket is assigned an unpredictable signed token. Sensitive attendee PII is never stored in plain text inside the QR payload.
                        </p>
                      </div>

                      <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-2xl relative">
                        <div className="text-2xl font-black text-indigo-500/30 mb-3 font-mono">03.</div>
                        <h4 className="text-base font-bold text-white mb-2">Single Check-In Gate Control</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Staff scan passes via camera. The system checks the database, records entry timestamp, and blocks duplicate reuse attempts immediately.
                        </p>
                      </div>
                    </div>
                  </div>

                </section>
              </div>
            )}

            {/* View 2: Customer My Tickets */}
            {activeTab === 'my-tickets' && (
              <MyTicketsView
                currentUser={currentUser}
                onExploreEvents={() => setActiveTab('events')}
                onSelectBookingForView={(b) => setConfirmedBooking(b)}
              />
            )}

            {/* View 3: Ticket Checker / Staff Gate Scanner */}
            {activeTab === 'scanner' && (
              <StaffScannerView currentUser={currentUser} />
            )}

            {/* View 4: Admin Management Console */}
            {activeTab === 'admin' && (
              <AdminDashboardView
                currentUser={currentUser}
                onSelectEvent={(e) => setSelectedEventForDetail(e)}
              />
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <Footer 
        onOpenDocs={() => setIsDocsModalOpen(true)}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setActiveTab('events');
          setPlatformMode('web');
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
      />

      {/* Event Details Modal */}
      <EventDetailModal
        event={selectedEventForDetail}
        isOpen={Boolean(selectedEventForDetail)}
        onClose={() => setSelectedEventForDetail(null)}
        onProceedToCheckout={handleOpenCheckout}
      />

      {/* Checkout & Simulated Payment Modal */}
      <CheckoutModal
        event={checkoutEvent}
        tier={checkoutTier}
        quantity={checkoutQuantity}
        isOpen={Boolean(checkoutEvent && checkoutTier)}
        onClose={() => {
          setCheckoutEvent(null);
          setCheckoutTier(null);
        }}
        currentUser={currentUser}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Confirmed Tickets Modal */}
      <TicketConfirmationModal
        booking={confirmedBooking}
        isOpen={Boolean(confirmedBooking)}
        onClose={() => setConfirmedBooking(null)}
        onGoToMyTickets={() => {
          setConfirmedBooking(null);
          setActiveTab('my-tickets');
        }}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setCurrentUser(ticketService.getCurrentUser());
        }}
      />

      {/* Hackathon PS-07 Documentation Modal */}
      <HackathonDocsModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
      />

    </div>
  );
}

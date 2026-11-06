import React, { useState } from 'react';
import { 
  Smartphone, 
  Home, 
  Search, 
  Ticket as TicketIcon, 
  User as UserIcon, 
  QrCode, 
  Wifi, 
  Battery, 
  Signal, 
  Calendar, 
  MapPin, 
  ArrowLeft, 
  CheckCircle2, 
  Code, 
  Layers, 
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Plus,
  Minus
} from 'lucide-react';
import { EventItem, Booking, Ticket, TicketTier, User as AuthUser } from '../types';
import { ticketService } from '../services/ticketService';

interface AndroidSimulatorProps {
  currentUser: AuthUser;
  onBookingCreated?: (booking: Booking) => void;
}

export const AndroidSimulator: React.FC<AndroidSimulatorProps> = ({ currentUser, onBookingCreated }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'tickets' | 'scanner' | 'profile'>('home');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [bookingStep, setBookingStep] = useState<'details' | 'checkout' | 'confirmed'>('details');
  const [selectedTier, setSelectedTier] = useState<TicketTier | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [showCodeViewer, setShowCodeViewer] = useState(false);

  const events = ticketService.getEvents();
  const allBookings = ticketService.getBookings();
  const userBookings = allBookings.filter(
    b => b.userId === currentUser.id || b.customerEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchFilter.toLowerCase()) || e.city.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCat = categoryFilter === 'All' || e.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleStartBooking = (event: EventItem) => {
    setSelectedEvent(event);
    setSelectedTier(event.tiers.find(t => t.availableCapacity > 0) || event.tiers[0]);
    setQuantity(1);
    setBookingStep('details');
  };

  const handleCompleteCheckout = async () => {
    if (!selectedEvent || !selectedTier) return;
    try {
      const booking = await ticketService.createBooking({
        eventId: selectedEvent.id,
        tierId: selectedTier.id,
        quantity,
        attendeeNames: [currentUser.name || 'Alex Rivera'],
        customerName: currentUser.name || 'Alex Rivera',
        customerEmail: currentUser.email || 'alex.rivera@example.com',
        customerPhone: '+1 (555) 234-5678',
        paymentMethod: 'demo_card',
      });
      setConfirmedBooking(booking);
      setBookingStep('confirmed');
      if (onBookingCreated) onBookingCreated(booking);
    } catch (e: any) {
      alert(e.message || 'Checkout failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Simulation Header & Code Inspector Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-1">
            <Smartphone className="w-4 h-4" />
            <span>Native Android Client · Flutter 3.x / Dart</span>
            <span aria-hidden="true">·</span>
            <span>Material 3 Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Interactive Native Android App Simulation
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Experience the SMARTTICKET Android client directly in browser with synchronized Firestore state and full source code.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCodeViewer(!showCodeViewer)}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all ${
              showCodeViewer
                ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>{showCodeViewer ? 'Hide Flutter Source' : 'Inspect Flutter Code'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Android Smartphone Shell (5 or 6 Cols) */}
        <div className="lg:col-span-6 flex justify-center">
          
          {/* Physical Phone Frame */}
          <div className="relative w-[340px] sm:w-[380px] h-[720px] bg-slate-950 rounded-[44px] p-3 shadow-2xl border-[6px] border-slate-800 ring-1 ring-slate-700/50 flex flex-col overflow-hidden">
            
            {/* Top Speaker / Camera Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-30 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-950 ml-6" />
            </div>

            {/* Android Status Bar */}
            <div className="pt-2 px-6 pb-1 flex items-center justify-between text-[11px] text-slate-300 z-20 font-medium select-none">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <Signal className="w-3 h-3 text-slate-300" />
                <Wifi className="w-3 h-3 text-slate-300" />
                <span className="text-[10px] font-mono">5G</span>
                <Battery className="w-3.5 h-3.5 text-slate-300" />
              </div>
            </div>

            {/* Inner Phone Screen */}
            <div className="relative flex-1 bg-[#0F1422] rounded-[32px] overflow-hidden flex flex-col text-slate-100">
              
              {/* Screen Content Container */}
              <div className="flex-1 overflow-y-auto scrollbar-none pb-16">
                
                {/* View 1: Event Details & Booking Flow */}
                {selectedEvent ? (
                  <div className="p-4 space-y-4">
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Feed</span>
                    </button>

                    <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-800">
                      <img
                        src={selectedEvent.bannerUrl}
                        alt={selectedEvent.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                      <div className="absolute bottom-2.5 left-3 right-3">
                        <span className="text-[10px] uppercase font-bold text-indigo-400">
                          {selectedEvent.category}
                        </span>
                        <h3 className="text-sm font-bold text-white line-clamp-1">
                          {selectedEvent.title}
                        </h3>
                      </div>
                    </div>

                    {bookingStep === 'details' && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-[11px] text-slate-300">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-indigo-400" />
                            <span>{selectedEvent.date}</span>
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 text-indigo-400" />
                            <span className="truncate">{selectedEvent.city}</span>
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                          {selectedEvent.description}
                        </p>

                        <div>
                          <span className="text-[11px] font-bold text-slate-300 block mb-1.5">
                            Select Tier:
                          </span>
                          <div className="space-y-1.5">
                            {selectedEvent.tiers.map(t => (
                              <button
                                key={t.id}
                                onClick={() => setSelectedTier(t)}
                                className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-colors ${
                                  selectedTier?.id === t.id
                                    ? 'bg-indigo-950/60 border-indigo-500 text-white'
                                    : 'bg-slate-900 border-slate-800 text-slate-400'
                                }`}
                              >
                                <div>
                                  <div className="font-bold text-white">{t.name}</div>
                                  <div className="text-[10px] text-slate-400">{t.availableCapacity} left</div>
                                </div>
                                <div className="text-sm font-extrabold text-white">₹{t.price}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs">
                          <span>Passes</span>
                          <div className="flex items-center gap-2">
                            <button
                              disabled={quantity <= 1}
                              onClick={() => setQuantity(q => Math.max(1, q - 1))}
                              className="w-6 h-6 rounded bg-slate-800 text-white flex items-center justify-center text-xs"
                            >
                              -
                            </button>
                            <span className="font-bold w-4 text-center">{quantity}</span>
                            <button
                              disabled={quantity >= 4}
                              onClick={() => setQuantity(q => Math.min(4, q + 1))}
                              className="w-6 h-6 rounded bg-slate-800 text-white flex items-center justify-center text-xs"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => setBookingStep('checkout')}
                          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                        >
                          Checkout (₹{Math.round((selectedTier?.price || 0) * quantity * 1.13).toLocaleString('en-IN')})
                        </button>
                      </div>
                    )}

                    {bookingStep === 'checkout' && (
                      <div className="space-y-3">
                        <div className="p-3 bg-indigo-950/40 border border-indigo-800/60 rounded-xl text-[11px] text-indigo-200">
                          <strong>Simulated Payment</strong>
                          <p className="mt-0.5 text-slate-400">Sandbox Android Google Pay simulation.</p>
                        </div>

                        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5 text-xs">
                          <div className="flex justify-between text-slate-400">
                            <span>Subtotal ({quantity}x)</span>
                            <span className="text-white">₹{((selectedTier?.price || 0) * quantity).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>Platform Fee & Tax</span>
                            <span className="text-white">₹{Math.round((selectedTier?.price || 0) * quantity * 0.13).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between font-bold text-white pt-1.5 border-t border-slate-800">
                            <span>Total</span>
                            <span className="text-indigo-400">₹{Math.round((selectedTier?.price || 0) * quantity * 1.13).toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        <button
                          onClick={handleCompleteCheckout}
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                        >
                          Confirm & Generate QR
                        </button>
                      </div>
                    )}

                    {bookingStep === 'confirmed' && confirmedBooking && (
                      <div className="text-center p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                        <h4 className="text-sm font-bold text-white">
                          Pass Confirmed!
                        </h4>
                        <div className="text-xs font-mono font-bold text-indigo-400">
                          {confirmedBooking.bookingReference}
                        </div>
                        {confirmedBooking.tickets[0]?.qrDataUrl && (
                          <div className="p-2 bg-white rounded-xl inline-block shadow-md">
                            <img
                              src={confirmedBooking.tickets[0].qrDataUrl}
                              alt="Ticket QR"
                              className="w-32 h-32"
                            />
                          </div>
                        )}
                        <p className="text-[11px] text-slate-400">
                          Available in your Android Digital Wallet.
                        </p>
                        <button
                          onClick={() => {
                            setSelectedEvent(null);
                            setActiveTab('tickets');
                          }}
                          className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl"
                        >
                          View in Passes
                        </button>
                      </div>
                    )}

                  </div>
                ) : (
                  <>
                    {/* Tab: Home */}
                    {activeTab === 'home' && (
                      <div className="p-4 space-y-4">
                        {/* App Bar */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">SMARTTICKET Android</span>
                            <h3 className="text-base font-extrabold text-white">Find Events</h3>
                          </div>
                          <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                            {currentUser.name[0]}
                          </div>
                        </div>

                        {/* Search Input */}
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                          <input
                            type="text"
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                            placeholder="Search concerts, sports..."
                            className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
                          />
                        </div>

                        {/* Featured Banner */}
                        <div 
                          onClick={() => handleStartBooking(events[0])}
                          className="relative h-32 rounded-2xl overflow-hidden bg-slate-800 cursor-pointer shadow-md group"
                        >
                          <img
                            src={events[0]?.bannerUrl}
                            alt="Featured"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                          <div className="absolute bottom-2 left-3 right-3">
                            <span className="text-[9px] font-bold text-indigo-400 uppercase">FEATURED EVENT</span>
                            <h4 className="text-xs font-bold text-white truncate">{events[0]?.title}</h4>
                            <span className="text-[10px] text-slate-300">From ₹{events[0]?.tiers[0]?.price}</span>
                          </div>
                        </div>

                        {/* Event Feed */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-white">Upcoming Events</span>
                            <span className="text-[10px] text-indigo-400">{filteredEvents.length} items</span>
                          </div>

                          <div className="space-y-2.5">
                            {filteredEvents.slice(0, 5).map(event => (
                              <div
                                key={event.id}
                                onClick={() => handleStartBooking(event)}
                                className="p-2.5 bg-slate-900 border border-slate-800/80 rounded-xl flex items-center gap-3 cursor-pointer hover:border-slate-700 transition-colors"
                              >
                                <img
                                  src={event.bannerUrl}
                                  alt={event.title}
                                  className="w-14 h-14 rounded-lg object-cover shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <span className="text-[9px] font-semibold text-indigo-400 uppercase">{event.category}</span>
                                  <h4 className="text-xs font-bold text-white truncate">{event.title}</h4>
                                  <div className="text-[10px] text-slate-400">{event.date} · {event.city}</div>
                                </div>
                                <div className="text-right shrink-0">
                                  <div className="text-xs font-extrabold text-white">₹{event.tiers[0]?.price}</div>
                                  <span className="text-[9px] text-indigo-400">Book</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}

                    {/* Tab: Tickets Wallet */}
                    {activeTab === 'tickets' && (
                      <div className="p-4 space-y-3">
                        <h3 className="text-base font-extrabold text-white">My Mobile Passes</h3>
                        {userBookings.length === 0 ? (
                          <div className="text-center py-10 text-slate-500 text-xs">
                            No tickets booked yet.
                          </div>
                        ) : (
                          userBookings.map(b => (
                            <div key={b.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="font-mono text-indigo-400 font-bold">{b.bookingReference}</span>
                                <span className="text-emerald-400 font-bold">{b.bookingStatus}</span>
                              </div>
                              <h4 className="text-xs font-bold text-white truncate">{b.eventTitle}</h4>
                              <div className="text-[10px] text-slate-400">{b.eventDate} · {b.tierName}</div>
                              {b.tickets[0]?.qrDataUrl && (
                                <div className="pt-2 text-center">
                                  <img
                                    src={b.tickets[0].qrDataUrl}
                                    alt="QR"
                                    className="w-24 h-24 mx-auto bg-white p-1 rounded-lg"
                                  />
                                  <div className="text-[9px] text-slate-500 mt-1 font-mono">Present at Turnstile</div>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {/* Tab: Staff Scanner */}
                    {activeTab === 'scanner' && (
                      <div className="p-4 space-y-3 text-center">
                        <h3 className="text-base font-extrabold text-white">Staff Gate Scanner</h3>
                        <p className="text-[11px] text-slate-400">Turnstile mobile scanner mode</p>
                        
                        <div className="relative h-44 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden">
                          <div className="w-32 h-32 border-2 border-emerald-400 rounded-xl relative flex items-center justify-center">
                            <div className="w-full h-0.5 bg-emerald-400 animate-pulse" />
                          </div>
                          <span className="absolute bottom-2 text-[10px] text-slate-400">Align QR Code inside box</span>
                        </div>

                        {scanResult && (
                          <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/80 rounded-xl text-xs text-emerald-300">
                            {scanResult}
                          </div>
                        )}

                        <button
                          onClick={() => {
                            const sampleTicket = ticketService.getTickets()[0];
                            if (sampleTicket) {
                              const res = ticketService.verifyAndAdmitTicket(sampleTicket.ticketNumber, 'Mobile Staff');
                              setScanResult(`${res.message} (${sampleTicket.ticketNumber})`);
                            }
                          }}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl"
                        >
                          Simulate Camera Scan
                        </button>
                      </div>
                    )}

                    {/* Tab: Profile */}
                    {activeTab === 'profile' && (
                      <div className="p-4 space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-xl">
                          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white">
                            {currentUser.name[0]}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">{currentUser.name}</div>
                            <div className="text-[10px] text-slate-400">{currentUser.email}</div>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs">
                          <div className="flex justify-between text-slate-400">
                            <span>Role</span>
                            <span className="text-white capitalize">{currentUser.role}</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>Account Status</span>
                            <span className="text-emerald-400">Verified</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>Sync Backend</span>
                            <span className="text-indigo-400">Cloud Firestore</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

              </div>

              {/* Android Bottom Navigation Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-14 bg-slate-950/95 border-t border-slate-800/80 px-4 flex items-center justify-around z-20">
                <button
                  onClick={() => {
                    setSelectedEvent(null);
                    setActiveTab('home');
                  }}
                  className={`flex flex-col items-center gap-0.5 text-[9px] ${
                    activeTab === 'home' && !selectedEvent ? 'text-indigo-400 font-bold' : 'text-slate-400'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedEvent(null);
                    setActiveTab('tickets');
                  }}
                  className={`flex flex-col items-center gap-0.5 text-[9px] ${
                    activeTab === 'tickets' ? 'text-indigo-400 font-bold' : 'text-slate-400'
                  }`}
                >
                  <TicketIcon className="w-4 h-4" />
                  <span>Passes</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedEvent(null);
                    setActiveTab('scanner');
                  }}
                  className={`flex flex-col items-center gap-0.5 text-[9px] ${
                    activeTab === 'scanner' ? 'text-emerald-400 font-bold' : 'text-slate-400'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>Scanner</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedEvent(null);
                    setActiveTab('profile');
                  }}
                  className={`flex flex-col items-center gap-0.5 text-[9px] ${
                    activeTab === 'profile' ? 'text-indigo-400 font-bold' : 'text-slate-400'
                  }`}
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Profile</span>
                </button>
              </div>

              {/* Android Home Navigation Pill */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-600/70 rounded-full z-30" />

            </div>

          </div>

        </div>

        {/* Right Side: Architecture & Native Flutter Code Inspector (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-white mb-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Unified Backend & Cross-Platform Sync</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Both this native Flutter Android app and the React web platform connect to the 
              <strong> same Cloud Firestore backend</strong>. When a ticket is reserved on either platform:
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-indigo-400 block mb-0.5">Atomic Inventory</span>
                <span className="text-slate-300 text-[11px]">Firestore Transaction prevents simultaneous overselling</span>
              </div>
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-0.5">Tamper-Proof QR</span>
                <span className="text-slate-300 text-[11px]">Cryptographic signature verified by staff in &lt; 0.2s</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400">
              The full native Flutter application source code is provided in the repository under <code>/flutter_app/lib</code>.
            </div>
          </div>

          {/* Flutter Code Inspector Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-purple-300 flex items-center gap-2">
                <Code className="w-4 h-4 text-purple-400" />
                <span>flutter_app/lib/services/firebase_service.dart</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">Dart 3.x</span>
            </div>

            <pre className="p-4 bg-slate-950/80 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-96 leading-relaxed">
{`import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../models/booking.dart';
import '../models/ticket.dart';

class FirebaseTicketService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;

  // Real-time transactional booking to prevent overbooking
  Future<Booking> bookTickets({
    required String eventId,
    required String tierId,
    required int quantity,
    required String attendeeName,
  }) async {
    return _firestore.runTransaction((transaction) async {
      final eventRef = _firestore.collection('events').doc(eventId);
      final snapshot = await transaction.get(eventRef);

      if (!snapshot.exists) {
        throw Exception("Event does not exist");
      }

      final data = snapshot.data()!;
      final int remainingCapacity = data['remainingCapacity'];

      if (remainingCapacity < quantity) {
        throw Exception("Ticket capacity exceeded. Only $remainingCapacity left.");
      }

      // Atomically decrement event capacity
      transaction.update(eventRef, {
        'remainingCapacity': FieldValue.increment(-quantity),
      });

      // Create booking record with secure reference
      final bookingRef = _firestore.collection('bookings').doc();
      final bookingData = {
        'id': bookingRef.id,
        'bookingReference': 'ST-2026-\${DateTime.now().millisecondsSinceEpoch}',
        'userId': _auth.currentUser?.uid,
        'quantity': quantity,
        'status': 'confirmed',
        'createdAt': FieldValue.serverTimestamp(),
      };

      transaction.set(bookingRef, bookingData);
      return Booking.fromMap(bookingData);
    });
  }
}`}
            </pre>
          </div>

        </div>

      </div>

    </div>
  );
};

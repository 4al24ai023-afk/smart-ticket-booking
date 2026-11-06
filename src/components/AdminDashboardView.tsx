import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Download, 
  Search, 
  Calendar, 
  DollarSign, 
  Ticket, 
  Users, 
  Trash2, 
  Edit3, 
  RotateCcw, 
  X, 
  Check, 
  TrendingUp, 
  AlertCircle 
} from 'lucide-react';
import { EventCategory, EventItem, TicketTier, User as AuthUser } from '../types';
import { ticketService } from '../services/ticketService';

interface AdminDashboardViewProps {
  currentUser: AuthUser;
  onSelectEvent: (event: EventItem) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  currentUser,
  onSelectEvent,
}) => {
  const [activeTab, setActiveTab] = useState<'events' | 'bookings'>('events');
  const [bookingSearch, setBookingSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // New Event Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCategory, setNewCategory] = useState<EventCategory>('Concerts');
  const [newVenue, setNewVenue] = useState('');
  const [newCity, setNewCity] = useState('Bengaluru, Karnataka');
  const [newDate, setNewDate] = useState('2026-12-25');
  const [newTime, setNewTime] = useState('19:00 - 23:00');
  const [newBanner, setNewBanner] = useState('/src/assets/images/hero_concert_stage_1793982773354.jpg');
  const [newDescription, setNewDescription] = useState('');
  const [newTierName, setNewTierName] = useState('General Admission');
  const [newTierPrice, setNewTierPrice] = useState(499);
  const [newTierCapacity, setNewTierCapacity] = useState(300);

  const stats = ticketService.getAdminStats();
  const events = ticketService.getEvents();
  const bookings = ticketService.getBookings();

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    const q = bookingSearch.toLowerCase();
    return (
      b.bookingReference.toLowerCase().includes(q) ||
      b.customerName.toLowerCase().includes(q) ||
      b.customerEmail.toLowerCase().includes(q) ||
      b.eventTitle.toLowerCase().includes(q)
    );
  });

  const handleExportCSV = () => {
    const csvContent = ticketService.exportBookingsCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `smartticket_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteEvent = (id: string) => {
    setActionError(null);
    try {
      ticketService.deleteEvent(id);
    } catch (err: any) {
      setActionError(err.message || 'Cannot delete event');
    }
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    try {
      const tier: TicketTier = {
        id: 'tier-' + Math.random().toString(36).substring(2, 8),
        name: newTierName,
        price: Number(newTierPrice),
        description: 'Standard admission to event highlights and seating areas',
        totalCapacity: Number(newTierCapacity),
        availableCapacity: Number(newTierCapacity),
      };

      ticketService.createEvent({
        title: newTitle.trim(),
        subtitle: newSubtitle.trim() || 'Premier Live Experience',
        category: newCategory,
        description: newDescription.trim() || 'Exclusive event experience curated for attendees.',
        venue: newVenue.trim() || 'City Arena & Auditorium',
        city: newCity.trim(),
        date: newDate,
        time: newTime,
        bannerUrl: newBanner,
        organizer: 'SMARTTICKET Productions',
        totalCapacity: tier.totalCapacity,
        status: 'published',
        tags: [newCategory, 'Featured'],
        tiers: [tier],
      });

      setIsCreateModalOpen(false);
      // Reset form
      setNewTitle('');
      setNewSubtitle('');
      setNewDescription('');
    } catch (err: any) {
      setActionError(err.message || 'Failed to create event');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Control Center</span>
            <span aria-hidden="true">·</span>
            <span>Lead: {currentUser.name}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Event & Booking Operations Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time sales telemetry, capacity management, anti-overbooking enforcement, and CSV audit reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export CSV Report</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Event</span>
          </button>
        </div>
      </div>

      {actionError && (
        <div className="p-4 bg-rose-950/60 border border-rose-800 rounded-xl flex items-center justify-between text-xs text-rose-300 mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-rose-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Total Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
            ₹{stats.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">
            {stats.confirmedBookingsCount} Confirmed Transactions
          </div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Tickets Sold</span>
            <Ticket className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
            {stats.ticketsSold}
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Across {stats.totalEvents} Live Events
          </div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Gate Check-In Rate</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
            {stats.checkInRate}%
          </div>
          <div className="text-[11px] text-purple-400 font-medium mt-1">
            {stats.ticketsCheckedIn} / {stats.ticketsSold} Attendees Admitted
          </div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Cancellation Rate</span>
            <RotateCcw className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
            {stats.totalBookings > 0 ? Math.round((stats.cancelledBookingsCount / stats.totalBookings) * 100) : 0}%
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            {stats.cancelledBookingsCount} Restored Inventory
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 mb-6">
        <button
          onClick={() => setActiveTab('events')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'events'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Event Management ({events.length})
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'bookings'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Booking Records & Audit ({bookings.length})
        </button>
      </div>

      {/* Tab 1: Event Management */}
      {activeTab === 'events' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Event Details</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Remaining / Total Capacity</th>
                  <th className="px-6 py-4">Ticket Price Range</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {events.map((event) => {
                  const lowest = Math.min(...event.tiers.map(t => t.price));
                  const highest = Math.max(...event.tiers.map(t => t.price));
                  const percent = Math.round((event.remainingCapacity / event.totalCapacity) * 100);

                  return (
                    <tr key={event.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white text-sm">{event.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{event.venue}, {event.city}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-indigo-300">
                        {event.category}
                      </td>
                      <td className="px-6 py-4">
                        <div>{event.date}</div>
                        <div className="text-[11px] text-slate-400">{event.time}</div>
                      </td>
                      <td className="px-6 py-4 min-w-[180px]">
                        <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
                          <span className="font-bold text-white">{event.remainingCapacity} Left</span>
                          <span className="text-slate-400">{event.totalCapacity} Total</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${percent < 20 ? 'bg-amber-400' : 'bg-indigo-500'}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-white">
                        ₹{lowest.toLocaleString('en-IN')} {highest > lowest ? `- ₹${highest.toLocaleString('en-IN')}` : ''}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => onSelectEvent(event)}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-1.5 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Bookings Records */}
      {activeTab === 'bookings' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                placeholder="Search by reference, customer name, email, or event..."
                className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none"
              />
            </div>
            <div className="text-xs text-slate-400">
              Showing <strong>{filteredBookings.length}</strong> of {bookings.length}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Reference</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Event & Tier</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Total (₹)</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-white">
                      {b.bookingReference}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{b.customerName}</div>
                      <div className="text-[11px] text-slate-400">{b.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-200">{b.eventTitle}</div>
                      <div className="text-[11px] text-indigo-400">{b.tierName}</div>
                    </td>
                    <td className="px-6 py-4 tabular-nums font-semibold">
                      {b.quantity} Passes
                    </td>
                    <td className="px-6 py-4 tabular-nums font-bold text-white">
                      ₹{b.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          b.bookingStatus === 'confirmed'
                            ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/80'
                            : 'bg-rose-950/70 text-rose-400 border border-rose-800/80'
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <h3 className="text-base font-bold text-white">
                Create & Publish New Event
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Synthwave Symphonic Arena Tour"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as EventCategory)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none"
                  >
                    <option value="Concerts">Concerts</option>
                    <option value="Tech & Hackathons">Tech & Hackathons</option>
                    <option value="Sports">Sports</option>
                    <option value="Workshops">Workshops</option>
                    <option value="College Events">College Events</option>
                    <option value="Film & Arts">Film & Arts</option>
                    <option value="Comedy">Comedy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Venue Name</label>
                  <input
                    type="text"
                    required
                    value={newVenue}
                    onChange={(e) => setNewVenue(e.target.value)}
                    placeholder="e.g. Civic Auditorium"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Time</label>
                  <input
                    type="text"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Select Banner Image</label>
                <select
                  value={newBanner}
                  onChange={(e) => setNewBanner(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none"
                >
                  <option value="/src/assets/images/hero_concert_stage_1793982773354.jpg">Concert Arena Stage (High-Res)</option>
                  <option value="/src/assets/images/event_tech_conference_1793982773968.jpg">Tech Keynote Hall (High-Res)</option>
                  <option value="/src/assets/images/event_sports_derby_1793982775413.jpg">Basketball Sports Derby (High-Res)</option>
                  <option value="/src/assets/images/event_workshop_design_1793982774197.jpg">Creative Studio Workshop (High-Res)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Overview, schedule, and attendee guidelines..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none"
                />
              </div>

              {/* Initial Tier Setup */}
              <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
                <span className="font-bold text-slate-200 block">Initial Ticket Tier Setup</span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-1">Tier Name</label>
                    <input
                      type="text"
                      required
                      value={newTierName}
                      onChange={(e) => setNewTierName(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-1">Price (₹)</label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={newTierPrice}
                      onChange={(e) => setNewTierPrice(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-1">Capacity</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={newTierCapacity}
                      onChange={(e) => setNewTierCapacity(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

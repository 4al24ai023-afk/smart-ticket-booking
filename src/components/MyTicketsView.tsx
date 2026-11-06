import React, { useState } from 'react';
import { 
  Ticket as TicketIcon, 
  Calendar, 
  MapPin, 
  Clock, 
  QrCode, 
  AlertTriangle, 
  Printer, 
  XCircle, 
  CheckCircle2, 
  Search,
  ExternalLink
} from 'lucide-react';
import { Booking, Ticket, User } from '../types';
import { ticketService } from '../services/ticketService';

interface MyTicketsViewProps {
  currentUser: User;
  onExploreEvents: () => void;
  onSelectBookingForView: (booking: Booking) => void;
}

export const MyTicketsView: React.FC<MyTicketsViewProps> = ({
  currentUser,
  onExploreEvents,
  onSelectBookingForView,
}) => {
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const allBookings = ticketService.getBookings();
  // Filter bookings: show current user bookings (or all if testing as customer/admin)
  const userBookings = allBookings.filter(
    b => b.userId === currentUser.id || b.customerEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  const filteredBookings = userBookings.filter(b => {
    if (filter === 'confirmed') return b.bookingStatus === 'confirmed';
    if (filter === 'cancelled') return b.bookingStatus === 'cancelled';
    return true;
  });

  const handleConfirmCancel = () => {
    if (!cancelModalBooking) return;
    try {
      ticketService.cancelBooking(cancelModalBooking.id);
      setCancelModalBooking(null);
      setCancelError(null);
    } catch (err: any) {
      setCancelError(err.message || 'Failed to cancel booking');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
            Customer Portal
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Tickets & Reservations
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Access your digital QR passes, check booking status, and manage reservations.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Bookings ({userBookings.length})
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filter === 'confirmed'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Confirmed ({userBookings.filter(b => b.bookingStatus === 'confirmed').length})
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filter === 'cancelled'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cancelled ({userBookings.filter(b => b.bookingStatus === 'cancelled').length})
          </button>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="p-12 bg-slate-900/60 border border-slate-800 rounded-2xl text-center max-w-xl mx-auto my-12">
          <TicketIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">
            No Bookings Found
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            You don't have any {filter !== 'all' ? filter : ''} bookings registered under {currentUser.email}.
          </p>
          <button
            onClick={onExploreEvents}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
          >
            Explore Live Events
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((booking) => {
            const isCancelled = booking.bookingStatus === 'cancelled';
            const allUsed = booking.tickets.every(t => t.status === 'used');
            const someUsed = booking.tickets.some(t => t.status === 'used');

            return (
              <div 
                key={booking.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition-all hover:border-slate-700"
              >
                {/* Booking Header Strip */}
                <div className="px-6 py-3.5 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">Ref:</span>
                    <span className="font-mono font-bold text-white tracking-wider">
                      {booking.bookingReference}
                    </span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400">
                      Booked {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                      isCancelled 
                        ? 'bg-rose-950/70 text-rose-400 border border-rose-800/80' 
                        : allUsed 
                        ? 'bg-slate-800 text-slate-400' 
                        : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/80'
                    }`}>
                      {isCancelled ? 'CANCELLED' : allUsed ? 'ALL CHECKED IN' : someUsed ? 'PARTIALLY ADMITTED' : 'CONFIRMED'}
                    </span>

                    <span className="text-white font-extrabold tabular-nums">
                      ₹{booking.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Booking Body */}
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2">
                        {booking.eventTitle}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mb-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{booking.eventDate}</span>
                        </div>
                        <span aria-hidden="true">·</span>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{booking.eventTime}</span>
                        </div>
                        <span aria-hidden="true">·</span>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{booking.eventVenue}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span>Tier: <strong className="text-white">{booking.tierName}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>Quantity: <strong className="text-white">{booking.quantity} Passes</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>Attendees: {booking.tickets.map(t => t.attendeeName).join(', ')}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                      <button
                        onClick={() => onSelectBookingForView(booking)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>View Digital Passes</span>
                      </button>

                      {!isCancelled && !someUsed && (
                        <button
                          onClick={() => {
                            setCancelModalBooking(booking);
                            setCancelError(null);
                          }}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-800 text-xs font-medium rounded-xl transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel Booking</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="w-10 h-10 rounded-full bg-rose-950/80 border border-rose-800 text-rose-400 flex items-center justify-center mb-4">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <h3 className="text-base font-bold text-white mb-2">
              Cancel Booking {cancelModalBooking.bookingReference}?
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Cancelling will invalidate all <strong>{cancelModalBooking.quantity} digital QR passes</strong>. 
              The inventory will be automatically restored to the event available capacity.
            </p>

            {cancelError && (
              <div className="p-3 bg-rose-950/50 border border-rose-800 rounded-xl text-xs text-rose-300 mb-4">
                {cancelError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setCancelModalBooking(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
              >
                Keep Reservation
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/30 transition-all"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

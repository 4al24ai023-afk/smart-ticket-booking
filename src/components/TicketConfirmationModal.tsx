import React from 'react';
import { 
  X, 
  CheckCircle2, 
  Download, 
  Printer, 
  Calendar, 
  Clock, 
  MapPin, 
  QrCode, 
  ShieldCheck, 
  Smartphone 
} from 'lucide-react';
import { Booking } from '../types';

interface TicketConfirmationModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onGoToMyTickets: () => void;
}

export const TicketConfirmationModal: React.FC<TicketConfirmationModalProps> = ({
  booking,
  isOpen,
  onClose,
  onGoToMyTickets,
}) => {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQR = (qrDataUrl: string | undefined, ticketNumber: string) => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `smartticket_${ticketNumber}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70 no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              Booking Confirmed & Digital Tickets Issued
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Booking Reference Card */}
          <div className="p-5 bg-gradient-to-r from-indigo-950/50 via-slate-950 to-purple-950/40 border border-indigo-800/60 rounded-2xl text-center">
            <span className="text-xs uppercase tracking-widest font-semibold text-indigo-400">
              Unique Booking Reference
            </span>
            <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-widest mt-1 mb-2">
              {booking.bookingReference}
            </div>
            <p className="text-xs text-slate-300">
              Reserved for <strong className="text-white">{booking.customerName}</strong> ({booking.customerEmail})
            </p>
          </div>

          {/* Individual Digital Tickets */}
          <div>
            <div className="flex items-center justify-between mb-3 no-print">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Digital Gate Passes ({booking.tickets.length})
              </h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors border border-slate-700"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print All</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {booking.tickets.map((ticket, index) => (
                <div 
                  key={ticket.id}
                  className="ticket-card-print relative flex flex-col md:flex-row items-stretch bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-lg"
                >
                  {/* Left Side: Ticket Event & Attendee Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 text-[11px] text-indigo-400 font-semibold mb-1">
                        <span className="font-mono">{ticket.ticketNumber}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/80 uppercase font-bold text-[10px]">
                          {ticket.status}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white mb-1">
                        {ticket.eventTitle}
                      </h3>

                      <div className="text-xs text-slate-300 mb-3">
                        Tier: <span className="font-bold text-white">{ticket.tierName}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{ticket.eventDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{ticket.eventTime}</span>
                        </div>
                        <div className="col-span-2 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span className="truncate">{ticket.eventVenue}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 text-[11px]">Pass Holder: </span>
                        <strong className="text-white">{ticket.attendeeName}</strong>
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        Pass #{index + 1} of {booking.quantity}
                      </div>
                    </div>
                  </div>

                  {/* Perforation Divider (Hidden in print) */}
                  <div className="hidden md:flex flex-col justify-between items-center py-2 relative w-px bg-slate-800">
                    <div className="ticket-notch-left" />
                    <div className="w-px h-full border-r border-dashed border-slate-700" />
                    <div className="ticket-notch-right" />
                  </div>

                  {/* Right Side: QR Code & Gate Verification Token */}
                  <div className="p-5 md:w-56 bg-slate-900/60 flex flex-col items-center justify-center text-center border-t md:border-t-0 md:border-l border-slate-800">
                    {ticket.qrDataUrl ? (
                      <div className="p-2 bg-white rounded-xl shadow-md">
                        <img 
                          src={ticket.qrDataUrl} 
                          alt={`QR Code for ${ticket.ticketNumber}`}
                          className="w-28 h-28 object-contain" 
                        />
                      </div>
                    ) : (
                      <div className="w-28 h-28 bg-slate-800 rounded-xl flex items-center justify-center">
                        <QrCode className="w-10 h-10 text-slate-500" />
                      </div>
                    )}

                    <div className="mt-2 text-[10px] font-mono text-slate-400">
                      Scan at Gate
                    </div>

                    <button
                      onClick={() => handleDownloadQR(ticket.qrDataUrl, ticket.ticketNumber)}
                      className="no-print mt-2 flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download QR</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800 no-print">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Anti-scalp cryptographic token embedded</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
              >
                Close
              </button>
              <button
                onClick={onGoToMyTickets}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
              >
                View in My Tickets
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

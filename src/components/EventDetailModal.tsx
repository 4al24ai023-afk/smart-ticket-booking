import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Users, 
  Check, 
  Plus, 
  Minus, 
  ArrowRight,
  Info
} from 'lucide-react';
import { EventItem, TicketTier } from '../types';

interface EventDetailModalProps {
  event: EventItem | null;
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: (event: EventItem, tier: TicketTier, quantity: number) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  onProceedToCheckout,
}) => {
  if (!isOpen || !event) return null;

  const [selectedTierId, setSelectedTierId] = useState<string>(
    event.tiers.find(t => t.availableCapacity > 0)?.id || event.tiers[0]?.id || ''
  );
  const [quantity, setQuantity] = useState<number>(1);

  const selectedTier = event.tiers.find(t => t.id === selectedTierId) || event.tiers[0];
  const maxAllowed = Math.min(6, selectedTier?.availableCapacity || 1);

  // Price calculations
  const unitPrice = selectedTier?.price || 0;
  const subtotal = unitPrice * quantity;
  const platformFee = Math.round(subtotal * 0.05 * 100) / 100;
  const taxAmount = Math.round(subtotal * 0.08 * 100) / 100;
  const totalAmount = Math.round((subtotal + platformFee + taxAmount) * 100) / 100;

  const isSoldOut = !selectedTier || selectedTier.availableCapacity <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-slate-950/70 hover:bg-slate-950 text-slate-400 hover:text-white rounded-full transition-colors border border-slate-700/60"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Banner */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-800">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
              <span>{event.category}</span>
              <span aria-hidden="true">·</span>
              <span>Organized by {event.organizer}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              {event.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 line-clamp-1 mt-0.5">
              {event.subtitle}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Event Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-950/50 border border-slate-800/80 rounded-xl text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <div className="text-slate-400 text-[11px]">Event Date</div>
                <div className="font-semibold text-white">
                  {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <div className="text-slate-400 text-[11px]">Session Time</div>
                <div className="font-semibold text-white">{event.time}</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <div className="text-slate-400 text-[11px]">Venue & City</div>
                <div className="font-semibold text-white truncate max-w-[170px]" title={`${event.venue}, ${event.city}`}>
                  {event.city}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              About This Event
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Ticket Tier Selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                1. Select Ticket Tier
              </h4>
              <span className="text-xs text-slate-400">
                Total Remaining Capacity: <strong className="text-white tabular-nums">{event.remainingCapacity}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {event.tiers.map((tier) => {
                const isSelected = tier.id === selectedTierId;
                const tierSoldOut = tier.availableCapacity <= 0;

                return (
                  <button
                    key={tier.id}
                    type="button"
                    disabled={tierSoldOut}
                    onClick={() => {
                      setSelectedTierId(tier.id);
                      setQuantity(1);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all relative ${
                      tierSoldOut
                        ? 'border-slate-800 bg-slate-950/40 opacity-50 cursor-not-allowed'
                        : isSelected
                        ? 'border-indigo-500 bg-indigo-950/30 shadow-md ring-1 ring-indigo-500'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className="text-xs font-bold text-white truncate">
                        {tier.name}
                      </span>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="text-lg font-extrabold text-white tabular-nums mb-1">
                      ₹{tier.price.toLocaleString('en-IN')}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-snug">
                      {tier.description}
                    </p>
                    <div className="mt-2 text-[10px] font-medium text-slate-400">
                      {tierSoldOut ? (
                        <span className="text-rose-400 font-bold">Sold Out</span>
                      ) : (
                        <span><strong className="text-indigo-300 tabular-nums">{tier.availableCapacity}</strong> tickets left</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector */}
          {!isSoldOut && (
            <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800/80 rounded-xl">
              <div>
                <div className="text-xs font-bold text-white">Number of Tickets</div>
                <div className="text-[11px] text-slate-400">Limit: up to 6 tickets per transaction</div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-base font-bold text-white tabular-nums w-6 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={quantity >= maxAllowed}
                  onClick={() => setQuantity(q => Math.min(maxAllowed, q + 1))}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Pricing Breakdown & Checkout Action */}
          <div className="p-4 sm:p-5 bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-950 border border-indigo-900/50 rounded-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span>Ticket Subtotal ({quantity} × ₹{unitPrice.toLocaleString('en-IN')})</span>
              <span className="font-semibold text-slate-200 tabular-nums">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span>Platform Service & Verification Fee (5%)</span>
              <span className="font-semibold text-slate-200 tabular-nums">₹{platformFee.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span>Entertainment Tax (8%)</span>
              <span className="font-semibold text-slate-200 tabular-nums">₹{taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Total Booking Price</div>
                <div className="text-2xl font-extrabold text-white tabular-nums">
                  ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <button
                type="button"
                disabled={isSoldOut}
                onClick={() => {
                  if (selectedTier) {
                    onProceedToCheckout(event, selectedTier, quantity);
                  }
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-xl transition-all ${
                  isSoldOut
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                }`}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  CreditCard, 
  Smartphone, 
  Wallet, 
  ShieldCheck, 
  AlertCircle, 
  Lock, 
  Loader2, 
  User, 
  Mail, 
  Phone 
} from 'lucide-react';
import { Booking, EventItem, TicketTier, User as AuthUser } from '../types';
import { ticketService } from '../services/ticketService';

interface CheckoutModalProps {
  event: EventItem | null;
  tier: TicketTier | null;
  quantity: number;
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser;
  onBookingSuccess: (booking: Booking) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  event,
  tier,
  quantity,
  isOpen,
  onClose,
  currentUser,
  onBookingSuccess,
}) => {
  if (!isOpen || !event || !tier) return null;

  const [customerName, setCustomerName] = useState(currentUser.name || 'Alex Rivera');
  const [customerEmail, setCustomerEmail] = useState(currentUser.email || 'alex.rivera@example.com');
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone || '+91 98765 43210');
  
  // Attendee names for individual tickets
  const [attendeeNames, setAttendeeNames] = useState<string[]>(
    Array.from({ length: quantity }, (_, idx) => idx === 0 ? currentUser.name || 'Alex Rivera' : `Guest ${idx + 1}`)
  );

  const [paymentMethod, setPaymentMethod] = useState<'demo_card' | 'demo_upi' | 'demo_wallet'>('demo_card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Financial calculations
  const unitPrice = tier.price;
  const subtotal = unitPrice * quantity;
  const platformFee = Math.round(subtotal * 0.05 * 100) / 100;
  const taxAmount = Math.round(subtotal * 0.08 * 100) / 100;
  const totalAmount = Math.round((subtotal + platformFee + taxAmount) * 100) / 100;

  const handleAttendeeNameChange = (idx: number, val: string) => {
    const updated = [...attendeeNames];
    updated[idx] = val;
    setAttendeeNames(updated);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      // Simulate real-time network latency for payment gateway authorization
      await new Promise(res => setTimeout(res, 850));

      const booking = await ticketService.createBooking({
        eventId: event.id,
        tierId: tier.id,
        quantity,
        attendeeNames,
        customerName: customerName.trim() || 'Alex Rivera',
        customerEmail: customerEmail.trim() || 'alex.rivera@example.com',
        customerPhone: customerPhone.trim() || '+1 (555) 234-5678',
        paymentMethod,
      });

      // Fire celebratory confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#3b82f6', '#10b981'],
      });

      onBookingSuccess(booking);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment simulation failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              Complete Your Reservation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleConfirmBooking} className="p-6 space-y-6">
          
          {/* Transparent Simulation Notice Banner */}
          <div className="p-3.5 bg-indigo-950/40 border border-indigo-800/60 rounded-xl flex items-start gap-3 text-xs text-indigo-200">
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">Simulated Payment Gateway (Sandbox Mode)</span>
              <p className="mt-0.5 text-slate-300">
                This is a simulated hackathon transaction. No real funds or credit cards are charged. 
                Unique cryptographically signed QR tickets will be generated instantly.
              </p>
            </div>
          </div>

          {/* Booking Summary Strip */}
          <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-white text-sm">{event.title}</div>
              <div className="text-slate-400 mt-0.5">
                {tier.name} · {quantity} {quantity === 1 ? 'Ticket' : 'Tickets'} · {event.venue}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-slate-400">Total Price</div>
              <div className="text-lg font-extrabold text-white tabular-nums">₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>

          {/* Customer Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              1. Primary Contact Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700/80 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700/80 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700/80 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Attendee Names for each ticket */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              2. Attendee Passes ({quantity})
            </h4>
            <div className="space-y-2">
              {attendeeNames.map((name, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-400 w-16 shrink-0">
                    Pass #{idx + 1}:
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleAttendeeNameChange(idx, e.target.value)}
                    placeholder={`Attendee ${idx + 1} Name`}
                    className="flex-1 px-3 py-2 bg-slate-800/80 border border-slate-700/80 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              3. Select Demo Payment Method
            </h4>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('demo_card')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'demo_card'
                    ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4 mx-auto mb-1 text-indigo-400" />
                <span className="text-xs font-semibold block">Demo Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('demo_upi')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'demo_upi'
                    ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4 mx-auto mb-1 text-purple-400" />
                <span className="text-xs font-semibold block">Simulated UPI</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('demo_wallet')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'demo_wallet'
                    ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                }`}
              >
                <Wallet className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                <span className="text-xs font-semibold block">Demo Wallet</span>
              </button>
            </div>

            {/* Payment Fields */}
            {paymentMethod === 'demo_card' && (
              <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-xl space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Simulated Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700/80 rounded-lg text-xs font-mono text-white focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Expires</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700/80 rounded-lg text-xs font-mono text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">CVV</label>
                    <input
                      type="text"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700/80 rounded-lg text-xs font-mono text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'demo_upi' && (
              <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-xl text-center">
                <div className="text-xs text-slate-300 font-semibold mb-1">Simulated UPI Instant Transfer</div>
                <div className="text-[11px] text-slate-400">Virtual ID: <code>alex@okhdfcbank</code></div>
                <div className="mt-2 text-[10px] text-emerald-400 font-semibold">Simulated Instant Approval Enabled</div>
              </div>
            )}

            {paymentMethod === 'demo_wallet' && (
              <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-xl text-center">
                <div className="text-xs text-slate-300 font-semibold mb-1">SMARTTICKET Stored Credits</div>
                <div className="text-[11px] text-slate-400">Available Balance: <strong className="text-white">₹5,000.00</strong></div>
              </div>
            )}
          </div>

          {/* Error Message if any */}
          {errorMessage && (
            <div className="p-3 bg-rose-950/50 border border-rose-800/80 rounded-xl flex items-center gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Locking Inventory & Generating QR...</span>
                </>
              ) : (
                <span>Confirm Booking & Authorize ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

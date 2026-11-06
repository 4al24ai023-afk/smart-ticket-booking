export type UserRole = 'customer' | 'admin' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

export type EventCategory = 
  | 'Concerts' 
  | 'Tech & Hackathons' 
  | 'Sports' 
  | 'Workshops' 
  | 'College Events' 
  | 'Film & Arts'
  | 'Comedy';

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  description: string;
  totalCapacity: number;
  availableCapacity: number;
}

export interface EventItem {
  id: string;
  title: string;
  subtitle: string;
  category: EventCategory;
  description: string;
  venue: string;
  city: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "18:00 - 22:30"
  bannerUrl: string;
  organizer: string;
  totalCapacity: number;
  remainingCapacity: number;
  tiers: TicketTier[];
  status: 'published' | 'draft' | 'cancelled' | 'sold_out';
  featured?: boolean;
  tags: string[];
}

export interface Ticket {
  id: string;
  ticketNumber: string; // e.g. "TK-8491-01"
  bookingId: string;
  bookingReference: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  tierId: string;
  tierName: string;
  attendeeName: string;
  attendeeEmail: string;
  price: number;
  qrToken: string;
  qrDataUrl?: string;
  status: 'valid' | 'used' | 'cancelled';
  usedAt?: string;
  usedByStaffId?: string;
  usedByStaffName?: string;
}

export interface Booking {
  id: string;
  bookingReference: string; // e.g. "ST-2026-X8K9M2"
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  tierId: string;
  tierName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  platformFee: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: 'demo_card' | 'demo_upi' | 'demo_wallet';
  paymentReference: string;
  paymentStatus: 'completed' | 'refunded' | 'failed';
  bookingStatus: 'confirmed' | 'cancelled';
  tickets: Ticket[];
  createdAt: string;
  cancelledAt?: string;
}

export interface VerificationResult {
  status: 'valid' | 'already_used' | 'cancelled' | 'invalid';
  message: string;
  ticket?: Ticket;
  event?: EventItem;
  scannedAt: string;
  staffName: string;
}

export interface CheckInLogEntry {
  id: string;
  ticketNumber: string;
  bookingReference: string;
  eventTitle: string;
  attendeeName: string;
  tierName: string;
  scannedAt: string;
  status: 'admitted' | 'duplicate_blocked' | 'cancelled_blocked' | 'invalid_token';
  staffName: string;
}

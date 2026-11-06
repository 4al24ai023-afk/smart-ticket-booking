import QRCode from 'qrcode';
import { INITIAL_EVENTS } from '../data/seedEvents';
import { 
  Booking, 
  CheckInLogEntry, 
  EventCategory, 
  EventItem, 
  Ticket, 
  TicketTier, 
  User, 
  UserRole, 
  VerificationResult 
} from '../types';

const STORAGE_KEYS = {
  EVENTS: 'smartticket_events_v2',
  BOOKINGS: 'smartticket_bookings_v2',
  TICKETS: 'smartticket_tickets_v2',
  CHECKIN_LOGS: 'smartticket_checkin_logs_v2',
  CURRENT_USER: 'smartticket_auth_user_v2',
};

// Default seed users for easy testing and role switching
export const DEFAULT_USERS: Record<UserRole, User> = {
  customer: {
    id: 'usr_customer_alex',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    role: 'customer',
    phone: '+91 98765 43210',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-10-15T12:00:00Z',
  },
  admin: {
    id: 'usr_admin_elena',
    name: 'Elena Rostova (Lead Ops)',
    email: 'admin@smartticket.io',
    role: 'admin',
    phone: '+91 98765 12345',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-09-01T08:00:00Z',
  },
  staff: {
    id: 'usr_staff_marcus',
    name: 'Marcus Vance (Gate Team)',
    email: 'staff.marcus@smartticket.io',
    role: 'staff',
    phone: '+91 98765 67890',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-10-01T09:30:00Z',
  },
};

class TicketService {
  private events: EventItem[] = [];
  private bookings: Booking[] = [];
  private tickets: Ticket[] = [];
  private checkInLogs: CheckInLogEntry[] = [];
  private currentUser: User = DEFAULT_USERS.customer;
  private listeners: (() => void)[] = [];

  constructor() {
    this.initializeFromStorage();
  }

  private initializeFromStorage() {
    try {
      // Load Events
      const storedEvents = localStorage.getItem(STORAGE_KEYS.EVENTS);
      if (storedEvents) {
        this.events = JSON.parse(storedEvents);
      } else {
        this.events = [...INITIAL_EVENTS];
        this.saveEvents();
      }

      // Load Bookings
      const storedBookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (storedBookings) {
        this.bookings = JSON.parse(storedBookings);
      } else {
        this.bookings = [];
      }

      // Load Tickets
      const storedTickets = localStorage.getItem(STORAGE_KEYS.TICKETS);
      if (storedTickets) {
        this.tickets = JSON.parse(storedTickets);
      } else {
        this.tickets = [];
      }

      // Load Check-In Logs
      const storedLogs = localStorage.getItem(STORAGE_KEYS.CHECKIN_LOGS);
      if (storedLogs) {
        this.checkInLogs = JSON.parse(storedLogs);
      } else {
        this.checkInLogs = [];
      }

      // Load Auth User
      const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      } else {
        this.currentUser = DEFAULT_USERS.customer;
        this.saveCurrentUser();
      }

      // If bookings are empty, generate an initial sample booking for testing convenience
      if (this.bookings.length === 0 && this.events.length > 0) {
        this.seedInitialBooking();
      }
    } catch (err) {
      console.error('Failed to initialize storage:', err);
      this.events = [...INITIAL_EVENTS];
      this.currentUser = DEFAULT_USERS.customer;
    }
  }

  private async seedInitialBooking() {
    const event = this.events[0];
    const tier = event.tiers[0];
    try {
      await this.createBooking({
        eventId: event.id,
        tierId: tier.id,
        quantity: 2,
        attendeeNames: ['Alex Rivera', 'Jordan Taylor'],
        customerName: 'Alex Rivera',
        customerEmail: 'alex.rivera@example.com',
        customerPhone: '+1 (555) 234-5678',
        paymentMethod: 'demo_card',
      });
    } catch (e) {
      console.warn('Initial sample booking error:', e);
    }
  }

  private saveEvents() {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(this.events));
  }

  private saveBookings() {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(this.bookings));
  }

  private saveTickets() {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(this.tickets));
  }

  private saveCheckInLogs() {
    localStorage.setItem(STORAGE_KEYS.CHECKIN_LOGS, JSON.stringify(this.checkInLogs));
  }

  private saveCurrentUser() {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  // --- AUTHENTICATION & USERS ---
  public getCurrentUser(): User {
    return this.currentUser;
  }

  public switchRole(role: UserRole) {
    this.currentUser = DEFAULT_USERS[role];
    this.saveCurrentUser();
    this.notify();
  }

  public login(email: string, _pass: string, role: UserRole = 'customer'): User {
    const existing = Object.values(DEFAULT_USERS).find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      this.currentUser = existing;
    } else {
      this.currentUser = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        name: email.split('@')[0].replace(/[._]/g, ' '),
        email,
        role,
        createdAt: new Date().toISOString(),
      };
    }
    this.saveCurrentUser();
    this.notify();
    return this.currentUser;
  }

  public register(name: string, email: string, _pass: string, role: UserRole = 'customer'): User {
    this.currentUser = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
    };
    this.saveCurrentUser();
    this.notify();
    return this.currentUser;
  }

  public logout() {
    this.currentUser = DEFAULT_USERS.customer;
    this.saveCurrentUser();
    this.notify();
  }

  // --- EVENTS ---
  public getEvents(): EventItem[] {
    return [...this.events];
  }

  public getEventById(id: string): EventItem | undefined {
    return this.events.find(e => e.id === id);
  }

  public createEvent(data: Omit<EventItem, 'id' | 'remainingCapacity'>): EventItem {
    const totalCap = data.tiers.reduce((acc, t) => acc + t.totalCapacity, 0);
    const newEvent: EventItem = {
      ...data,
      id: 'evt-' + Math.random().toString(36).substring(2, 9),
      totalCapacity: totalCap,
      remainingCapacity: totalCap,
      tiers: data.tiers.map(t => ({
        ...t,
        id: t.id || 'tier-' + Math.random().toString(36).substring(2, 8),
        availableCapacity: t.totalCapacity,
      })),
    };
    this.events.unshift(newEvent);
    this.saveEvents();
    this.notify();
    return newEvent;
  }

  public updateEvent(id: string, updates: Partial<EventItem>): EventItem {
    const index = this.events.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Event not found');

    const updated = { ...this.events[index], ...updates };
    this.events[index] = updated;
    this.saveEvents();
    this.notify();
    return updated;
  }

  public deleteEvent(id: string): boolean {
    const hasActiveBookings = this.bookings.some(
      b => b.eventId === id && b.bookingStatus === 'confirmed'
    );
    if (hasActiveBookings) {
      throw new Error('Cannot delete event with confirmed bookings. Please cancel bookings or archive the event.');
    }
    this.events = this.events.filter(e => e.id !== id);
    this.saveEvents();
    this.notify();
    return true;
  }

  // --- TRANSACTIONAL BOOKING CREATION ---
  public async createBooking(params: {
    eventId: string;
    tierId: string;
    quantity: number;
    attendeeNames: string[];
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    paymentMethod: 'demo_card' | 'demo_upi' | 'demo_wallet';
  }): Promise<Booking> {
    const { eventId, tierId, quantity, attendeeNames, customerName, customerEmail, customerPhone, paymentMethod } = params;

    // 1. Transactional check: event and tier
    const event = this.events.find(e => e.id === eventId);
    if (!event) throw new Error('Selected event was not found.');

    const tier = event.tiers.find(t => t.id === tierId);
    if (!tier) throw new Error('Selected ticket tier was not found.');

    // 2. Prevent overbooking
    if (tier.availableCapacity < quantity) {
      throw new Error(`Only ${tier.availableCapacity} tickets remaining in the "${tier.name}" tier. Requested: ${quantity}.`);
    }

    if (event.remainingCapacity < quantity) {
      throw new Error(`Event remaining capacity is ${event.remainingCapacity}. Cannot allocate ${quantity} tickets.`);
    }

    // 3. Atomically decrement capacities (Simulating Firestore Transaction)
    tier.availableCapacity -= quantity;
    event.remainingCapacity -= quantity;
    if (event.remainingCapacity <= 0) {
      event.status = 'sold_out';
    }

    // 4. Calculate prices
    const unitPrice = tier.price;
    const subtotal = unitPrice * quantity;
    const platformFee = Math.round(subtotal * 0.05 * 100) / 100; // 5% fee
    const taxAmount = Math.round(subtotal * 0.08 * 100) / 100; // 8% tax
    const totalAmount = Math.round((subtotal + platformFee + taxAmount) * 100) / 100;

    // 5. Generate secure, unpredictable Booking Reference
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const timestampSeq = Date.now().toString(36).substring(4).toUpperCase();
    const bookingReference = `ST-2026-${randomHex}${timestampSeq}`;
    const bookingId = 'bk_' + Math.random().toString(36).substring(2, 10);
    const paymentReference = 'SIM_PAY_' + Math.random().toString(36).substring(2, 12).toUpperCase();

    // 6. Generate individual Tickets with tamper-proof QR tokens
    const createdTickets: Ticket[] = [];
    for (let i = 0; i < quantity; i++) {
      const ticketId = 'tk_' + Math.random().toString(36).substring(2, 11);
      const ticketNumber = `TK-${bookingReference.replace('ST-2026-', '')}-${String(i + 1).padStart(2, '0')}`;
      const attendee = attendeeNames[i] || customerName;

      // Tamper-proof token without leaking sensitive customer PII:
      // STK:v1:{ticketId}:{eventId}:{signatureToken}
      const signatureToken = Math.random().toString(36).substring(2, 14);
      const qrToken = `STK:v1:${ticketId}:${eventId}:${signatureToken}`;

      // Generate Data URL for QR code
      let qrDataUrl = '';
      try {
        qrDataUrl = await QRCode.toDataURL(qrToken, {
          width: 300,
          margin: 2,
          color: {
            dark: '#0B0F19',
            light: '#FFFFFF',
          },
        });
      } catch (err) {
        console.error('Failed to generate QR data URL:', err);
      }

      const ticket: Ticket = {
        id: ticketId,
        ticketNumber,
        bookingId,
        bookingReference,
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        eventTime: event.time,
        eventVenue: event.venue,
        tierId: tier.id,
        tierName: tier.name,
        attendeeName: attendee,
        attendeeEmail: customerEmail,
        price: unitPrice,
        qrToken,
        qrDataUrl,
        status: 'valid',
      };

      createdTickets.push(ticket);
      this.tickets.unshift(ticket);
    }

    const booking: Booking = {
      id: bookingId,
      bookingReference,
      userId: this.currentUser.id,
      customerName,
      customerEmail,
      customerPhone,
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      eventVenue: event.venue,
      tierId: tier.id,
      tierName: tier.name,
      quantity,
      unitPrice,
      subtotal,
      platformFee,
      taxAmount,
      totalAmount,
      paymentMethod,
      paymentReference,
      paymentStatus: 'completed',
      bookingStatus: 'confirmed',
      tickets: createdTickets,
      createdAt: new Date().toISOString(),
    };

    this.bookings.unshift(booking);

    // Commit changes to storage
    this.saveEvents();
    this.saveBookings();
    this.saveTickets();
    this.notify();

    return booking;
  }

  // --- CANCELLATIONS & INVENTORY RESTORATION ---
  public cancelBooking(bookingId: string): Booking {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (!booking) throw new Error('Booking not found');

    if (booking.bookingStatus === 'cancelled') {
      throw new Error('This booking is already cancelled.');
    }

    // Check if any ticket was already used
    const hasUsedTickets = booking.tickets.some(t => t.status === 'used');
    if (hasUsedTickets) {
      throw new Error('Cannot cancel a booking where tickets have already been scanned/checked in.');
    }

    // Update booking status
    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';
    booking.cancelledAt = new Date().toISOString();

    // Mark all tickets as cancelled
    booking.tickets.forEach(ticket => {
      ticket.status = 'cancelled';
      const globalTicket = this.tickets.find(t => t.id === ticket.id);
      if (globalTicket) {
        globalTicket.status = 'cancelled';
      }
    });

    // Safely restore ticket inventory to the event & tier!
    const event = this.events.find(e => e.id === booking.eventId);
    if (event) {
      event.remainingCapacity += booking.quantity;
      if (event.status === 'sold_out' && event.remainingCapacity > 0) {
        event.status = 'published';
      }
      const tier = event.tiers.find(t => t.id === booking.tierId);
      if (tier) {
        tier.availableCapacity += booking.quantity;
      }
    }

    this.saveEvents();
    this.saveBookings();
    this.saveTickets();
    this.notify();

    return booking;
  }

  // --- TICKET VERIFICATION & STAFF GATE CHECK-IN ---
  public verifyAndAdmitTicket(tokenOrNumber: string, staffName: string): VerificationResult {
    const cleaned = tokenOrNumber.trim();
    const scannedAt = new Date().toISOString();

    // Match either by qrToken or ticketNumber
    const ticket = this.tickets.find(
      t => t.qrToken === cleaned || t.ticketNumber.toLowerCase() === cleaned.toLowerCase()
    );

    if (!ticket) {
      const logEntry: CheckInLogEntry = {
        id: 'log_' + Math.random().toString(36).substring(2, 9),
        ticketNumber: cleaned,
        bookingReference: 'UNKNOWN',
        eventTitle: 'Unknown Event',
        attendeeName: 'Unknown Attendee',
        tierName: 'Unknown',
        scannedAt,
        status: 'invalid_token',
        staffName,
      };
      this.checkInLogs.unshift(logEntry);
      this.saveCheckInLogs();
      this.notify();

      return {
        status: 'invalid',
        message: 'Security token or ticket number not recognized. Potential counterfeit or invalid ticket.',
        scannedAt,
        staffName,
      };
    }

    const event = this.events.find(e => e.id === ticket.eventId);

    // Check if cancelled
    if (ticket.status === 'cancelled') {
      const logEntry: CheckInLogEntry = {
        id: 'log_' + Math.random().toString(36).substring(2, 9),
        ticketNumber: ticket.ticketNumber,
        bookingReference: ticket.bookingReference,
        eventTitle: ticket.eventTitle,
        attendeeName: ticket.attendeeName,
        tierName: ticket.tierName,
        scannedAt,
        status: 'cancelled_blocked',
        staffName,
      };
      this.checkInLogs.unshift(logEntry);
      this.saveCheckInLogs();
      this.notify();

      return {
        status: 'cancelled',
        message: 'This ticket was CANCELLED / REFUNDED by customer or organizer. Entry Denied.',
        ticket,
        event,
        scannedAt,
        staffName,
      };
    }

    // Check if already used
    if (ticket.status === 'used') {
      const logEntry: CheckInLogEntry = {
        id: 'log_' + Math.random().toString(36).substring(2, 9),
        ticketNumber: ticket.ticketNumber,
        bookingReference: ticket.bookingReference,
        eventTitle: ticket.eventTitle,
        attendeeName: ticket.attendeeName,
        tierName: ticket.tierName,
        scannedAt,
        status: 'duplicate_blocked',
        staffName,
      };
      this.checkInLogs.unshift(logEntry);
      this.saveCheckInLogs();
      this.notify();

      const timeFormatted = ticket.usedAt ? new Date(ticket.usedAt).toLocaleTimeString() : 'Earlier';
      return {
        status: 'already_used',
        message: `Duplicate entry blocked! This ticket was ALREADY USED at ${timeFormatted} by ${ticket.usedByStaffName || 'Staff'}.`,
        ticket,
        event,
        scannedAt,
        staffName,
      };
    }

    // Ticket is valid: atomically mark as USED (single check-in guarantee)
    ticket.status = 'used';
    ticket.usedAt = scannedAt;
    ticket.usedByStaffId = this.currentUser.id;
    ticket.usedByStaffName = staffName;

    // Update inside booking tickets as well
    const booking = this.bookings.find(b => b.id === ticket.bookingId);
    if (booking) {
      const bTicket = booking.tickets.find(t => t.id === ticket.id);
      if (bTicket) {
        bTicket.status = 'used';
        bTicket.usedAt = scannedAt;
        bTicket.usedByStaffName = staffName;
      }
    }

    const logEntry: CheckInLogEntry = {
      id: 'log_' + Math.random().toString(36).substring(2, 9),
      ticketNumber: ticket.ticketNumber,
      bookingReference: ticket.bookingReference,
      eventTitle: ticket.eventTitle,
      attendeeName: ticket.attendeeName,
      tierName: ticket.tierName,
      scannedAt,
      status: 'admitted',
      staffName,
    };
    this.checkInLogs.unshift(logEntry);

    this.saveTickets();
    this.saveBookings();
    this.saveCheckInLogs();
    this.notify();

    return {
      status: 'valid',
      message: 'AUTHENTIC TICKET VERIFIED. Entry Granted.',
      ticket,
      event,
      scannedAt,
      staffName,
    };
  }

  // --- GETTERS ---
  public getBookings(): Booking[] {
    return [...this.bookings];
  }

  public getUserBookings(userId: string): Booking[] {
    return this.bookings.filter(b => b.userId === userId);
  }

  public getTickets(): Ticket[] {
    return [...this.tickets];
  }

  public getCheckInLogs(): CheckInLogEntry[] {
    return [...this.checkInLogs];
  }

  // --- STATS FOR ADMIN DASHBOARD ---
  public getAdminStats() {
    const totalBookings = this.bookings.length;
    const confirmedBookings = this.bookings.filter(b => b.bookingStatus === 'confirmed');
    const totalRevenue = confirmedBookings.reduce((acc, b) => acc + b.totalAmount, 0);
    const ticketsSold = confirmedBookings.reduce((acc, b) => acc + b.quantity, 0);
    const ticketsCheckedIn = this.tickets.filter(t => t.status === 'used').length;
    const checkInRate = ticketsSold > 0 ? Math.round((ticketsCheckedIn / ticketsSold) * 100) : 0;
    const totalEvents = this.events.length;

    // Category breakdown
    const categoryStats: Record<string, { count: number; revenue: number; tickets: number }> = {};
    confirmedBookings.forEach(b => {
      const event = this.events.find(e => e.id === b.eventId);
      const cat = event?.category || 'Other';
      if (!categoryStats[cat]) {
        categoryStats[cat] = { count: 0, revenue: 0, tickets: 0 };
      }
      categoryStats[cat].count += 1;
      categoryStats[cat].revenue += b.totalAmount;
      categoryStats[cat].tickets += b.quantity;
    });

    return {
      totalRevenue,
      ticketsSold,
      ticketsCheckedIn,
      checkInRate,
      totalEvents,
      totalBookings,
      confirmedBookingsCount: confirmedBookings.length,
      cancelledBookingsCount: this.bookings.filter(b => b.bookingStatus === 'cancelled').length,
      categoryStats,
    };
  }

  // --- CSV EXPORT GENERATOR ---
  public exportBookingsCSV(): string {
    const headers = [
      'Booking Reference',
      'Booking ID',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Event Title',
      'Event Date',
      'Tier Name',
      'Quantity',
      'Unit Price (₹)',
      'Subtotal (₹)',
      'Platform Fee (₹)',
      'Tax (₹)',
      'Total Amount (₹)',
      'Booking Status',
      'Payment Status',
      'Payment Method',
      'Payment Reference',
      'Created At',
    ];

    const rows = this.bookings.map(b => [
      `"${b.bookingReference}"`,
      `"${b.id}"`,
      `"${b.customerName.replace(/"/g, '""')}"`,
      `"${b.customerEmail}"`,
      `"${b.customerPhone}"`,
      `"${b.eventTitle.replace(/"/g, '""')}"`,
      `"${b.eventDate}"`,
      `"${b.tierName}"`,
      b.quantity,
      b.unitPrice.toFixed(2),
      b.subtotal.toFixed(2),
      b.platformFee.toFixed(2),
      b.taxAmount.toFixed(2),
      b.totalAmount.toFixed(2),
      `"${b.bookingStatus}"`,
      `"${b.paymentStatus}"`,
      `"${b.paymentMethod}"`,
      `"${b.paymentReference}"`,
      `"${b.createdAt}"`,
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  // Reset to initial demo state
  public resetToFactoryDemo() {
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.TICKETS);
    localStorage.removeItem(STORAGE_KEYS.CHECKIN_LOGS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    this.initializeFromStorage();
    this.notify();
  }
}

export const ticketService = new TicketService();

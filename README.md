# SMARTTICKET — Online Ticketing and Booking Management System
> **Problem Statement PS-07 Hackathon Implementation**  
> Unified Web (React + TypeScript) & Native Mobile (Flutter + Dart) Architecture backed by Cloud Firestore.

---

## 🎯 Executive Overview & PS-07 Requirements

SMARTTICKET is a full-stack, enterprise-grade ticketing and booking ecosystem designed to eliminate counterfeit tickets, prevent race-condition overbooking during peak demand, and streamline venue gate admission.

### System Pillars:
1. **Responsive Web Application**: Modern React 19 + TypeScript + Tailwind CSS with dark navy aesthetics, real-time search, capacity meters, multi-tier pricing, and administrative telemetry.
2. **Native Android Mobile App**: Flutter 3.x with Material 3 Dark theme, native camera QR scanning, digital ticket wallet, and real-time offline caching.
3. **Unified Firebase Backend**: Single shared Firestore database with atomic transaction handlers, Role-Based Access Control (RBAC), and security rules.
4. **Fraud Prevention & Security**: Unique cryptographic QR tokens (no customer PII exposed inside QR), single check-in guarantee (duplicate entry blocked), and safe inventory restoration upon cancellation.

---

## 👥 User Roles & Access Control

| Role | Permissions & Capabilities | Default Persona |
| :--- | :--- | :--- |
| **Customer** | Browse events, search & filter, multi-tier ticket selection, dynamic price breakdown, simulated payment workflow, instant QR pass generation, view booking history, self-service cancellation with automatic inventory return. | `alex.rivera@example.com` |
| **Event Staff / Ticket Checker** | Camera QR code scanning, sub-second backend verification against Firestore, audio-visual validation (Entry Granted vs. Duplicate Blocked vs. Cancelled vs. Invalid), real-time gate scan audit stream. | `staff.marcus@smartticket.io` |
| **Event Admin** | Executive sales telemetry (gross revenue, tickets sold, attendance rate), create/edit/delete events, live capacity monitor, booking search, and one-click CSV report export. | `admin@smartticket.io` |

---

## 🛡️ Anti-Overbooking & Atomic Concurrency Architecture

A critical vulnerability in traditional ticketing systems is **overbooking** when multiple users attempt to reserve the final remaining tickets simultaneously. SMARTTICKET addresses this through **Firestore Transactions**:

```
[Customer Checkout Request]
           │
           ▼
┌──────────────────────────────────────────────┐
│        FIRESTORE ATOMIC TRANSACTION          │
│                                              │
│ 1. Read event remainingCapacity & tier stock │
│ 2. IF (availableCapacity < requestedQty)      │
│      -> ABORT & ROLLBACK (User notified)     │
│ 3. Decrement availableCapacity atomically    │
│ 4. Decrement event remainingCapacity         │
│ 5. Generate secure booking reference ID      │
│ 6. Commit booking document and QR passes     │
└──────────────────────────────────────────────┘
           │
           ▼
[Booking Confirmed & QR Passes Issued]
```

### Tamper-Proof QR Format
To protect attendee privacy, QR codes do not embed raw credit cards or sensitive PII. Instead, they contain signed tokens:
```
STK:v1:{ticketId}:{eventId}:{cryptographicSignature}
```
When scanned at turnstiles, the staff application queries the backend, marks the pass as `used`, records the timestamp and staff ID, and blocks any subsequent attempts.

---

## 🗄️ Database Schema (`firebase-blueprint.json`)

- **`users`**: `{ id, name, email, role, phone, createdAt }`
- **`events`**: `{ id, title, subtitle, category, venue, city, date, time, bannerUrl, totalCapacity, remainingCapacity, tiers, status, tags }`
- **`bookings`**: `{ id, bookingReference, userId, customerName, customerEmail, eventId, tierName, quantity, subtotal, platformFee, taxAmount, totalAmount, paymentStatus, bookingStatus, tickets, createdAt }`
- **`tickets`**: `{ id, ticketNumber, bookingId, bookingReference, eventId, attendeeName, price, qrToken, status: 'valid' | 'used' | 'cancelled', usedAt, usedByStaffName }`
- **`staff_logs`**: `{ id, ticketNumber, bookingReference, scannedAt, status: 'admitted' | 'duplicate_blocked' | 'cancelled_blocked' | 'invalid_token', staffName }`

---

## 🚀 Running the Project

### 1. Web Application (React + Vite)
```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev
# App runs on http://localhost:3000
```

### 2. Flutter Android Application
```bash
cd flutter_app

# Fetch Flutter dependencies
flutter pub get

# Run on connected Android emulator or device
flutter run
```

---

## 📱 Built-In Android Mobile Simulator
Judges and reviewers can experience the full Flutter Android application flow directly inside the web browser! Simply toggle the **"Android Flutter App"** button in the top navigation bar to interact with the simulated Google Pixel client.

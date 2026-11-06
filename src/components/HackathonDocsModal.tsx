import React from 'react';
import { 
  X, 
  FileText, 
  ShieldCheck, 
  Layers, 
  Database, 
  Smartphone, 
  Globe, 
  Lock, 
  Terminal, 
  CheckCircle2, 
  QrCode 
} from 'lucide-react';

interface HackathonDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HackathonDocsModal: React.FC<HackathonDocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">
              SMARTTICKET — Problem Statement PS-07 Architecture & Implementation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8 overflow-y-auto max-h-[80vh] text-slate-300 text-xs leading-relaxed">
          
          {/* Executive Summary */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>1. Problem Statement Mapping (PS-07)</span>
            </h4>
            <p className="mb-3 text-slate-300 text-xs">
              <strong>PS-07: Online Ticketing and Booking Management System</strong> mandates a high-reliability, 
              scalable platform enabling seamless ticket reservations, fraud-proof digital admission, and comprehensive administrative oversight across both web and native mobile environments.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                <span className="font-bold text-white block mb-1">Customer Journey</span>
                Browse, search, real-time seat lock, simulated payment gateway, instant digital QR pass generation, self-service cancellation with inventory return.
              </div>
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                <span className="font-bold text-white block mb-1">Admin Operations</span>
                Event lifecycle management, multi-tier pricing, live capacity tracking, transactional booking logs, and CSV report export.
              </div>
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                <span className="font-bold text-white block mb-1">Ticket Checker / Gate</span>
                Sub-second camera scanning, tamper-proof signature verification, single check-in guarantee, and duplicate entry blocking.
              </div>
            </div>
          </div>

          {/* Architecture Diagram */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>2. Unified Dual-Client Architecture</span>
            </h4>
            <p className="mb-3 text-slate-300 text-xs">
              Both the React Web SPA and native Android Flutter application interact with a single, synchronized Cloud Firestore database layer.
            </p>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
{`+-------------------------------------------------------------+
|                     SMARTTICKET CLIENTS                     |
|                                                             |
|   +--------------------------+  +-------------------------+ |
|   |  Web Client (React/TS)   |  | Android Client (Flutter)| |
|   |  - Responsive Desktop/UI |  | - Native Material 3 UI  | |
|   |  - Camera QR Scanner     |  | - Mobile Ticket Wallet  | |
|   |  - Admin Dashboard & CSV |  | - Offline Pass Caching  | |
|   +------------+-------------+  +------------+------------+ |
+----------------|-----------------------------|--------------+
                 |                             |
                 +--------------+--------------+
                                |
             +------------------v-------------------+
             |       UNIFIED FIREBASE BACKEND       |
             |                                      |
             |  [Firebase Authentication]           |
             |  - Role-based tokens (Cust/Admin/Stf)|
             |                                      |
             |  [Cloud Firestore with Transactions] |
             |  - Atomic capacity decrements        |
             |  - collections: users, events,       |
             |    bookings, tickets, staff_logs     |
             |                                      |
             |  [Security Rules (firestore.rules)]  |
             |  - RBAC enforcement                  |
             |  - Single-use check-in guarantee     |
             +--------------------------------------+`}
            </div>
          </div>

          {/* Anti-Overbooking Mechanism */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-400" />
              <span>3. Anti-Overbooking & Atomic Concurrency</span>
            </h4>
            <p className="text-slate-300 text-xs mb-2">
              To prevent race conditions during peak flash sales, SMARTTICKET uses <strong>Firestore Transactions</strong> (or transactional state locks) to enforce atomic read-and-decrement:
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-slate-300">
              <li><strong>Read Capacity:</strong> In a transaction, read the event tier's <code>availableCapacity</code> and the event's <code>remainingCapacity</code>.</li>
              <li><strong>Validate Threshold:</strong> If <code>availableCapacity &lt; quantity</code>, abort immediately and rollback with user error.</li>
              <li><strong>Atomic Decrement:</strong> Decrement both capacities in the same transaction before committing the booking and tickets.</li>
              <li><strong>Safe Cancellation:</strong> If an eligible booking is cancelled, increment both capacities back to the pool in a matching atomic transaction.</li>
            </ol>
          </div>

          {/* QR Code Security Specification */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>4. Tamper-Proof QR Pass Format & Privacy</span>
            </h4>
            <p className="text-slate-300 text-xs mb-2">
              In accordance with security requirements, <strong>no plain customer PII (credit cards, passwords, phone numbers) is stored inside the QR code</strong>. Instead, each pass contains a cryptographic token:
            </p>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-amber-300 mb-2">
              STK:v1:tk_98a72b1:evt-neon-horizon:8f9a2b5e7d1c
            </div>
            <p className="text-slate-400 text-[11px]">
              Gate scanners verify this token against the backend database in real time. Upon first admission, the ticket status transitions from <code>valid</code> to <code>used</code>. Any subsequent presentation of the exact same code alerts the gatekeeper with a red "DUPLICATE BLOCKED" alarm and logs the violation.
            </p>
          </div>

          {/* Flutter Android Instructions */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-purple-400" />
              <span>5. Flutter Android Project Structure</span>
            </h4>
            <p className="text-slate-300 text-xs mb-2">
              The complete Flutter codebase is located in <code>/flutter_app</code>:
            </p>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-300 space-y-0.5">
              <div>flutter_app/</div>
              <div>├── pubspec.yaml (Dependencies: cloud_firestore, firebase_auth, qr_flutter, mobile_scanner)</div>
              <div>├── lib/</div>
              <div>│   ├── main.dart (App entry point with Material 3 Dark theme)</div>
              <div>│   ├── models/ (event.dart, booking.dart, ticket.dart, user.dart)</div>
              <div>│   ├── services/ (firebase_service.dart, auth_service.dart)</div>
              <div>│   └── screens/ (splash, home, event_details, checkout, ticket_wallet, staff_scanner, admin)</div>
              <div>└── android/app/src/main/AndroidManifest.xml (Camera permissions for QR scanning)</div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/80">
          <div className="text-[11px] text-slate-400">
            SMARTTICKET · Built for PS-07 Hackathon Evaluation
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
          >
            Close Documentation
          </button>
        </div>

      </div>
    </div>
  );
};

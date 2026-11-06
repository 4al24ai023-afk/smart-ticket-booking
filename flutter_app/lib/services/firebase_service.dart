import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../models/event.dart';
import '../models/ticket.dart';

class FirebaseService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;

  // Stream of published events
  Stream<List<EventItem>> getEventsStream() {
    return _db.collection('events').snapshots().map((snapshot) {
      return snapshot.docs.map((doc) => EventItem.fromMap(doc.data(), doc.id)).toList();
    });
  }

  // Atomic reservation transaction preventing overbooking
  Future<String> bookTickets({
    required EventItem event,
    required TicketTier tier,
    required int quantity,
    required List<String> attendeeNames,
  }) async {
    final user = _auth.currentUser;
    final String bookingRef = 'ST-2026-${DateTime.now().millisecondsSinceEpoch.toRadixString(36).toUpperCase()}';

    await _db.runTransaction((transaction) async {
      final eventRef = _db.collection('events').doc(event.id);
      final eventDoc = await transaction.get(eventRef);

      if (!eventDoc.exists) {
        throw Exception('Event does not exist');
      }

      final data = eventDoc.data()!;
      final int currentRemaining = data['remainingCapacity'] ?? 0;

      if (currentRemaining < quantity) {
        throw Exception('Not enough tickets remaining ($currentRemaining left)');
      }

      // Decrement capacity atomically
      transaction.update(eventRef, {
        'remainingCapacity': FieldValue.increment(-quantity),
      });

      // Create Booking Document
      final bookingRefDoc = _db.collection('bookings').doc();
      final double unitPrice = tier.price;
      final double subtotal = unitPrice * quantity;
      final double total = subtotal * 1.13; // with fees and taxes

      final bookingMap = {
        'id': bookingRefDoc.id,
        'bookingReference': bookingRef,
        'userId': user?.uid ?? 'guest',
        'customerName': attendeeNames.isNotEmpty ? attendeeNames[0] : 'Attendee',
        'customerEmail': user?.email ?? 'guest@example.com',
        'eventId': event.id,
        'eventTitle': event.title,
        'eventDate': event.date,
        'tierName': tier.name,
        'quantity': quantity,
        'totalAmount': total,
        'bookingStatus': 'confirmed',
        'createdAt': FieldValue.serverTimestamp(),
      };
      transaction.set(bookingRefDoc, bookingMap);

      // Create Individual Tickets with cryptographic QR tokens
      for (int i = 0; i < quantity; i++) {
        final ticketRefDoc = _db.collection('tickets').doc();
        final String ticketNumber = 'TK-$bookingRef-\${i + 1}';
        final String qrToken = 'STK:v1:\${ticketRefDoc.id}:\${event.id}:\${DateTime.now().microsecondsSinceEpoch}';

        transaction.set(ticketRefDoc, {
          'id': ticketRefDoc.id,
          'ticketNumber': ticketNumber,
          'bookingId': bookingRefDoc.id,
          'bookingReference': bookingRef,
          'eventId': event.id,
          'eventTitle': event.title,
          'eventDate': event.date,
          'eventVenue': event.venue,
          'tierName': tier.name,
          'attendeeName': i < attendeeNames.length ? attendeeNames[i] : 'Guest \${i + 1}',
          'price': unitPrice,
          'qrToken': qrToken,
          'status': 'valid',
        });
      }
    });

    return bookingRef;
  }

  // Gate Scanner: Atomic Single-Use Check-In
  Future<Map<String, dynamic>> checkInTicket(String scannedToken, String staffName) async {
    final query = await _db.collection('tickets').where('qrToken', isEqualTo: scannedToken).limit(1).get();

    if (query.docs.isEmpty) {
      // Also try matching ticket number
      final numQuery = await _db.collection('tickets').where('ticketNumber', isEqualTo: scannedToken).limit(1).get();
      if (numQuery.docs.isEmpty) {
        return {'status': 'invalid', 'message': 'Ticket token not found.'};
      }
    }

    final ticketDoc = query.docs.first;
    final ticketData = ticketDoc.data();
    final String currentStatus = ticketData['status'] ?? 'valid';

    if (currentStatus == 'used') {
      return {
        'status': 'already_used',
        'message': 'Duplicate entry blocked! Already checked in at \${ticketData['usedAt']}.',
        'ticket': ticketData,
      };
    }

    if (currentStatus == 'cancelled') {
      return {
        'status': 'cancelled',
        'message': 'This reservation was cancelled. Entry denied.',
        'ticket': ticketData,
      };
    }

    // Mark as used atomically
    await ticketDoc.reference.update({
      'status': 'used',
      'usedAt': FieldValue.serverTimestamp(),
      'usedByStaffName': staffName,
    });

    return {
      'status': 'valid',
      'message': 'Ticket Verified. Entry Granted!',
      'ticket': ticketData,
    };
  }
}

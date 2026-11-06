class Ticket {
  final String id;
  final String ticketNumber;
  final String bookingId;
  final String bookingReference;
  final String eventId;
  final String eventTitle;
  final String eventDate;
  final String eventVenue;
  final String tierName;
  final String attendeeName;
  final double price;
  final String qrToken;
  final String status; // 'valid' | 'used' | 'cancelled'
  final String? usedAt;
  final String? usedByStaffName;

  Ticket({
    required this.id,
    required this.ticketNumber,
    required this.bookingId,
    required this.bookingReference,
    required this.eventId,
    required this.eventTitle,
    required this.eventDate,
    required this.eventVenue,
    required this.tierName,
    required this.attendeeName,
    required this.price,
    required this.qrToken,
    required this.status,
    this.usedAt,
    this.usedByStaffName,
  });

  factory Ticket.fromMap(Map<String, dynamic> map, String docId) {
    return Ticket(
      id: docId,
      ticketNumber: map['ticketNumber'] ?? '',
      bookingId: map['bookingId'] ?? '',
      bookingReference: map['bookingReference'] ?? '',
      eventId: map['eventId'] ?? '',
      eventTitle: map['eventTitle'] ?? '',
      eventDate: map['eventDate'] ?? '',
      eventVenue: map['eventVenue'] ?? '',
      tierName: map['tierName'] ?? '',
      attendeeName: map['attendeeName'] ?? '',
      price: (map['price'] as num?)?.toDouble() ?? 0.0,
      qrToken: map['qrToken'] ?? '',
      status: map['status'] ?? 'valid',
      usedAt: map['usedAt'],
      usedByStaffName: map['usedByStaffName'],
    );
  }
}

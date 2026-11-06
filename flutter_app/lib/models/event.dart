class TicketTier {
  final String id;
  final String name;
  final double price;
  final String description;
  final int totalCapacity;
  final int availableCapacity;

  TicketTier({
    required this.id,
    required this.name,
    required this.price,
    required this.description,
    required this.totalCapacity,
    required this.availableCapacity,
  });

  factory TicketTier.fromMap(Map<String, dynamic> map) {
    return TicketTier(
      id: map['id'] ?? '',
      name: map['name'] ?? '',
      price: (map['price'] as num?)?.toDouble() ?? 0.0,
      description: map['description'] ?? '',
      totalCapacity: map['totalCapacity'] ?? 0,
      availableCapacity: map['availableCapacity'] ?? 0,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'price': price,
      'description': description,
      'totalCapacity': totalCapacity,
      'availableCapacity': availableCapacity,
    };
  }
}

class EventItem {
  final String id;
  final String title;
  final String subtitle;
  final String category;
  final String description;
  final String venue;
  final String city;
  final String date;
  final String time;
  final String bannerUrl;
  final String organizer;
  final int totalCapacity;
  final int remainingCapacity;
  final List<TicketTier> tiers;
  final String status;

  EventItem({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.category,
    required this.description,
    required this.venue,
    required this.city,
    required this.date,
    required this.time,
    required this.bannerUrl,
    required this.organizer,
    required this.totalCapacity,
    required this.remainingCapacity,
    required this.tiers,
    required this.status,
  });

  factory EventItem.fromMap(Map<String, dynamic> map, String docId) {
    return EventItem(
      id: docId,
      title: map['title'] ?? '',
      subtitle: map['subtitle'] ?? '',
      category: map['category'] ?? '',
      description: map['description'] ?? '',
      venue: map['venue'] ?? '',
      city: map['city'] ?? '',
      date: map['date'] ?? '',
      time: map['time'] ?? '',
      bannerUrl: map['bannerUrl'] ?? '',
      organizer: map['organizer'] ?? '',
      totalCapacity: map['totalCapacity'] ?? 0,
      remainingCapacity: map['remainingCapacity'] ?? 0,
      tiers: (map['tiers'] as List<dynamic>?)
              ?.map((t) => TicketTier.fromMap(t as Map<String, dynamic>))
              .toList() ??
          [],
      status: map['status'] ?? 'published',
    );
  }
}

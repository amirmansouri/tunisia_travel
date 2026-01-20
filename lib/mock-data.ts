import { Program, Reservation } from '@/types/database';

export const mockPrograms: Program[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    title: 'Sahara Desert Adventure: Douz – Tozeur – Tataouine',
    description: `Embark on an unforgettable 5-day journey through the mystical Sahara Desert of Tunisia. This adventure begins in Douz, the "Gateway to the Sahara," where you'll experience authentic Bedouin culture and ride camels across golden dunes at sunset.

Travel to Tozeur, a stunning oasis city famous for its unique brick architecture and lush palm groves containing over 400,000 date palms. Explore the ancient medina, visit the Dar Cheraït Museum, and take a 4x4 excursion to the mountain oases of Chebika, Tamerza, and Mides – locations featured in Star Wars films.

Continue to Tataouine, where you'll discover the remarkable Berber granaries (ksour) carved into hillsides. Visit the famous Ksar Ouled Soltane, Ksar Hadada (another Star Wars filming location), and experience the unique troglodyte dwellings of Matmata.

Includes: 4x4 desert excursions, camel trekking, traditional Bedouin camp stay with dinner under the stars, all accommodations, breakfast daily, experienced English-speaking guide, and all transportation.`,
    price: 1850,
    start_date: '2025-03-15',
    end_date: '2025-03-19',
    location: 'Douz, Tozeur, Tataouine',
    images: [
      'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1200',
      'https://images.unsplash.com/photo-1547234935-80c7145ec969?w=1200',
      'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=1200',
      'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=1200',
      'https://images.unsplash.com/photo-1528263072946-d97ebc0b4780?w=1200',
    ],
    published: true,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    title: 'Sidi Bou Said & Carthage Day Trip',
    description: `Discover two of Tunisia's most iconic destinations in this enriching full-day excursion from Tunis. Begin your morning at the legendary ruins of Carthage, once the powerful rival of Rome and home to the legendary Queen Dido.

Explore the UNESCO World Heritage archaeological site including the Antonine Baths – among the largest Roman bath complexes ever built – the Punic ports, the Tophet sanctuary, and the ancient Byrsa Hill with its panoramic views over the Gulf of Tunis. Visit the Carthage Museum housing exceptional Punic and Roman artifacts.

After lunch at a seaside restaurant, continue to the enchanting village of Sidi Bou Said, perched on a cliff overlooking the Mediterranean. Wander through cobblestone streets lined with white-washed buildings adorned with iconic blue doors and windows.

Includes: Hotel pickup and drop-off in Tunis, licensed guide, entrance fees to all sites, traditional Tunisian lunch, and bottled water.`,
    price: 320,
    start_date: '2025-02-20',
    end_date: '2025-02-20',
    location: 'Carthage, Sidi Bou Said',
    images: [
      'https://images.unsplash.com/photo-1568454537842-d933259bb258?w=1200',
      'https://images.unsplash.com/photo-1590502593747-42a996133562?w=1200',
      'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1200',
      'https://images.unsplash.com/photo-1553899017-a397a55a79f6?w=1200',
    ],
    published: true,
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    title: 'Kairouan & El Djem Cultural Heritage Tour',
    description: `Immerse yourself in Tunisia's magnificent Islamic and Roman heritage with this 2-day cultural expedition to two of the country's most important historical sites.

Day 1: Journey to Kairouan, the fourth holiest city in Islam and a UNESCO World Heritage Site. Visit the Great Mosque of Kairouan (Mosque of Uqba), founded in 670 AD and one of the oldest mosques in the world. Explore the Mosque of the Three Doors, the Aghlabid Basins, and the medina with its traditional carpet workshops.

Day 2: Travel to El Djem to witness the awe-inspiring Roman amphitheater, the third-largest in the world and better preserved than Rome's Colosseum. This magnificent 3rd-century structure could seat 35,000 spectators.

Includes: 4-star hotel accommodation in Kairouan, all breakfasts, entrance to all monuments, professional guide specializing in Islamic and Roman history, comfortable air-conditioned transport.`,
    price: 580,
    start_date: '2025-04-05',
    end_date: '2025-04-06',
    location: 'Kairouan, El Djem',
    images: [
      'https://images.unsplash.com/photo-1562679299-266e53aca53d?w=1200',
      'https://images.unsplash.com/photo-1583430999185-a65325da6348?w=1200',
      'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200',
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200',
    ],
    published: true,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'd4e5f6a7-b8c9-0123-defa-234567890123',
    title: 'Hammamet Beach Holiday & Spa Retreat',
    description: `Escape to the stunning beaches of Hammamet, Tunisia's premier seaside resort destination, for a 7-day holiday combining relaxation, culture, and Mediterranean charm.

Stay at a luxury beachfront resort with direct access to pristine golden sands and crystal-clear waters. Enjoy daily breakfast and dinner featuring fresh seafood and traditional Tunisian cuisine. Indulge in the included spa package: traditional hammam experience, argan oil massage, and thalassotherapy session.

Explore the historic Hammamet Medina, a beautifully preserved old town with whitewashed walls, vibrant souks, and the 15th-century Kasbah offering stunning sea views.

Includes: 7 nights at 5-star beachfront resort, daily breakfast and dinner, spa package (hammam + 2 treatments), airport transfers, guided medina tour, and beach equipment.`,
    price: 2450,
    start_date: '2025-05-01',
    end_date: '2025-05-07',
    location: 'Hammamet',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200',
    ],
    published: true,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'e5f6a7b8-c9d0-1234-efab-345678901234',
    title: 'Sousse & Monastir: Coastal Heritage Discovery',
    description: `Experience the rich history and Mediterranean beauty of Tunisia's central coast with this 3-day exploration of Sousse and Monastir, two jewels of the Sahel region.

Day 1: Arrive in Sousse, known as the "Pearl of the Sahel." Explore the UNESCO-listed medina, one of the best-preserved Arab old towns in the Mediterranean. Visit the Ribat fortress (8th century), the Great Mosque, and the fascinating catacombs.

Day 2: Journey to Monastir, birthplace of Tunisia's first president. Visit the impressive Ribat of Monastir, featured in numerous films including Monty Python's Life of Brian.

Day 3: Morning at leisure. Visit the Sousse Archaeological Museum housing the finest collection of Roman mosaics in Tunisia.

Includes: 2 nights in 4-star hotel with sea views, daily breakfast, all entrance fees, licensed English-speaking guide, and private air-conditioned transport.`,
    price: 720,
    start_date: '2025-03-28',
    end_date: '2025-03-30',
    location: 'Sousse, Monastir',
    images: [
      'https://images.unsplash.com/photo-1568454537842-d933259bb258?w=1200',
      'https://images.unsplash.com/photo-1523978591478-c753949ff840?w=1200',
      'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=1200',
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200',
    ],
    published: true,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'f6a7b8c9-d0e1-2345-fabc-456789012345',
    title: 'Tunis Medina & Bardo Museum Cultural Immersion',
    description: `Delve deep into Tunisia's capital with this comprehensive 2-day cultural experience exploring the heart of Tunis and its world-famous treasures.

Day 1: Begin at the extraordinary Bardo Museum, housed in a former beylical palace and containing the world's largest collection of Roman mosaics. Marvel at masterpieces from Carthage, El Djem, and other archaeological sites.

Day 2: Immerse yourself in the UNESCO-listed Medina of Tunis, founded in the 7th century. Navigate the labyrinthine souks with a local guide. Enjoy a traditional lunch in a restored medina palace.

Includes: 1 night in boutique riad in the medina, all breakfasts, traditional palace lunch, museum entrance fees, expert local guide for both days.`,
    price: 450,
    start_date: '2025-02-15',
    end_date: '2025-02-16',
    location: 'Tunis',
    images: [
      'https://images.unsplash.com/photo-1553899017-a397a55a79f6?w=1200',
      'https://images.unsplash.com/photo-1568454537842-d933259bb258?w=1200',
      'https://images.unsplash.com/photo-1564659907532-6b5f98c8e70f?w=1200',
      'https://images.unsplash.com/photo-1583430999185-a65325da6348?w=1200',
    ],
    published: true,
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockReservations: Reservation[] = [
  {
    id: '1',
    program_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    full_name: 'Ahmed Ben Salem',
    phone: '+216 98 123 456',
    email: 'ahmed.bensalem@email.com',
    message: 'We are a group of 4 friends interested in this desert tour. Can you arrange a private guide?',
    status: 'pending',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    program_id: 'd4e5f6a7-b8c9-0123-defa-234567890123',
    full_name: 'Marie Dupont',
    phone: '+33 6 12 34 56 78',
    email: 'marie.dupont@email.fr',
    message: 'Booking for 2 adults. Very excited about the beach holiday!',
    status: 'confirmed',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    program_id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    full_name: 'John Smith',
    phone: '+44 7700 900123',
    email: 'john.smith@email.co.uk',
    message: 'Looking forward to visiting Carthage!',
    status: 'completed',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function getMockPrograms(): Program[] {
  return mockPrograms;
}

export function getMockProgramById(id: string): Program | undefined {
  return mockPrograms.find((p) => p.id === id);
}

export function getMockReservations() {
  return mockReservations.map((r) => ({
    ...r,
    program: mockPrograms.find((p) => p.id === r.program_id),
  }));
}

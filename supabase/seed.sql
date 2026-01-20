-- =====================================================
-- TUNISIA TRAVEL - SEED DATA
-- =====================================================
-- Run this after schema.sql to populate with sample data
-- =====================================================

-- Clear existing data (optional - comment out in production)
-- TRUNCATE programs CASCADE;
-- TRUNCATE reservations CASCADE;

-- =====================================================
-- INSERT TRAVEL PROGRAMS
-- =====================================================

INSERT INTO programs (id, title, description, price, start_date, end_date, location, images, published, created_at)
VALUES
-- Program 1: Sahara Desert Tour
(
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Sahara Desert Adventure: Douz – Tozeur – Tataouine',
    E'Embark on an unforgettable 5-day journey through the mystical Sahara Desert of Tunisia. This adventure begins in Douz, the "Gateway to the Sahara," where you''ll experience authentic Bedouin culture and ride camels across golden dunes at sunset.\n\nTravel to Tozeur, a stunning oasis city famous for its unique brick architecture and lush palm groves containing over 400,000 date palms. Explore the ancient medina, visit the Dar Cheraït Museum, and take a 4x4 excursion to the mountain oases of Chebika, Tamerza, and Mides – locations featured in Star Wars films.\n\nContinue to Tataouine, where you''ll discover the remarkable Berber granaries (ksour) carved into hillsides. Visit the famous Ksar Ouled Soltane, Ksar Hadada (another Star Wars filming location), and experience the unique troglodyte dwellings of Matmata.\n\nIncludes: 4x4 desert excursions, camel trekking, traditional Bedouin camp stay with dinner under the stars, all accommodations, breakfast daily, experienced English-speaking guide, and all transportation.',
    1850.00,
    '2025-03-15',
    '2025-03-19',
    'Douz, Tozeur, Tataouine',
    ARRAY[
        'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1200',
        'https://images.unsplash.com/photo-1547234935-80c7145ec969?w=1200',
        'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=1200',
        'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=1200',
        'https://images.unsplash.com/photo-1528263072946-d97ebc0b4780?w=1200'
    ],
    true,
    NOW() - INTERVAL '10 days'
),

-- Program 2: Sidi Bou Said & Carthage
(
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    'Sidi Bou Said & Carthage Day Trip',
    E'Discover two of Tunisia''s most iconic destinations in this enriching full-day excursion from Tunis. Begin your morning at the legendary ruins of Carthage, once the powerful rival of Rome and home to the legendary Queen Dido.\n\nExplore the UNESCO World Heritage archaeological site including the Antonine Baths – among the largest Roman bath complexes ever built – the Punic ports, the Tophet sanctuary, and the ancient Byrsa Hill with its panoramic views over the Gulf of Tunis. Visit the Carthage Museum housing exceptional Punic and Roman artifacts.\n\nAfter lunch at a seaside restaurant, continue to the enchanting village of Sidi Bou Said, perched on a cliff overlooking the Mediterranean. Wander through cobblestone streets lined with white-washed buildings adorned with iconic blue doors and windows. Visit the Dar El-Annabi museum, enjoy traditional mint tea with pine nuts at Café des Délices, and browse artisan shops for local crafts.\n\nIncludes: Hotel pickup and drop-off in Tunis, licensed guide, entrance fees to all sites, traditional Tunisian lunch, and bottled water.',
    320.00,
    '2025-02-20',
    '2025-02-20',
    'Carthage, Sidi Bou Said',
    ARRAY[
        'https://images.unsplash.com/photo-1568454537842-d933259bb258?w=1200',
        'https://images.unsplash.com/photo-1590502593747-42a996133562?w=1200',
        'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1200',
        'https://images.unsplash.com/photo-1553899017-a397a55a79f6?w=1200'
    ],
    true,
    NOW() - INTERVAL '8 days'
),

-- Program 3: Kairouan & El Djem Cultural Tour
(
    'c3d4e5f6-a7b8-9012-cdef-123456789012',
    'Kairouan & El Djem Cultural Heritage Tour',
    E'Immerse yourself in Tunisia''s magnificent Islamic and Roman heritage with this 2-day cultural expedition to two of the country''s most important historical sites.\n\nDay 1: Journey to Kairouan, the fourth holiest city in Islam and a UNESCO World Heritage Site. Visit the Great Mosque of Kairouan (Mosque of Uqba), founded in 670 AD and one of the oldest mosques in the world. Explore the Mosque of the Three Doors, the Aghlabid Basins, and the medina with its traditional carpet workshops. Learn about Kairouan''s famous makroud pastries and sample local specialties.\n\nDay 2: Travel to El Djem to witness the awe-inspiring Roman amphitheater, the third-largest in the world and better preserved than Rome''s Colosseum. This magnificent 3rd-century structure could seat 35,000 spectators. Explore the underground chambers where gladiators and wild animals awaited their fate. Visit the El Djem Archaeological Museum featuring exceptional Roman mosaics.\n\nIncludes: 4-star hotel accommodation in Kairouan, all breakfasts, entrance to all monuments, professional guide specializing in Islamic and Roman history, comfortable air-conditioned transport.',
    580.00,
    '2025-04-05',
    '2025-04-06',
    'Kairouan, El Djem',
    ARRAY[
        'https://images.unsplash.com/photo-1562679299-266e53aca53d?w=1200',
        'https://images.unsplash.com/photo-1583430999185-a65325da6348?w=1200',
        'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200',
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200'
    ],
    true,
    NOW() - INTERVAL '5 days'
),

-- Program 4: Hammamet Beach Holiday
(
    'd4e5f6a7-b8c9-0123-defa-234567890123',
    'Hammamet Beach Holiday & Spa Retreat',
    E'Escape to the stunning beaches of Hammamet, Tunisia''s premier seaside resort destination, for a 7-day holiday combining relaxation, culture, and Mediterranean charm.\n\nStay at a luxury beachfront resort with direct access to pristine golden sands and crystal-clear waters. Enjoy daily breakfast and dinner featuring fresh seafood and traditional Tunisian cuisine. Indulge in the included spa package: traditional hammam experience, argan oil massage, and thalassotherapy session.\n\nExplore the historic Hammamet Medina, a beautifully preserved old town with whitewashed walls, vibrant souks, and the 15th-century Kasbah offering stunning sea views. Visit the romantic Dar Sebastian villa and its famous international cultural center.\n\nOptional activities available: water sports, golf at nearby championship courses, excursions to Nabeul pottery workshops, and visits to local vineyards.\n\nIncludes: 7 nights at 5-star beachfront resort, daily breakfast and dinner, spa package (hammam + 2 treatments), airport transfers, guided medina tour, and beach equipment.',
    2450.00,
    '2025-05-01',
    '2025-05-07',
    'Hammamet',
    ARRAY[
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
        'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200',
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200'
    ],
    true,
    NOW() - INTERVAL '3 days'
),

-- Program 5: Sousse & Monastir History Tour
(
    'e5f6a7b8-c9d0-1234-efab-345678901234',
    'Sousse & Monastir: Coastal Heritage Discovery',
    E'Experience the rich history and Mediterranean beauty of Tunisia''s central coast with this 3-day exploration of Sousse and Monastir, two jewels of the Sahel region.\n\nDay 1: Arrive in Sousse, known as the "Pearl of the Sahel." Explore the UNESCO-listed medina, one of the best-preserved Arab old towns in the Mediterranean. Visit the Ribat fortress (8th century), the Great Mosque, and the fascinating catacombs containing 15,000 early Christian tombs. Stroll along the vibrant Port El Kantaoui marina.\n\nDay 2: Journey to Monastir, birthplace of Tunisia''s first president, Habib Bourguiba. Visit the impressive Ribat of Monastir, featured in numerous films including Monty Python''s Life of Brian. Tour the Bourguiba Mausoleum and mosque, explore the medina, and relax at the beautiful beaches.\n\nDay 3: Morning at leisure to enjoy the beach or optional activities. Visit the Sousse Archaeological Museum housing the finest collection of Roman mosaics in Tunisia. Afternoon departure.\n\nIncludes: 2 nights in 4-star hotel with sea views, daily breakfast, all entrance fees, licensed English-speaking guide, and private air-conditioned transport.',
    720.00,
    '2025-03-28',
    '2025-03-30',
    'Sousse, Monastir',
    ARRAY[
        'https://images.unsplash.com/photo-1568454537842-d933259bb258?w=1200',
        'https://images.unsplash.com/photo-1523978591478-c753949ff840?w=1200',
        'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=1200',
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200'
    ],
    true,
    NOW() - INTERVAL '7 days'
),

-- Program 6: Tunis Medina & Bardo Museum
(
    'f6a7b8c9-d0e1-2345-fabc-456789012345',
    'Tunis Medina & Bardo Museum Cultural Immersion',
    E'Delve deep into Tunisia''s capital with this comprehensive 2-day cultural experience exploring the heart of Tunis and its world-famous treasures.\n\nDay 1: Begin at the extraordinary Bardo Museum, housed in a former beylical palace and containing the world''s largest collection of Roman mosaics. Marvel at masterpieces from Carthage, El Djem, and other archaeological sites. Continue to the modern city center, stroll down Avenue Habib Bourguiba (Tunisia''s "Champs-Élysées"), and visit the Art Deco Théâtre Municipal.\n\nDay 2: Immerse yourself in the UNESCO-listed Medina of Tunis, founded in the 7th century. Navigate the labyrinthine souks with a local guide: the Souk el-Attarine (perfumes), Souk el-Berka (former slave market), and Souk des Chéchias (traditional felt hats). Visit the Zitouna Mosque, Dar Hussein palace, and Dar Ben Abdallah ethnographic museum. Enjoy a traditional lunch in a restored medina palace.\n\nIncludes: 1 night in boutique riad in the medina, all breakfasts, traditional palace lunch, museum entrance fees, expert local guide for both days, walking tour of key landmarks.',
    450.00,
    '2025-02-15',
    '2025-02-16',
    'Tunis',
    ARRAY[
        'https://images.unsplash.com/photo-1553899017-a397a55a79f6?w=1200',
        'https://images.unsplash.com/photo-1568454537842-d933259bb258?w=1200',
        'https://images.unsplash.com/photo-1564659907532-6b5f98c8e70f?w=1200',
        'https://images.unsplash.com/photo-1583430999185-a65325da6348?w=1200'
    ],
    true,
    NOW() - INTERVAL '12 days'
),

-- Program 7: Djerba Island Paradise (BONUS)
(
    'a7b8c9d0-e1f2-3456-abcd-567890123456',
    'Djerba Island: Mediterranean Paradise Escape',
    E'Discover the mythical island of Djerba, said to be the Land of the Lotus Eaters from Homer''s Odyssey. This 5-day getaway combines pristine beaches, ancient heritage, and unique island culture.\n\nExplore Houmt Souk, the island''s charming capital with its whitewashed fondouks (caravanserais) and bustling markets. Visit the El Ghriba Synagogue, one of the oldest in Africa and a pilgrimage site for Jews from around the world. Discover the unique architecture of the island''s mosques and the traditional crafts of Guellala pottery village.\n\nRelax on Djerba''s famous beaches with their soft white sand and turquoise waters. Take a boat trip to Flamingo Island to see pink flamingos in their natural habitat. Experience the island''s distinctive cuisine featuring fresh seafood and local olive oil.\n\nIncludes: 4 nights at beachfront resort, daily breakfast and dinner, island tour with licensed guide, boat excursion to Flamingo Island, pottery workshop, airport transfers.',
    1680.00,
    '2025-04-20',
    '2025-04-24',
    'Djerba Island',
    ARRAY[
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
        'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=1200',
        'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200',
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200'
    ],
    true,
    NOW() - INTERVAL '2 days'
),

-- Program 8: Tabarka & Ain Draham Mountain Escape (BONUS)
(
    'b8c9d0e1-f2a3-4567-bcde-678901234567',
    'Tabarka & Ain Draham: Mountains Meet Sea',
    E'Experience the lush, green side of Tunisia with this 4-day adventure to the northwestern highlands and coral coast – a region most visitors never see.\n\nDay 1-2: Base yourself in Tabarka, a picturesque fishing town known for its Genoese fort, cork oak forests, and exceptional coral diving. Explore the charming harbor, visit Les Aiguilles (the Needles) – dramatic rock formations jutting from the sea, and enjoy the town''s relaxed atmosphere. Optional scuba diving or snorkeling available.\n\nDay 3-4: Journey into the Kroumirie Mountains to Ain Draham, Tunisia''s "Little Switzerland." Surrounded by cork oak and pine forests, this mountain resort offers stunning scenery, wild boar hunting traditions, and a refreshing climate. Hike through the forests, visit Bulla Regia archaeological site with its unique underground Roman villas, and explore traditional mountain villages.\n\nIncludes: 2 nights in Tabarka seafront hotel, 1 night in Ain Draham mountain lodge, daily breakfast, Bulla Regia entrance and guide, forest hiking excursion, all transportation.',
    890.00,
    '2025-05-15',
    '2025-05-18',
    'Tabarka, Ain Draham',
    ARRAY[
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200',
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200'
    ],
    true,
    NOW() - INTERVAL '1 day'
);

-- =====================================================
-- INSERT SAMPLE RESERVATIONS
-- =====================================================

INSERT INTO reservations (program_id, full_name, phone, email, message, created_at)
VALUES
(
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Ahmed Ben Salem',
    '+216 98 123 456',
    'ahmed.bensalem@email.com',
    'We are a group of 4 friends interested in this desert tour. Can you arrange a private guide?',
    NOW() - INTERVAL '5 days'
),
(
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Marie Dupont',
    '+33 6 12 34 56 78',
    'marie.dupont@email.fr',
    'I will be traveling solo. Is there a single supplement fee? Very excited about the camel trek!',
    NOW() - INTERVAL '3 days'
),
(
    'd4e5f6a7-b8c9-0123-defa-234567890123',
    'John Smith',
    '+44 7700 900123',
    'john.smith@email.co.uk',
    'Booking for 2 adults and 2 children (ages 8 and 12). Do you offer family rates?',
    NOW() - INTERVAL '4 days'
),
(
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    'Fatma Trabelsi',
    '+216 55 987 654',
    'fatma.trabelsi@email.tn',
    'Local resident interested in the day trip. Looking forward to visiting Carthage!',
    NOW() - INTERVAL '2 days'
),
(
    'c3d4e5f6-a7b8-9012-cdef-123456789012',
    'Giuseppe Romano',
    '+39 333 456 7890',
    'giuseppe.romano@email.it',
    'History enthusiast here! Particularly interested in the Roman amphitheater at El Djem.',
    NOW() - INTERVAL '1 day'
),
(
    'e5f6a7b8-c9d0-1234-efab-345678901234',
    'Sarah Johnson',
    '+1 555 123 4567',
    'sarah.j@email.com',
    'Honeymoon trip! Any special arrangements possible?',
    NOW() - INTERVAL '6 hours'
);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check programs count
SELECT COUNT(*) as total_programs FROM programs;

-- Check published programs
SELECT COUNT(*) as published_programs FROM programs WHERE published = true;

-- Check reservations count
SELECT COUNT(*) as total_reservations FROM reservations;

-- Preview programs
SELECT id, title, price, location, published FROM programs ORDER BY created_at DESC;

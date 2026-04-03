import { City, Package, Testimonial, Enquiry } from "@/types";

// ── CITIES ─────────────────────────────────────────────────────────────────
export const cities: City[] = [
  {
    id: "c1",
    slug: "ziro",
    name: "Ziro",
    state: "Arunachal Pradesh",
    shortDescription: "A picturesque valley known for its pine-clad hills, rice fields, and the unique Apatani tribe culture.",
    longDescription: "Ziro Valley, nestled in the Lower Subansiri district of Arunachal Pradesh, is one of the oldest towns in the state and a UNESCO World Heritage tentative-list site. Surrounded by pine-covered mountains and flat-topped hills, the valley is famous for its breathtaking terraced paddy fields, the legendary Ziro Music Festival, and the fascinating Apatani tribal community known for their nose plugs and face tattoos. The valley's serene beauty, cool climate, and rich cultural heritage make it an unforgettable destination for those seeking authentic experiences.",
    heroImage: "https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=80",
    ],
    tags: ["Culture", "Nature", "Photography", "Music", "Tribe"],
    bestTimeToVisit: "March to October",
    permitRequired: true,
    featured: true,
    localTips: ["Carry warm clothes as nights are cold even in summer", "Respect tribal customs and ask before photographing villagers", "Book accommodation in advance during September Ziro Music Festival"],
    touristSites: [
      { id: "ts1", cityId: "c1", name: "Apatani Village – Hong", image: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800&auto=format&fit=crop&q=80", description: "Walk through the traditional Apatani bamboo houses and interact with the warm community.", category: "Culture", timings: "Sunrise to Sunset", idealDuration: "2-3 hours", distanceFromStart: "3 km", entryFee: "Free", highlights: ["Traditional bamboo houses", "Local weavers", "Cultural demonstrations"] },
      { id: "ts2", cityId: "c1", name: "Talley Valley Wildlife Sanctuary", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=80", description: "A pristine forest reserve home to clouded leopard, Himalayan black bear, and over 200 bird species.", category: "Nature", timings: "6 AM – 5 PM", idealDuration: "Full Day", distanceFromStart: "15 km", entryFee: "₹50/person", highlights: ["Bird watching", "Trekking trails", "Rare orchid sightings"] },
      { id: "ts3", cityId: "c1", name: "Ziro Music Festival Grounds", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=80", description: "The iconic outdoor music festival venue set amidst the paddy fields — equally stunning year-round.", category: "Culture", timings: "Open all year", idealDuration: "1-2 hours", distanceFromStart: "2 km", entryFee: "Free (event tickets during festival)", highlights: ["Paddy field panorama", "Festival vibes", "Photography"] },
    ],
    stays: [
      { id: "s1", cityId: "c1", name: "Apatani Heritage Homestay", type: "Homestay", image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&auto=format&fit=crop&q=80", shortDescription: "Experience authentic local culture in a traditional bamboo house with homemade Apatani meals.", priceRange: "Mid-range", amenities: ["Local Food", "Fireplace", "Cultural Tour", "Wi-Fi"], contactInfo: "+91-9876543210", rating: 4.8, reviewCount: 142 },
      { id: "s2", cityId: "c1", name: "Ziro Valley Camp", type: "Camp", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80", shortDescription: "Luxury tents amidst the paddy fields with bonfires and stargazing.", priceRange: "Premium", amenities: ["Bonfire", "Meals Included", "Guided Trek", "Stargazing"], contactInfo: "+91-9876543220", rating: 4.6, reviewCount: 87 },
    ],
    guides: [
      { id: "g1", cityId: "c1", name: "Tage Yami", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80", languages: ["English", "Hindi", "Apatani"], specialization: ["Tribal Culture", "Bird Watching", "Photography Tours"], experienceYears: 8, pricePerDay: "₹1,500/day", contactInfo: "+91-9876500001", rating: 4.9, bio: "Born and raised in Ziro, Tage brings an insider's perspective on Apatani culture and the valley's hidden trails." },
    ],
    foodPlaces: [
      { id: "f1", cityId: "c1", name: "Ziro Kitchen", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80", category: "Restaurant", cuisine: ["Apatani", "North-East Indian"], specialty: "Pika Pila (Fermented bamboo shoot curry)", priceRange: "$$", openingHours: "7 AM – 9 PM" },
      { id: "f2", cityId: "c1", name: "Pine Cafe", image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80", category: "Cafe", cuisine: ["Continental", "Indian"], specialty: "Valley view breakfast with local rice beer", priceRange: "$", openingHours: "6 AM – 7 PM" },
    ],
    hospitals: [
      { id: "h1", cityId: "c1", name: "Ziro District Hospital", type: "Hospital", address: "District Hospital Road, Ziro, Arunachal Pradesh", contactInfo: "+91-3788-224-100", emergencyAvailable: true, services: ["Emergency", "General OPD", "Laboratory", "Pharmacy"], openingHours: "24 Hours (Emergency)" },
    ],
    howToReach: {
      byAir: { nearestAirport: "Itanagar (Hollongi) – 95 km", distance: "95 km", airlines: ["IndiGo", "Air India"], notes: "From Itanagar, hire a taxi or shared cab to Ziro (~3 hours)." },
      byTrain: { nearestStation: "Naharlagun Railway Station – 100 km", distance: "100 km", trains: ["Arunachal Express"], notes: "Take a taxi from Naharlagun to Ziro. The drive takes 3-4 hours through scenic hill roads." },
      byRoad: { routes: ["Guwahati → North Lakhimpur → Ziro (NH-415)", "Itanagar → Ziro via NH-415"], distanceFromGuwahati: "480 km (~9 hours drive)", notes: "Roads can be challenging during monsoon. Check Inner Line Permit before travel.", localTransport: ["Shared taxis", "Private jeep hire", "Motorcycle rental"] },
    },
    faqs: [
      { id: "faq1", question: "Is an Inner Line Permit required for Ziro?", answer: "Yes. Indian nationals require an Inner Line Permit (ILP) and foreign nationals need a Protected Area Permit (PAP). ILP can be obtained online or at Arunachal Pradesh government offices." },
      { id: "faq2", question: "What is the best time to visit Ziro Music Festival?", answer: "The Ziro Music Festival takes place in September. Book accommodation 2-3 months in advance as the valley fills up quickly." },
      { id: "faq3", question: "Is Ziro safe for solo female travelers?", answer: "Ziro is considered very safe for solo travelers including women. The Apatani community is warm and welcoming. Standard travel precautions apply." },
    ],
  },
  {
    id: "c2",
    slug: "serchhip",
    name: "Serchhip",
    state: "Mizoram",
    shortDescription: "Famous for the spectacular Vantawng Falls and paragliding amidst lush green landscapes.",
    longDescription: "Serchhip is a pristine gem in the heart of Mizoram, offering some of the state's most dramatic natural scenery. The district is most famous for hosting Vantawng Falls (also called Vantawng Khawhthla), the highest waterfall in Mizoram and one of the tallest in India. Surrounded by dense subtropical forests, rolling green hills, and the serene Serchhip town known for its 100% literacy record, this destination is perfect for adventure seekers, nature lovers, and those wanting to experience authentic Mizo village life.",
    heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop&q=80",
    ],
    tags: ["Adventure", "Waterfalls", "Trekking", "Paragliding", "Village Life"],
    bestTimeToVisit: "September to May",
    permitRequired: true,
    featured: true,
    localTips: ["Carry rain gear — it can rain heavily even outside monsoon season", "Local Mizo food is exceptional — try bamboo shoot dishes", "Respect Mizo Sunday traditions — most shops close on Sundays"],
    touristSites: [
      { id: "ts4", cityId: "c2", name: "Vantawng Falls", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format&fit=crop&q=80", description: "At 751 feet, Vantawng is the highest waterfall in Mizoram and one of the most spectacular in Northeast India.", category: "Nature", timings: "6 AM – 5 PM", idealDuration: "3-4 hours", distanceFromStart: "20 km", entryFee: "₹20/person", highlights: ["Stunning 751-ft waterfall", "Forest trekking path", "Viewpoint platform"] },
      { id: "ts5", cityId: "c2", name: "Ngur Tlang Paragliding Site", image: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&auto=format&fit=crop&q=80", description: "The premier paragliding launch site in Mizoram with breathtaking aerial views of Serchhip's valleys.", category: "Adventure", timings: "7 AM – 4 PM (weather permitting)", idealDuration: "2-3 hours", distanceFromStart: "5 km", entryFee: "₹2,500/tandem flight", highlights: ["Tandem paragliding", "Panoramic valley views", "Sunrise flights available"] },
    ],
    stays: [
      { id: "s3", cityId: "c2", name: "Vantawng Heights Resort", type: "Resort", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80", shortDescription: "Luxury stays with panoramic views of the Mizoram hills and forested valleys.", priceRange: "Premium", amenities: ["Restaurant", "Spa", "Guided Treks", "Heater", "Wi-Fi"], contactInfo: "+91-9876543211", rating: 4.5, reviewCount: 63 },
    ],
    guides: [
      { id: "g2", cityId: "c2", name: "Lalmuanpuia Ralte", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80", languages: ["English", "Hindi", "Mizo"], specialization: ["Waterfall Treks", "Paragliding Assistance", "Village Walks"], experienceYears: 6, pricePerDay: "₹1,200/day", contactInfo: "+91-9876500002", rating: 4.7, bio: "A passionate outdoor guide from Serchhip who specializes in adventure tourism and eco-tourism experiences." },
    ],
    foodPlaces: [
      { id: "f3", cityId: "c2", name: "Zawlbuk Kitchen", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80", category: "Local Food", cuisine: ["Mizo", "Traditional Northeast"], specialty: "Vawksa Rep (smoked pork with bamboo shoots)", priceRange: "$", openingHours: "8 AM – 8 PM" },
    ],
    hospitals: [
      { id: "h2", cityId: "c2", name: "Serchhip Civil Hospital", type: "Hospital", address: "Hospital Road, Serchhip, Mizoram – 796181", contactInfo: "+91-3838-222-100", emergencyAvailable: true, services: ["Emergency", "OPD", "Surgery", "Pharmacy"], openingHours: "24 Hours" },
    ],
    howToReach: {
      byAir: { nearestAirport: "Lengpui Airport, Aizawl – 110 km", distance: "110 km", airlines: ["IndiGo", "Air India"], notes: "Flights connect Aizawl to major cities. Taxis available from Lengpui to Serchhip." },
      byRoad: { routes: ["Aizawl → Serchhip (NH 306, 110 km)"], distanceFromGuwahati: "520 km (~10 hours)", notes: "Roads are well-maintained. State buses and shared taxis operate from Aizawl.", localTransport: ["State buses", "Shared taxis", "Auto-rickshaws in town"] },
    },
    faqs: [
      { id: "faq4", question: "What permits do I need for Serchhip, Mizoram?", answer: "Indian nationals require an Inner Line Permit (ILP) for Mizoram. Foreign nationals need a Restricted Area Permit. ILPs can be obtained online at the Mizoram government portal." },
    ],
  },
  {
    id: "c3",
    slug: "tamenglong",
    name: "Tamenglong",
    state: "Manipur",
    shortDescription: "The Land of the Hornbill, offering deep gorges, magnificent caves, and virgin forests.",
    longDescription: "Tamenglong district in Manipur is an unexplored paradise, known as the 'Land of the Hornbill'. Home to the Zeliangrong Naga tribes, the region is characterized by its dense subtropical rainforests, dramatic gorges cut by the Barak River, spectacular caves, and some of the most pristine biodiversity in Northeast India. The orange orchards and the famous Zeilad Lake — shaped like a figure-8 — make Tamenglong a bucket-list destination for those seeking paths truly less traveled.",
    heroImage: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&auto=format&fit=crop&q=80",
    ],
    tags: ["Wildlife", "Offbeat", "Forests", "Caves", "Tribe"],
    bestTimeToVisit: "October to April",
    permitRequired: true,
    featured: true,
    touristSites: [
      { id: "ts6", cityId: "c3", name: "Zeilad Wildlife Sanctuary", image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&auto=format&fit=crop&q=80", description: "A unique figure-8 shaped lake surrounded by pristine forest — home to the endangered hornbill and migratory birds.", category: "Nature", timings: "6 AM – 5 PM", idealDuration: "Full Day", distanceFromStart: "25 km", entryFee: "₹50", highlights: ["Figure-8 lake", "Hornbill sighting", "Bird watching"] },
      { id: "ts7", cityId: "c3", name: "Barak Waterfall", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format&fit=crop&q=80", description: "A dramatic multi-tier waterfall on the Barak River gorge accessible through jungle trails.", category: "Adventure", timings: "Daylight hours only", idealDuration: "4-5 hours", distanceFromStart: "30 km", entryFee: "Free", highlights: ["Multi-tier waterfall", "River gorge", "Jungle trek"] },
    ],
    stays: [
      { id: "s4", cityId: "c3", name: "Hornbill Retreat", type: "Homestay", image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&auto=format&fit=crop&q=80", shortDescription: "Cozy tribal homestay run by local Zeliangrong families. Authentic food and cultural immersion.", priceRange: "Budget", amenities: ["Local Meals", "Bonfire", "Cultural Stories", "Guided Treks"], contactInfo: "+91-9876543212", rating: 4.7, reviewCount: 45 },
    ],
    guides: [
      { id: "g3", cityId: "c3", name: "Kamei Gangmei", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80", languages: ["English", "Manipuri", "Zeliangrong Naga"], specialization: ["Forest Treks", "Wildlife Spotting", "Tribal Culture"], experienceYears: 10, pricePerDay: "₹1,800/day", contactInfo: "+91-9876500003", rating: 5.0, bio: "A tribal elder's son and certified eco-guide, Kamei offers unparalleled insight into Tamenglong's forests and traditions." },
    ],
    foodPlaces: [
      { id: "f4", cityId: "c3", name: "Forest Edge Eatery", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80", category: "Local Food", cuisine: ["Naga", "Manipuri"], specialty: "Wild mushroom and pork curry with rice beer", priceRange: "$", openingHours: "7 AM – 8 PM" },
    ],
    hospitals: [
      { id: "h3", cityId: "c3", name: "District Hospital Tamenglong", type: "Hospital", address: "MG Road, Tamenglong, Manipur – 795138", contactInfo: "+91-3834-240-100", emergencyAvailable: true, services: ["Emergency", "OPD", "Pharmacy"], openingHours: "24 Hours (Emergency)" },
    ],
    howToReach: {
      byAir: { nearestAirport: "Imphal International Airport – 140 km", distance: "140 km", notes: "Flights from Delhi, Kolkata, Guwahati connect to Imphal. Hire a taxi to Tamenglong (~4 hours)." },
      byRoad: { routes: ["Imphal → Tamenglong (NH-37, 140 km)", "Guwahati → Jiribam → Tamenglong via NH-37"], distanceFromGuwahati: "560 km", notes: "Roads can be rough in monsoon season. 4WD vehicles recommended.", localTransport: ["Shared jeeps from Imphal", "Private taxis", "State transport buses"] },
    },
    faqs: [
      { id: "faq5", question: "Is Tamenglong safe to visit given Manipur's political situation?", answer: "Tamenglong is generally considered peaceful and safe for tourists. Always check current travel advisories and register with local authorities upon arrival. Consult your guide network before visiting remote areas." },
    ],
  },
  { id: "c4", slug: "kohima", name: "Kohima", state: "Nagaland", shortDescription: "Historic city famous for the Hornbill Festival and the poignant WWII cemetery.", longDescription: "Kohima is the capital of Nagaland and stands as a testament to resilience and culture. The Battle of Kohima in WWII is commemorated in one of the most moving war cemeteries in Asia. Today, the city hosts the legendary Hornbill Festival every December — a celebration of the 16 Naga tribes' culture, dance, and crafts.", heroImage: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1200&auto=format&fit=crop&q=80", gallery: [], tags: ["History", "Culture", "Festival"], bestTimeToVisit: "November to March", permitRequired: true, featured: false, howToReach: { byAir: { nearestAirport: "Dimapur Airport – 74 km", distance: "74 km", notes: "Daily flights to Dimapur from Delhi, Kolkata, Guwahati. Taxi to Kohima (2 hours)." }, byRoad: { routes: ["Guwahati → Dimapur → Kohima (NH-29)"], distanceFromGuwahati: "430 km", localTransport: ["State buses", "Shared taxis"] } } },
  { id: "c5", slug: "cherrapunji", name: "Cherrapunji", state: "Meghalaya", shortDescription: "One of the wettest places on earth, famed for living root bridges and cascading waterfalls.", longDescription: "Cherrapunji, or Sohra, receives extreme rainfall and is the birthplace of iconic living root bridges — centuries-old structures woven from rubber fig tree roots by the Khasi tribe. The landscape is dramatic with sheer limestone cliffs, deep gorges, and waterfalls plunging into Bangladesh.", heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop&q=80", gallery: [], tags: ["Nature", "Monsoon", "Root Bridges", "Waterfalls"], bestTimeToVisit: "October to May", permitRequired: false, featured: true },
  { id: "c6", slug: "gangtok", name: "Gangtok", state: "Sikkim", shortDescription: "A vibrant mountain capital offering stunning views of Kanchenjunga.", longDescription: "Gangtok is the clean, organised capital of Sikkim, perched at 5,500 ft. Dramatic views of the Kanchenjunga peak dominate the skyline. Monasteries, cable car rides, and the MG Marg promenade make it a beloved mountain destination.", heroImage: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=1200&auto=format&fit=crop&q=80", gallery: [], tags: ["Mountains", "Monasteries", "Cable Car"], bestTimeToVisit: "March to May, Oct to Dec", permitRequired: true, featured: false },
  { id: "c7", slug: "majuli", name: "Majuli", state: "Assam", shortDescription: "The world's largest river island, a hub of Assamese neo-Vaishnavite culture.", longDescription: "Majuli is the world's largest inhabited freshwater river island, set in the Brahmaputra. It is the spiritual heartland of neo-Vaishnavite monasteries (Satras), mask-making traditions, and vibrant Bihu festivals.", heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&auto=format&fit=crop&q=80", gallery: [], tags: ["Culture", "Island", "Monasteries"], bestTimeToVisit: "October to March", permitRequired: false, featured: false },
  { id: "c8", slug: "tawang", name: "Tawang", state: "Arunachal Pradesh", shortDescription: "Spiritual haven with India's largest monastery at breathtaking altitudes.", longDescription: "Tawang sits at 10,000 ft and is home to the 400-year-old Tawang Monastery — the largest in India and second largest in Asia. Snow-capped peaks, glacial lakes, the Sela Pass at 13,700 ft, and prayer flags fluttering in the Himalayan wind define this deeply spiritual and stunningly beautiful destination.", heroImage: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&auto=format&fit=crop&q=80", gallery: [], tags: ["Spiritual", "Snow", "Monastery", "High Altitude"], bestTimeToVisit: "April to October", permitRequired: true, featured: false },
  { id: "c9", slug: "agartala", name: "Agartala", state: "Tripura", shortDescription: "City of palaces and rich cultural heritage with ancient temples.", longDescription: "Agartala is the capital of Tripura and home to the iconic Ujjayanta Palace, Neermahal water palace on Rudrasagar Lake, and numerous ancient temples. The city has a unique Bengali-Tripuri cultural blend.", heroImage: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200&auto=format&fit=crop&q=80", gallery: [], tags: ["Heritage", "Palaces", "Temples"], bestTimeToVisit: "October to March", permitRequired: false, featured: false },
  { id: "c10", slug: "shillong", name: "Shillong", state: "Meghalaya", shortDescription: "The Scotland of the East with rolling hills, waterfalls and vibrant music culture.", longDescription: "Shillong, the 'Scotland of the East', is Meghalaya's capital and India's only hill station with a rock & roll soul. The Khasi Hills, Ward's Lake, waterfalls, golf courses, and an astounding live music scene make it one of Northeast India's most popular destinations.", heroImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&auto=format&fit=crop&q=80", gallery: [], tags: ["Music", "Hills", "Waterfalls", "Urban"], bestTimeToVisit: "All year", permitRequired: false, featured: false },
  { id: "c11", slug: "kaziranga", name: "Kaziranga", state: "Assam", shortDescription: "Home of the one-horned rhinoceros and a UNESCO World Heritage Site.", longDescription: "Kaziranga National Park is a UNESCO World Heritage Site and home to two-thirds of the world's great one-horned rhinos. The park also houses wild buffalo, elephants, tigers, and over 478 bird species set across vast floodplain grasslands and forest.", heroImage: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=1200&auto=format&fit=crop&q=80", gallery: [], tags: ["Wildlife", "Safari", "Rhino", "UNESCO"], bestTimeToVisit: "November to April", permitRequired: false, featured: true },
  { id: "c12", slug: "dimapur", name: "Dimapur", state: "Nagaland", shortDescription: "The gateway to Nagaland with ancient Kachari ruins and bustling markets.", longDescription: "Dimapur is Nagaland's largest city and commercial hub, the gateway into the state. The ruins of the medieval Kachari kingdom, Nagaland Science Centre, and diverse street food make it worth a stop.", heroImage: "https://images.unsplash.com/photo-1540202403-b7abd6747a18?w=1200&auto=format&fit=crop&q=80", gallery: [], tags: ["Gateway", "History", "Markets"], bestTimeToVisit: "October to March", permitRequired: true, featured: false },
  { id: "c13", slug: "aizawl", name: "Aizawl", state: "Mizoram", shortDescription: "A citadel-like capital perched on ridges with vibrant Mizo culture and handicrafts.", longDescription: "Aizawl is built entirely on steep ridges at 4,000 ft, giving it a dramatic urban landscape unlike anywhere else. Colourful churches, the bustling Bara Bazar, Mizo handicrafts, and the famed Chapchar Kut festival define this characterful city.", heroImage: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1200&auto=format&fit=crop&q=80", gallery: [], tags: ["Cityscape", "Hills", "Culture", "Handicrafts"], bestTimeToVisit: "September to April", permitRequired: true, featured: false },
  { id: "c14", slug: "pelling", name: "Pelling", state: "Sikkim", shortDescription: "Breathtaking Himalayan views, ancient monasteries, and pristine nature.", longDescription: "Pelling offers arguably the best views of the Kanchenjunga massif in Sikkim. The Pemayangtse Monastery, Singshore Bridge (highest suspension bridge in India), and the newly constructed Skywalk make it a top Himalayan destination.", heroImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80", gallery: [], tags: ["Mountains", "Monastery", "Skywalk", "Himalayan Views"], bestTimeToVisit: "February to May", permitRequired: true, featured: false },
];

// ── PACKAGES ────────────────────────────────────────────────────────────────
export const mockPackages: Package[] = [
  {
    id: "p1", title: "Mystic Mountains: Ziro & Tawang", slug: "mystic-mountains-ziro-tawang", duration: "7N/8D", price: 35000, featuredImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80", destinations: ["Ziro", "Tawang"], theme: "Cultural", highlights: ["Apatani Tribe Village Tour", "Tawang Monastery", "Sela Pass", "Pankang Teng Tso Lake"], inclusions: ["Breakfast & Dinner", "Accommodation", "Permits", "Local Guide", "Transport"], bestFor: "Couples & Culture Seekers",
    itinerary: [
      { day: 1, title: "Arrive in Ziro", description: "Arrive at Naharlagun/Itanagar, transfer to Ziro. Check in and orientation walk." },
      { day: 2, title: "Apatani Culture Day", description: "Visit Apatani villages — Hong, Hari, and Bamin Michi. Witness cultural demonstrations and bamboo craft workshops." },
      { day: 3, title: "Talley Valley Trek", description: "Full-day trek into the lush Talley Valley Wildlife Sanctuary. Birding and forest picnic." },
      { day: 4, title: "Drive to Tawang", description: "Scenic drive through Seppa and Bomdila. Arrive Tawang by evening." },
      { day: 5, title: "Tawang Monastery & Town", description: "Explore the 400-year-old Tawang Monastery, Urgelling, and Tawang War Memorial." },
      { day: 6, title: "Sela Pass & Pankang Lake", description: "High-altitude day trip to Sela Pass (13,700 ft) and glacial Pankang Teng Tso Lake." },
      { day: 7, title: "Leisure in Tawang", description: "Free morning for shopping local handicrafts. Departure prep." },
      { day: 8, title: "Departure", description: "Transfer to airport/station. End of tour." },
    ]
  },
  {
    id: "p2", title: "Meghalaya Monsoons: Shillong & Cherrapunji", slug: "meghalaya-monsoons", duration: "5N/6D", price: 22000, featuredImage: "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&q=80", destinations: ["Shillong", "Cherrapunji"], theme: "Adventure", highlights: ["Double Decker Root Bridge", "Nohkalikai Falls", "Mawlynnong Village", "Dawki River Boating"], inclusions: ["Breakfast", "Accommodation", "Local Guide", "Transport", "Boat Ride"], bestFor: "Adventure & Nature Lovers",
  },
  {
    id: "p3", title: "Wildlife Safari: Kaziranga & Majuli", slug: "wildlife-safari-kaziranga", duration: "4N/5D", price: 18500, featuredImage: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&q=80", destinations: ["Kaziranga", "Majuli"], theme: "Adventure", highlights: ["Elephant Safari", "Jeep Safari", "Rhino Spotting", "Majuli Cultural Tour", "Bihu Performance"], inclusions: ["All Meals", "Lodge Stay", "Safari Fees", "Transport", "Guide"], bestFor: "Wildlife Enthusiasts & Families",
  },
  {
    id: "p4", title: "Sikkim Spiritual Circuit: Gangtok & Pelling", slug: "sikkim-spiritual", duration: "6N/7D", price: 28000, featuredImage: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&q=80", destinations: ["Gangtok", "Pelling"], theme: "Cultural", highlights: ["Rumtek Monastery", "Pemayangtse Monastery", "Nathula Pass", "Singshore Bridge", "Kanchenjunga Views"], inclusions: ["Breakfast & Dinner", "Hotel Stay", "Permits", "Sightseeing", "Transport"], bestFor: "Spiritual Seekers & Couples",
  },
];

export const mockStays = cities.flatMap(c => c.stays ?? []);
export const mockGuides = cities.flatMap(c => c.guides ?? []);

// ── TESTIMONIALS ─────────────────────────────────────────────────────────────
export const testimonials: Testimonial[] = [
  { id: "t1", name: "Arjun Mehta", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80", location: "Mumbai, Maharashtra", rating: 5, review: "The Ziro package was absolutely life-changing. Waking up to misty paddy fields, sitting around an Apatani bonfire — Enchanting8 handled every detail perfectly. Will book again!", destination: "Ziro, Arunachal Pradesh", date: "October 2024" },
  { id: "t2", name: "Kavita Reddy", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80", location: "Hyderabad, Telangana", rating: 5, review: "Serchhip completely blew my expectations. Paragliding over those impossibly green valleys, and the Vantawng Falls — I've never been so speechless. Flawless logistics too.", destination: "Serchhip, Mizoram", date: "December 2024" },
  { id: "t3", name: "David Chen", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80", location: "Singapore", rating: 5, review: "As a wildlife photographer, Kaziranga exceeded every dream. The rhino encounters were otherworldly. Guide Kamei was phenomenal — genuine knowledge, genuine passion.", destination: "Kaziranga, Assam", date: "November 2024" },
  { id: "t4", name: "Priya Nair", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80", location: "Bengaluru, Karnataka", rating: 4, review: "Tamenglong is what I imagine India looked like before modernisation. Raw, authentic, humbling. The tribal homestay experience made me rethink luxury entirely.", destination: "Tamenglong, Manipur", date: "January 2025" },
];

// ── ENQUIRIES (mock admin data) ──────────────────────────────────────────────
export const mockEnquiries: Enquiry[] = [
  { id: "e1", name: "Rahul Verma", email: "rahul@example.com", phone: "+91-9876543100", destination: "Ziro, Arunachal Pradesh", message: "Planning a trip for 4 people in September for the music festival. Need help with packages and permits.", status: "new", submittedAt: "2025-03-10T09:30:00Z" },
  { id: "e2", name: "Sarah Williams", email: "sarah@example.com", phone: "+91-9876543101", destination: "Meghalaya (Cherrapunji + Shillong)", message: "Looking for a 6-day trip for 2 adults in July during monsoon. Interested in the root bridge treks.", status: "in-progress", submittedAt: "2025-03-09T14:15:00Z" },
  { id: "e3", name: "Naresh Gupta", email: "naresh@example.com", phone: "+91-9876543102", destination: "Kaziranga", message: "Solo traveler, budget conscious. Need advice on safari timings and entry fees for April trip.", status: "resolved", submittedAt: "2025-03-08T11:00:00Z" },
  { id: "e4", name: "Lakshmi Pillai", email: "lakshmi@example.com", phone: "+91-9876543103", destination: "Tamenglong, Manipur", message: "Want to know more about the tribal homestay options and how to get permits for Manipur.", status: "new", submittedAt: "2025-03-11T16:45:00Z" },
];

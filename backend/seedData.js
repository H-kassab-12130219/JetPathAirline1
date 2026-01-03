import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// MySQL Connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'jetpathairline',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Helper to generate flightId
const generateFlightId = (location) => {
  return `JET-${location.substring(0, 3).toUpperCase()}-${Date.now()}`;
};

// Helper to generate dates
const getDepartureDate = (daysFromNow = 7) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date;
};

const getArrivalDate = (departureDate, hours = 8) => {
  const date = new Date(departureDate);
  date.setHours(date.getHours() + hours);
  return date;
};

// Sample flight data
const sampleFlights = [
  // Europe Flights
  {
    arrivalLocation: "Paris",
    departureLocation: "Beirut",
    continent: "Europe",
    roundTrip: "Round Trip",
    price: 850,
    imgsrc: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a",
    flightType: "Economy",
    departureDateTime: getDepartureDate(7),
    arrivalDateTime: getArrivalDate(getDepartureDate(7), 4),
    flightId: generateFlightId("Paris")
  },
  {
    arrivalLocation: "London",
    departureLocation: "Beirut",
    continent: "Europe",
    roundTrip: "Round Trip",
    price: 780,
    imgsrc: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad",
    flightType: "Economy",
    departureDateTime: getDepartureDate(10),
    arrivalDateTime: getArrivalDate(getDepartureDate(10), 5),
    flightId: generateFlightId("London")
  },
  {
    arrivalLocation: "Rome",
    departureLocation: "Beirut",
    continent: "Europe",
    roundTrip: "Round Trip",
    price: 720,
    imgsrc: "https://images.unsplash.com/photo-1552832230-c0197dd311b5",
    flightType: "Economy",
    departureDateTime: getDepartureDate(14),
    arrivalDateTime: getArrivalDate(getDepartureDate(14), 3),
    flightId: generateFlightId("Rome")
  },
  {
    arrivalLocation: "Barcelona",
    departureLocation: "Beirut",
    continent: "Europe",
    roundTrip: "Round Trip",
    price: 690,
    imgsrc: "https://images.unsplash.com/photo-1583422409516-2895a77efded",
    flightType: "Economy",
    departureDateTime: getDepartureDate(21),
    arrivalDateTime: getArrivalDate(getDepartureDate(21), 4),
    flightId: generateFlightId("Barcelona")
  },
  {
    arrivalLocation: "Amsterdam",
    departureLocation: "Beirut",
    continent: "Europe",
    roundTrip: "Round Trip",
    price: 710,
    imgsrc: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017",
    flightType: "Economy",
    departureDateTime: getDepartureDate(28),
    arrivalDateTime: getArrivalDate(getDepartureDate(28), 5),
    flightId: generateFlightId("Amsterdam")
  },

  // Asia Flights
  {
    arrivalLocation: "Tokyo",
    departureLocation: "Beirut",
    continent: "Asia",
    roundTrip: "Round Trip",
    price: 1200,
    imgsrc: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
    flightType: "Economy",
    departureDateTime: getDepartureDate(5),
    arrivalDateTime: getArrivalDate(getDepartureDate(5), 12),
    flightId: generateFlightId("Tokyo")
  },
  {
    arrivalLocation: "Dubai",
    departureLocation: "Beirut",
    continent: "Asia",
    roundTrip: "Round Trip",
    price: 450,
    imgsrc: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
    flightType: "Economy",
    departureDateTime: getDepartureDate(3),
    arrivalDateTime: getArrivalDate(getDepartureDate(3), 3),
    flightId: generateFlightId("Dubai")
  },
  {
    arrivalLocation: "Bangkok",
    departureLocation: "Beirut",
    continent: "Asia",
    roundTrip: "Round Trip",
    price: 880,
    imgsrc: "https://images.unsplash.com/photo-1508009603885-50cf7c579365",
    flightType: "Economy",
    departureDateTime: getDepartureDate(12),
    arrivalDateTime: getArrivalDate(getDepartureDate(12), 9),
    flightId: generateFlightId("Bangkok")
  },
  {
    arrivalLocation: "Singapore",
    departureLocation: "Beirut",
    continent: "Asia",
    roundTrip: "Round Trip",
    price: 920,
    imgsrc: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd",
    flightType: "Economy",
    departureDateTime: getDepartureDate(18),
    arrivalDateTime: getArrivalDate(getDepartureDate(18), 10),
    flightId: generateFlightId("Singapore")
  },
  {
    arrivalLocation: "Seoul",
    departureLocation: "Beirut",
    continent: "Asia",
    roundTrip: "Round Trip",
    price: 1100,
    imgsrc: "https://images.unsplash.com/photo-1538485399081-7191377e8241",
    flightType: "Economy",
    departureDateTime: getDepartureDate(25),
    arrivalDateTime: getArrivalDate(getDepartureDate(25), 11),
    flightId: generateFlightId("Seoul")
  },

  // Africa Flights
  {
    arrivalLocation: "Cairo",
    departureLocation: "Beirut",
    continent: "Africa",
    roundTrip: "Round Trip",
    price: 600,
    imgsrc: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a",
    flightType: "Economy",
    departureDateTime: getDepartureDate(2),
    arrivalDateTime: getArrivalDate(getDepartureDate(2), 2),
    flightId: generateFlightId("Cairo")
  },
  {
    arrivalLocation: "Cape Town",
    departureLocation: "Beirut",
    continent: "Africa",
    roundTrip: "Round Trip",
    price: 890,
    imgsrc: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99",
    flightType: "Economy",
    departureDateTime: getDepartureDate(15),
    arrivalDateTime: getArrivalDate(getDepartureDate(15), 8),
    flightId: generateFlightId("CapeTown")
  },
  {
    arrivalLocation: "Marrakech",
    departureLocation: "Beirut",
    continent: "Africa",
    roundTrip: "Round Trip",
    price: 580,
    imgsrc: "https://images.unsplash.com/photo-1597211684557-c1cdb5b0ca6e",
    flightType: "Economy",
    departureDateTime: getDepartureDate(9),
    arrivalDateTime: getArrivalDate(getDepartureDate(9), 6),
    flightId: generateFlightId("Marrakech")
  },
  {
    arrivalLocation: "Nairobi",
    departureLocation: "Beirut",
    continent: "Africa",
    roundTrip: "Round Trip",
    price: 750,
    imgsrc: "https://images.unsplash.com/photo-1611348586804-61bf6c080437",
    flightType: "Economy",
    departureDateTime: getDepartureDate(20),
    arrivalDateTime: getArrivalDate(getDepartureDate(20), 7),
    flightId: generateFlightId("Nairobi")
  },
  {
    arrivalLocation: "Johannesburg",
    departureLocation: "Beirut",
    continent: "Africa",
    roundTrip: "Round Trip",
    price: 820,
    imgsrc: "https://images.unsplash.com/photo-1577948000111-9c970dfe3743",
    flightType: "Economy",
    departureDateTime: getDepartureDate(30),
    arrivalDateTime: getArrivalDate(getDepartureDate(30), 9),
    flightId: generateFlightId("Johannesburg")
  },

  // North America Flights
  {
    arrivalLocation: "New York",
    departureLocation: "Beirut",
    continent: "North America",
    roundTrip: "Round Trip",
    price: 1100,
    imgsrc: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
    flightType: "Economy",
    departureDateTime: getDepartureDate(6),
    arrivalDateTime: getArrivalDate(getDepartureDate(6), 13),
    flightId: generateFlightId("NewYork")
  },
  {
    arrivalLocation: "Los Angeles",
    departureLocation: "Beirut",
    continent: "North America",
    roundTrip: "Round Trip",
    price: 1050,
    imgsrc: "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da",
    flightType: "Economy",
    departureDateTime: getDepartureDate(13),
    arrivalDateTime: getArrivalDate(getDepartureDate(13), 16),
    flightId: generateFlightId("LosAngeles")
  },
  {
    arrivalLocation: "Miami",
    departureLocation: "Beirut",
    continent: "North America",
    roundTrip: "Round Trip",
    price: 950,
    imgsrc: "https://images.unsplash.com/photo-1514214246283-d427a95c5d2f",
    flightType: "Economy",
    departureDateTime: getDepartureDate(19),
    arrivalDateTime: getArrivalDate(getDepartureDate(19), 14),
    flightId: generateFlightId("Miami")
  },
  {
    arrivalLocation: "Toronto",
    departureLocation: "Beirut",
    continent: "North America",
    roundTrip: "Round Trip",
    price: 980,
    imgsrc: "https://images.unsplash.com/photo-1517935706615-2717063c2225",
    flightType: "Economy",
    departureDateTime: getDepartureDate(24),
    arrivalDateTime: getArrivalDate(getDepartureDate(24), 12),
    flightId: generateFlightId("Toronto")
  },
  {
    arrivalLocation: "Vancouver",
    departureLocation: "Beirut",
    continent: "North America",
    roundTrip: "Round Trip",
    price: 1150,
    imgsrc: "https://images.unsplash.com/photo-1559511260-66a654ae982a",
    flightType: "Economy",
    departureDateTime: getDepartureDate(31),
    arrivalDateTime: getArrivalDate(getDepartureDate(31), 15),
    flightId: generateFlightId("Vancouver")
  }
];

// Function to seed the database
async function seedDatabase() {
  try {
    // Test connection
    await pool.getConnection();
    console.log('Connected to MySQL database');

    // Clear existing flights
    await pool.execute('DELETE FROM flights');
    console.log('Cleared existing flights');
    
    // Insert new flights
    for (const flight of sampleFlights) {
      await pool.execute(
        `INSERT INTO flights 
        (arrivalLocation, departureLocation, continent, roundTrip, price, imgsrc, flightType, departureDateTime, arrivalDateTime, flightId) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          flight.arrivalLocation,
          flight.departureLocation,
          flight.continent,
          flight.roundTrip,
          flight.price,
          flight.imgsrc,
          flight.flightType,
          flight.departureDateTime,
          flight.arrivalDateTime,
          flight.flightId
        ]
      );
    }
    
    console.log(`Successfully inserted ${sampleFlights.length} flights`);
    console.log('Database seeded successfully');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    await pool.end();
    process.exit(1);
  }
}

seedDatabase();

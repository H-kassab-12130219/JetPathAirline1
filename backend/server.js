import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import OpenAI from 'openai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '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',
});

const app = express();
const port = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create uploads/flights directory if it doesn't exist
const flightsUploadsDir = path.join(__dirname, 'uploads', 'flights');
if (!fs.existsSync(flightsUploadsDir)) {
  fs.mkdirSync(flightsUploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir));

// Configure multer for file uploads (flight images)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save flight images to uploads/flights directory
    cb(null, flightsUploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'flight-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'jetpathairline',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('Connected to MySQL database');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

// ==================== HELPER FUNCTIONS ====================

// Helper to format user data
const formatUser = (user) => {
  if (!user) return null;
  return {
    id: user.id,
    _id: user.id.toString(),
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    patronymic: user.patronymic || null,
    birthday: user.birthday || null,
    gender: user.gender || null,
    employmentStatus: user.employmentStatus || null,
    workingSince: user.workingSince || null,
    position: user.position || null,
    isAdmin: Boolean(user.isAdmin),
    flightsBookNumber: user.flightsBookNumber || 0,
    flightsDoneNumber: user.flightsDoneNumber || 0,
    flightsCanceledNumber: user.flightsCanceledNumber || 0,
    flightPrice: parseFloat(user.flightPrice) || 0,
    jetPoints: Number(user.jetPoints) || 0,
    tierLevel: user.tierLevel || 'Silver',
    loyaltyJoinDate: user.loyaltyJoinDate
      ? new Date(user.loyaltyJoinDate).toISOString().split('T')[0]
      : null,
    // Frontend compatibility aliases
    flightsBooked: user.flightsBookNumber || 0,
    flightsDone: user.flightsDoneNumber || 0,
    flightsCanceled: user.flightsCanceledNumber || 0,
    totalSpendings: parseFloat(user.flightPrice) || 0,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

// Helper to format flight data
const formatFlight = (flight) => {
  if (!flight) return null;
  return {
    id: flight.id,
    _id: flight.id.toString(),
    arrivalLocation: flight.arrivalLocation,
    departureLocation: flight.departureLocation,
    continent: flight.continent,
    roundTrip: flight.roundTrip || 'Round Trip',
    airlineName: flight.airlineName || 'JetPath Airlines',
    price: parseFloat(flight.price) || 0,
    imgsrc: flight.imgsrc,
    flightType: flight.flightType || 'Economy',
    departureDateTime: flight.departureDateTime,
    arrivalDateTime: flight.arrivalDateTime,
    returnDepartureDateTime: flight.returnDepartureDateTime,
    returnArrivalDateTime: flight.returnArrivalDateTime,
    co2ReductionPercent: flight.co2ReductionPercent ?? 0,
    flightId: flight.flightId || flight.id.toString(),
    createdAt: flight.createdAt,
    updatedAt: flight.updatedAt
  };
};

const VALID_TIER_LEVELS = new Set(['Silver', 'Gold', 'Platinum']);
const formatUserFlight = (booking, flight = null) => {
  return {
    id: booking.id,
    userId: booking.userId,
    flightId: booking.flightId,
    tickets: booking.tickets,
    price: parseFloat(booking.price),
    pointsEarned: Number(booking.pointsEarned) || 0,
    status: booking.status || 'booked',
    completedAt: booking.completedAt,
    bookingDate: booking.bookingDate,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
    flight: flight ? formatFlight(flight) : null
  };
};

const autoCompleteBookingIfNeeded = async (booking, flight) => {
  if (
    !booking ||
    booking.status === 'completed' ||
    !flight ||
    !flight.arrivalDateTime
  ) {
    return booking;
  }

  const arrivalDate = new Date(flight.arrivalDateTime);
  if (Number.isNaN(arrivalDate.getTime())) {
    return booking;
  }

  const now = new Date();
  if (arrivalDate <= now) {
    const completedAt = new Date();
    await pool.execute(
      'UPDATE userflights SET status = "completed", completedAt = ? WHERE id = ?',
      [completedAt, booking.id]
    );
    booking.status = 'completed';
    booking.completedAt = completedAt;
  }

  return booking;
};

const BASE_JETPOINT_RATE = 10; // points per currency unit
const CABIN_MULTIPLIERS = {
  economy: 1,
  premium: 1.15,
  business: 1.35,
  first: 1.5
};
const TIER_BONUS = {
  Silver: 1,
  Gold: 1.25,
  Platinum: 1.5
};

const normalizeTier = (tier) => (VALID_TIER_LEVELS.has(tier) ? tier : 'Silver');

const calculateTierForPoints = (jetPoints = 0) => {
  if (jetPoints >= 50000) return 'Platinum';
  if (jetPoints >= 20000) return 'Gold';
  return 'Silver';
};

const calculateEarnedJetPoints = ({ flight, tickets = 1, tierLevel = 'Silver' }) => {
  const pricePerTicket = parseFloat(flight?.price) || 0;
  const fareTotal = pricePerTicket * Number(tickets || 0);
  if (fareTotal <= 0) return 0;

  const cabinKey = (flight?.flightType || 'economy').toString().toLowerCase();
  const cabinMultiplier = CABIN_MULTIPLIERS[cabinKey] || CABIN_MULTIPLIERS.economy;
  const tierMultiplier = TIER_BONUS[normalizeTier(tierLevel)] || 1;

  return Math.round(fareTotal * BASE_JETPOINT_RATE * cabinMultiplier * tierMultiplier);
};

// ==================== MIDDLEWARE ====================

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ data: null, message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ data: null, message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ==================== AUTH ENDPOINTS ====================

// POST /api/Login/register
app.post('/api/Login/register', async (req, res) => {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      patronymic, 
      birthday, 
      gender, 
      employmentStatus, 
      workingSince, 
      position 
    } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ data: null, message: 'Email, password, first name, and last name are required' });
    }

    // Check if user exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ data: null, message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const loyaltyJoinDate = new Date();
    const defaultTier = 'Silver';
    const defaultJetPoints = 0;

    // Create user with all fields
    const [result] = await pool.execute(
      'INSERT INTO users (email, password, firstName, lastName, patronymic, birthday, gender, employmentStatus, workingSince, position, username, jetPoints, tierLevel, loyaltyJoinDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        email.toLowerCase(),
        hashedPassword,
        firstName,
        lastName,
        patronymic || null,
        birthday || null,
        gender || null,
        employmentStatus || null,
        workingSince || null,
        position || null,
        `${firstName} ${lastName}`,
        defaultJetPoints,
        defaultTier,
        loyaltyJoinDate
      ]
    );

    res.status(201).json({ data: 'User registered successfully', message: 'Success' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ data: null, message: error.message });
  }
});

// POST /api/Login/login
app.post('/api/Login/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ data: null, message: 'Email and password required' });
    }

    // Validate password is not empty
    if (password.trim().length === 0) {
      return res.status(400).json({ data: null, message: 'Password cannot be empty' });
    }

    // Find user
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (users.length === 0) {
      // Use same error message to prevent user enumeration
      return res.status(401).json({ data: null, message: 'Invalid credentials' });
    }

    const user = users[0];

    // Check if password is hashed (starts with $2a$, $2b$, or $2y$ - bcrypt hash format)
    // If password is not hashed (legacy accounts), hash it and update the database
    if (!user.password.startsWith('$2')) {
      console.warn(`User ${user.email} has unhashed password. Hashing now...`);
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await pool.execute(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, user.id]
      );
      user.password = hashedPassword;
    }

    // Verify password using bcrypt.compare (secure comparison)
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ data: null, message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ data: token, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ data: null, message: error.message });
  }
});

// POST /api/Login/get-name
app.post('/api/Login/get-name', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ data: null, message: 'User not found' });
    }

    const user = users[0];
    const username = user.username || `${user.firstName} ${user.lastName}`;
    res.json({ data: username, message: 'Success' });
  } catch (error) {
    console.error('Get name error:', error);
    res.status(500).json({ data: null, message: error.message });
  }
});

// POST /api/Login/get-id
app.post('/api/Login/get-id', authenticateToken, async (req, res) => {
  try {
    res.json({ data: req.user.userId, message: 'Success' });
  } catch (error) {
    console.error('Get id error:', error);
    res.status(500).json({ data: null, message: error.message });
  }
});

// POST /api/Login/get-user-by-id{id} - Handle ID appended to URL
app.post('/api/Login/get-user-by-id*', authenticateToken, async (req, res) => {
  try {
    // Extract ID from URL path (everything after get-user-by-id)
    let userId = req.path.replace('/api/Login/get-user-by-id', '');
    
    // If no ID in URL, try body or token
    if (!userId || userId === '') {
      if (req.body && req.body.userId) {
        userId = req.body.userId;
      } else {
        userId = req.user.userId;
      }
    }
    
    const [users] = await pool.execute(
      `SELECT id, username, email, firstName, lastName, patronymic, birthday, gender, employmentStatus, workingSince, position, isAdmin, flightsBookNumber, flightsDoneNumber,
        flightsCanceledNumber, flightPrice, jetPoints, tierLevel, loyaltyJoinDate, createdAt, updatedAt
       FROM users WHERE id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ data: null, message: 'User not found' });
    }

    res.json({ data: formatUser(users[0]), message: 'Success' });
  } catch (error) {
    console.error('Get user by id error:', error);
    res.status(500).json({ data: null, message: error.message });
  }
});

// POST /api/Login/update-user
app.post('/api/Login/update-user', authenticateToken, async (req, res) => {
  try {
    const {
      userId,
      flightsBookNumber,
      flightsDoneNumber,
      flightsCanceledNumber,
      flightPrice,
      jetPoints,
      tierLevel,
      loyaltyJoinDate
    } = req.body;
    const targetUserId = userId || req.user.userId;

    const updates = [];
    const values = [];

    if (flightsBookNumber !== undefined) {
      updates.push('flightsBookNumber = ?');
      values.push(flightsBookNumber);
    }
    if (flightsDoneNumber !== undefined) {
      updates.push('flightsDoneNumber = ?');
      values.push(flightsDoneNumber);
    }
    if (flightsCanceledNumber !== undefined) {
      updates.push('flightsCanceledNumber = ?');
      values.push(flightsCanceledNumber);
    }
    if (flightPrice !== undefined) {
      updates.push('flightPrice = ?');
      values.push(flightPrice);
    }
    if (jetPoints !== undefined) {
      const parsedJetPoints = Number(jetPoints);
      if (Number.isNaN(parsedJetPoints)) {
        return res.status(400).json({ data: null, message: 'Invalid jetPoints value' });
      }
      updates.push('jetPoints = ?');
      values.push(parsedJetPoints);
    }
    if (tierLevel !== undefined) {
      if (!VALID_TIER_LEVELS.has(tierLevel)) {
        return res.status(400).json({ data: null, message: 'Invalid tierLevel value' });
      }
      updates.push('tierLevel = ?');
      values.push(tierLevel);
    }
    if (loyaltyJoinDate) {
      const parsedDate = new Date(loyaltyJoinDate);
      if (Number.isNaN(parsedDate.getTime())) {
        return res.status(400).json({ data: null, message: 'Invalid loyaltyJoinDate value' });
      }
      updates.push('loyaltyJoinDate = ?');
      values.push(parsedDate);
    }

    if (updates.length === 0) {
      return res.status(400).json({ data: null, message: 'No fields to update' });
    }

    values.push(targetUserId);

    await pool.execute(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const [users] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [targetUserId]
    );

    if (users.length === 0) {
      return res.status(404).json({ data: null, message: 'User not found' });
    }

    res.json({ data: formatUser(users[0]), message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ data: null, message: error.message });
  }
});

// POST /api/Login/update-full-user
app.post('/api/Login/update-full-user', authenticateToken, async (req, res) => {
  try {
    const { 
      userId, 
      username, 
      email, 
      firstName, 
      lastName, 
      patronymic, 
      birthday, 
      gender, 
      employmentStatus, 
      workingSince, 
      position,
      currentPassword,
      newPassword
    } = req.body;
    const targetUserId = userId || req.user.userId;

    // If password change is requested, verify current password first
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ data: null, message: 'Current password is required to change password' });
      }

      // Get user's current password hash
      const [users] = await pool.execute(
        'SELECT password FROM users WHERE id = ?',
        [targetUserId]
      );

      if (users.length === 0) {
        return res.status(404).json({ data: null, message: 'User not found' });
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, users[0].password);
      if (!isPasswordValid) {
        return res.status(401).json({ data: null, message: 'Current password is incorrect' });
      }

      // Validate new password length
      if (newPassword.length < 6) {
        return res.status(400).json({ data: null, message: 'New password must be at least 6 characters long' });
      }

      // Hash the new password
      const saltRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
      
      // Update password
      await pool.execute(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedNewPassword, targetUserId]
      );
    }

    const updates = [];
    const values = [];

    // Handle firstName and lastName (prefer explicit values over username parsing)
    if (firstName !== undefined) {
      updates.push('firstName = ?');
      values.push(firstName);
    }
    if (lastName !== undefined) {
      updates.push('lastName = ?');
      values.push(lastName);
    }
    
    // Update username if provided, or construct from firstName/lastName
    if (username) {
      updates.push('username = ?');
      values.push(username);
    } else if (firstName !== undefined && lastName !== undefined) {
      updates.push('username = ?');
      values.push(`${firstName} ${lastName}`);
    }
    
    if (email) {
      updates.push('email = ?');
      values.push(email.toLowerCase());
    }
    
    // New profile fields
    if (patronymic !== undefined) {
      updates.push('patronymic = ?');
      values.push(patronymic || null);
    }
    if (birthday !== undefined) {
      updates.push('birthday = ?');
      values.push(birthday || null);
    }
    if (gender !== undefined) {
      updates.push('gender = ?');
      values.push(gender || null);
    }
    if (employmentStatus !== undefined) {
      updates.push('employmentStatus = ?');
      values.push(employmentStatus || null);
    }
    if (workingSince !== undefined) {
      updates.push('workingSince = ?');
      values.push(workingSince || null);
    }
    if (position !== undefined) {
      updates.push('position = ?');
      values.push(position || null);
    }

    // Only update other fields if there are updates or if password was already updated
    if (updates.length > 0) {
      values.push(targetUserId);
      await pool.execute(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    // Get updated user
    const [updatedUsers] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [targetUserId]
    );

    if (updatedUsers.length === 0) {
      return res.status(404).json({ data: null, message: 'User not found' });
    }

    const message = newPassword 
      ? 'Profile and password updated successfully' 
      : 'User updated successfully';

    res.json({ data: formatUser(updatedUsers[0]), message });
  } catch (error) {
    console.error('Update full user error:', error);
    res.status(500).json({ data: null, message: error.message });
  }
});

// POST /api/Login/logout
app.post('/api/Login/logout', authenticateToken, async (req, res) => {
  try {
    // Logout is handled client-side by removing the token
    // This endpoint just confirms the logout
    res.json({ data: 'Logged out successfully', message: 'Success' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ data: null, message: error.message });
  }
});

// ==================== FLIGHT ENDPOINTS ====================

// POST /api/flights/add-flight
app.post('/api/flights/get-all-flights', async (req, res) => {
  try {
    const [flights] = await pool.execute('SELECT * FROM flights');
    const flightsWithId = flights.map(flight => formatFlight(flight));
    res.json({ data: flightsWithId, message: 'Success' });
  } catch (error) {
    console.error('Get all flights error:', error);
    res.status(500).json({ data: null, message: error.message });
  }
});

// POST /api/Flight/get-flight-by-id{id} - Handle ID appended to URL
app.post('/api/Flight/get-flight-by-id*', async (req, res) => {
  try {
    // Extract ID from URL path (everything after get-flight-by-id)
    let flightId = req.path.replace('/api/Flight/get-flight-by-id', '');
    
    // If no ID in URL, try body
    if (!flightId || flightId === '') {
      if (req.body && req.body.flightId) {
        flightId = req.body.flightId;
      } else {
        flightId = req.body?.id || req.query?.id;
      }
    }
    
    let [flights] = await pool.execute(
      'SELECT * FROM flights WHERE flightId = ?',
      [flightId]
    );
    
    if (flights.length === 0) {
      [flights] = await pool.execute(
        'SELECT * FROM flights WHERE id = ?',
        [flightId]
      );
    }

    if (flights.length === 0) {
      return res.status(404).json({ data: null, message: 'Flight not found' });
    }

    const flightData = formatFlight(flights[0]);
    res.json({ data: flightData, message: 'Success' });
  } catch (error) {
    console.error('Get flight by id error:', error);
    res.status(500).json({ data: null, message: error.message });
  }
});

// ==================== USER FLIGHTS ENDPOINTS ====================

// POST /api/UserFlights/get-all-user-flights-by-id{id} - Handle ID appended to URL
app.post('/api/UserFlights/get-all-user-flights-by-id*', authenticateToken, async (req, res) => {
  try {
    // Extract ID from URL path (everything after get-all-user-flights-by-id)
    let userId = req.path.replace('/api/UserFlights/get-all-user-flights-by-id', '');
    
    // If no ID in URL, try body or token
    if (!userId || userId === '') {
      if (req.body && req.body.userId) {
        userId = req.body.userId;
      } else {
        userId = req.user.userId;
      }
    }
    
    const [userFlights] = await pool.execute(
      'SELECT * FROM userflights WHERE userId = ?',
      [userId]
    );
    
    // Format response to match frontend expectations
    const formattedFlights = await Promise.all(userFlights.map(async (uf) => {
      let [flights] = await pool.execute(
        'SELECT * FROM flights WHERE flightId = ? OR id = ?',
        [uf.flightId, uf.flightId]
      );
      
      let flight = flights.length > 0 ? flights[0] : null;
      if (!flight) {
        flight = {
          arrivalLocation: 'Unknown',
          departureLocation: 'Beirut',
          departureDateTime: null,
          arrivalDateTime: null,
          returnDepartureDateTime: null,
          returnArrivalDateTime: null,
          flightType: 'Economy',
          roundTrip: 'One Way',
          price: parseFloat(uf.price) / (uf.tickets || 1),
          flightId: uf.flightId
        };
      }

      const bookingWithAutoStatus = await autoCompleteBookingIfNeeded(uf, flight);
      return formatUserFlight(bookingWithAutoStatus, flight);
    }));

    res.json({ data: formattedFlights, message: 'Success' });
  } catch (error) {
    console.error('Get user flights error:', error);
    res.status(500).json({ data: null, message: error.message });
  }
});

// POST /api/UserFlights/add-user-flight
app.post('/api/UserFlights/add-user-flight', authenticateToken, async (req, res) => {
  try {
    const { tickets, uid, fid } = req.body;
    const userId = uid || req.user.userId;
    const flightId = fid;
    const normalizedTickets = Math.max(Number(tickets) || 0, 0);

    if (normalizedTickets <= 0) {
      return res.status(400).json({ data: null, message: 'Tickets must be greater than zero' });
    }

    const [userRows] = await pool.execute(
      'SELECT id, jetPoints, tierLevel FROM users WHERE id = ? LIMIT 1',
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ data: null, message: 'User not found' });
    }

    const user = userRows[0];

    // Find flight to get price
    let [flights] = await pool.execute(
      'SELECT * FROM flights WHERE flightId = ?',
      [flightId]
    );

    if (flights.length === 0) {
      [flights] = await pool.execute(
        'SELECT * FROM flights WHERE id = ?',
        [flightId]
      );
    }

    if (flights.length === 0) {
      return res.status(404).json({ data: null, message: 'Flight not found' });
    }

    const flight = flights[0];

    // Calculate total price
    const totalPrice = parseFloat(flight.price) * normalizedTickets;
    const flightIdentifier = flight.flightId || flight.id.toString();

    const earnedJetPoints = calculateEarnedJetPoints({
      flight,
      tickets: normalizedTickets,
      tierLevel: user.tierLevel,
    });

    const [existingBookings] = await pool.execute(
      'SELECT * FROM userflights WHERE userId = ? AND flightId = ? AND status = "booked" LIMIT 1',
      [userId, flightIdentifier]
    );

    let bookingRecord;

    if (existingBookings.length > 0) {
      const existingBooking = existingBookings[0];
      const updatedTickets = Number(existingBooking.tickets || 0) + normalizedTickets;
      const updatedPrice =
        parseFloat(existingBooking.price || 0) + parseFloat(totalPrice || 0);
      const updatedPoints = Number(existingBooking.pointsEarned || 0) + earnedJetPoints;

      await pool.execute(
        'UPDATE userflights SET tickets = ?, price = ?, pointsEarned = ? WHERE id = ?',
        [updatedTickets, updatedPrice, updatedPoints, existingBooking.id]
      );

      const [updatedBooking] = await pool.execute(
        'SELECT * FROM userflights WHERE id = ?',
        [existingBooking.id]
      );

      bookingRecord = updatedBooking[0];
    } else {
      // Create new user flight booking
      const [result] = await pool.execute(
        'INSERT INTO userflights (userId, flightId, pointsEarned, tickets, price) VALUES (?, ?, ?, ?, ?)',
        [userId, flightIdentifier, earnedJetPoints, normalizedTickets, totalPrice]
      );

      const [newBooking] = await pool.execute(
        'SELECT * FROM userflights WHERE id = ?',
        [result.insertId]
      );

      bookingRecord = newBooking[0];
    }

    const currentJetPoints = Number(user.jetPoints || 0);
    const newJetPointsTotal = currentJetPoints + earnedJetPoints;
    const updatedTier = calculateTierForPoints(newJetPointsTotal);

    if (earnedJetPoints > 0) {
      await pool.execute(
        'UPDATE users SET jetPoints = ?, tierLevel = ? WHERE id = ?',
        [newJetPointsTotal, updatedTier, userId]
      );
    }

    res.json({
      data: {
        booking: bookingRecord,
        pointsEarned: earnedJetPoints,
        totalJetPoints: newJetPointsTotal,
        tierLevel: updatedTier,
      },
      message: 'Flight booked successfully',
    });
  } catch (error) {
    console.error('Add user flight error:', error);
    res.status(500).json({ data: null, message: error.message });
  }
});

// POST /api/UserFlights/remove-user-flight-by-id
app.post('/api/UserFlights/remove-user-flight-by-id', authenticateToken, async (req, res) => {
  try {
    const { userId, flightid, ticketsToRemove } = req.body;
    const targetUserId = userId || req.user.userId;
    const removeCount = Math.max(Number(ticketsToRemove) || 1, 1);

    const [userRows] = await pool.execute(
      'SELECT id, jetPoints, tierLevel FROM users WHERE id = ? LIMIT 1',
      [targetUserId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ data: null, message: 'User not found' });
    }

    const user = userRows[0];

    const [existingBookings] = await pool.execute(
      'SELECT * FROM userflights WHERE userId = ? AND flightId = ? AND status = "booked" LIMIT 1',
      [targetUserId, flightid]
    );

    if (existingBookings.length === 0) {
      return res.status(404).json({ data: null, message: 'Booking not found' });
    }

    const booking = existingBookings[0];
    const currentTickets = Number(booking.tickets || 0);

    let pointsDeducted = 0;
    let bookingResponse = null;

    if (currentTickets <= removeCount) {
      pointsDeducted = Number(booking.pointsEarned || 0);
      await pool.execute('DELETE FROM userflights WHERE id = ?', [booking.id]);
    } else {
      const pricePerTicket = currentTickets > 0 ? parseFloat(booking.price || 0) / currentTickets : 0;
      const updatedTickets = currentTickets - removeCount;
      const updatedPrice = Math.max(parseFloat(booking.price || 0) - pricePerTicket * removeCount, 0);
      const pointsPerTicket =
        currentTickets > 0 ? Number(booking.pointsEarned || 0) / currentTickets : 0;
      pointsDeducted = Math.min(
        Number(booking.pointsEarned || 0),
        Math.round(pointsPerTicket * removeCount)
      );
      const updatedPoints = Math.max(Number(booking.pointsEarned || 0) - pointsDeducted, 0);

      await pool.execute(
        'UPDATE userflights SET tickets = ?, price = ?, pointsEarned = ? WHERE id = ?',
        [updatedTickets, updatedPrice, updatedPoints, booking.id]
      );

      const [updatedBooking] = await pool.execute(
        'SELECT * FROM userflights WHERE id = ?',
        [booking.id]
      );
      bookingResponse = updatedBooking[0];
    }

    const currentPoints = Number(user.jetPoints || 0);
    const newTotalPoints = Math.max(currentPoints - pointsDeducted, 0);
    const updatedTier = calculateTierForPoints(newTotalPoints);

    if (pointsDeducted > 0 || newTotalPoints !== currentPoints) {
      await pool.execute(
        'UPDATE users SET jetPoints = ?, tierLevel = ? WHERE id = ?',
        [newTotalPoints, updatedTier, targetUserId]
      );
    }

    res.json({
      data: {
        booking: bookingResponse,
        pointsDeducted,
        totalJetPoints: newTotalPoints,
        tierLevel: updatedTier,
      },
      message: 'Flight booking updated successfully',
    });
  } catch (error) {
    console.error('Remove user flight error:', error);
    res.status(500).json({ data: null, message: error.message });
  }
});

// ==================== REVIEW ENDPOINTS ====================

// GET/POST /api/Review/get-all-reviews
app.get('/api/Review/get-all-reviews', async (req, res) => {
  try {
    const [reviews] = await pool.execute(
      'SELECT * FROM reviews ORDER BY createdAt DESC LIMIT 50'
    );
    res.json({ data: reviews, message: 'Success' });
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({ data: null, message: error.message });
  }
});

app.post('/api/Review/get-all-reviews', async (req, res) => {
  try {
    const [reviews] = await pool.execute(
      'SELECT * FROM reviews ORDER BY createdAt DESC LIMIT 50'
    );
    res.json({ data: reviews, message: 'Success' });
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({ data: null, message: error.message });
  }
});

// POST /api/Review/add-review
app.post('/api/Review/add-review', authenticateToken, async (req, res) => {
  try {
    const { userid, userMessage, stars, username } = req.body;
    const userId = userid || req.user.userId;

    const [result] = await pool.execute(
      'INSERT INTO reviews (userid, username, userMessage, stars) VALUES (?, ?, ?, ?)',
      [userId, username || 'Anonymous', userMessage, stars || 5]
    );

    const [newReview] = await pool.execute(
      'SELECT * FROM reviews WHERE id = ?',
      [result.insertId]
    );

    res.json({ data: newReview[0], message: 'Review added successfully' });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ data: null, message: error.message });
  }
});

// ==================== ADMIN ENDPOINTS ====================

// GET /api/flights - Admin endpoint to get all flights (alternative format)
app.get('/api/flights', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    const [users] = await pool.execute('SELECT isAdmin FROM users WHERE id = ?', [req.user.userId]);
    if (users.length === 0 || !users[0].isAdmin) {
      return res.status(403).json({ data: null, message: 'Admin access required' });
    }

    const [flights] = await pool.execute('SELECT * FROM flights');
    const formattedFlights = flights.map(flight => formatFlight(flight));
    res.json(formattedFlights);
  } catch (error) {
    console.error('Get flights error:', error);
    res.status(500).json({ data: null, message: error.message });
  }
});

// POST /api/Admin/upload-image - Admin endpoint to upload flight image
app.post('/api/Admin/upload-image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    // Check if user is admin
    const [users] = await pool.execute('SELECT isAdmin FROM users WHERE id = ?', [req.user.userId]);
    if (users.length === 0 || !users[0].isAdmin) {
      return res.status(403).json({ data: null, message: 'Admin access required' });
    }

    if (!req.file) {
      return res.status(400).json({ data: null, message: 'No file uploaded' });
    }

    // Return the file path (relative to the uploads directory)
    // File is saved in uploads/flights, so path should be /uploads/flights/filename
    const imagePath = `/uploads/flights/${req.file.filename}`;
    res.json({ data: imagePath, message: 'Image uploaded successfully' });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ data: null, message: error.message });
  }
});

// POST /api/flights - Admin endpoint to add a new flight
app.post('/api/flights', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    const [users] = await pool.execute('SELECT isAdmin FROM users WHERE id = ?', [req.user.userId]);
    if (users.length === 0 || !users[0].isAdmin) {
      return res.status(403).json({ data: null, message: 'Admin access required' });
    }

    const {
      arrivalLocation,
      departureLocation,
      continent,
      roundTrip,
      price,
      imgsrc,
      flightType,
      departureDateTime,
      arrivalDateTime,
      returnDepartureDateTime,
      returnArrivalDateTime,
      airlineName,
      co2ReductionPercent
    } = req.body;
    
    // Generate flightId
    const generateFlightId = (location) => {
      return `JET-${location.substring(0, 3).toUpperCase()}-${Date.now()}`;
    };

    const flightId = generateFlightId(arrivalLocation || 'FLT');
    const defaultDeparture = departureLocation || 'Beirut';
    const defaultRoundTrip = roundTrip || 'Round Trip';
    const defaultFlightType = flightType || 'Economy';
    const defaultDepartureDate = departureDateTime || new Date();
    const defaultArrivalDate = arrivalDateTime || new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 hours later

    const [result] = await pool.execute(
      `INSERT INTO flights 
      (arrivalLocation, departureLocation, continent, roundTrip, price, imgsrc, flightType, departureDateTime, arrivalDateTime, returnDepartureDateTime, returnArrivalDateTime, airlineName, co2ReductionPercent, flightId) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        arrivalLocation,
        defaultDeparture,
        continent,
        defaultRoundTrip,
        price,
        imgsrc,
        defaultFlightType,
        defaultDepartureDate,
        defaultArrivalDate,
        returnDepartureDateTime || null,
        returnArrivalDateTime || null,
        airlineName || null,
        co2ReductionPercent || 0,
        flightId
      ]
    );

    const [newFlight] = await pool.execute('SELECT * FROM flights WHERE id = ?', [result.insertId]);
    res.json(formatFlight(newFlight[0]));
  } catch (error) {
    console.error('Add flight error:', error);
    res.status(500).json({ data: null, message: error.message });
  }
});

// DELETE /api/flights/:id - Admin endpoint to delete a flight
app.delete('/api/flights/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    const [users] = await pool.execute('SELECT isAdmin FROM users WHERE id = ?', [req.user.userId]);
    if (users.length === 0 || !users[0].isAdmin) {
      return res.status(403).json({ data: null, message: 'Admin access required' });
    }

    const flightId = req.params.id;
    
    // Try to find by flightId first, then by id
    let [flights] = await pool.execute('SELECT id FROM flights WHERE flightId = ? OR id = ?', [flightId, flightId]);
    
    if (flights.length === 0) {
      return res.status(404).json({ data: null, message: 'Flight not found' });
    }

    await pool.execute('DELETE FROM flights WHERE id = ?', [flights[0].id]);
    res.json({ data: 'Flight deleted successfully', message: 'Success' });
  } catch (error) {
    console.error('Delete flight error:', error);
    res.status(500).json({ data: null, message: error.message });
  }
});

// ==================== SUPPORT MESSAGES ENDPOINTS ====================

// POST /api/Support/add-message - Public endpoint to submit support message
app.post('/api/Support/add-message', async (req, res) => {
  try {
    const { email, phone, message, userId } = req.body;

    if (!email || !message) {
      return res.status(400).json({ data: null, message: 'Email and message are required' });
    }

    const [result] = await pool.execute(
      'INSERT INTO support_messages (email, phone, message, userId) VALUES (?, ?, ?, ?)',
      [email.toLowerCase(), phone || null, message, userId || null]
    );

    const [newMessage] = await pool.execute('SELECT * FROM support_messages WHERE id = ?', [result.insertId]);
    res.json({ data: newMessage[0], message: 'Support message submitted successfully' });
  } catch (error) {
    console.error('Add support message error:', error);
    res.status(500).json({ data: null, message: error.message });
  }
});

// GET /api/Support/get-all-messages - Admin endpoint to get all support messages
app.get('/api/Support/get-all-messages', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    const [users] = await pool.execute('SELECT isAdmin FROM users WHERE id = ?', [req.user.userId]);
    if (users.length === 0 || !users[0].isAdmin) {
      return res.status(403).json({ data: null, message: 'Admin access required' });
    }

    const [messages] = await pool.execute(
      'SELECT sm.*, u.username, u.email as userEmail FROM support_messages sm LEFT JOIN users u ON sm.userId = u.id ORDER BY sm.createdAt DESC'
    );
    res.json({ data: messages, message: 'Success' });
  } catch (error) {
    console.error('Get support messages error:', error);
    res.status(500).json({ data: null, message: error.message });
  }
});

// POST /api/Support/update-message - Admin endpoint to update message status
app.post('/api/Support/update-message', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    const [users] = await pool.execute('SELECT isAdmin FROM users WHERE id = ?', [req.user.userId]);
    if (users.length === 0 || !users[0].isAdmin) {
      return res.status(403).json({ data: null, message: 'Admin access required' });
    }

    const { messageId, status, adminNotes } = req.body;

    if (!messageId) {
      return res.status(400).json({ data: null, message: 'Message ID is required' });
    }

    const updates = [];
    const values = [];

    if (status) {
      updates.push('status = ?');
      values.push(status);
    }
    if (adminNotes !== undefined) {
      updates.push('adminNotes = ?');
      values.push(adminNotes);
    }

    if (updates.length === 0) {
      return res.status(400).json({ data: null, message: 'No fields to update' });
    }

    values.push(messageId);

    await pool.execute(
      `UPDATE support_messages SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const [updatedMessage] = await pool.execute(
      'SELECT sm.*, u.username, u.email as userEmail FROM support_messages sm LEFT JOIN users u ON sm.userId = u.id WHERE sm.id = ?',
      [messageId]
    );

    res.json({ data: updatedMessage[0], message: 'Message updated successfully' });
  } catch (error) {
    console.error('Update support message error:', error);
    res.status(500).json({ data: null, message: error.message });
  }
});

// DELETE /api/Support/delete-message/:id - Admin endpoint to delete a message
app.delete('/api/Support/delete-message/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    const [users] = await pool.execute('SELECT isAdmin FROM users WHERE id = ?', [req.user.userId]);
    if (users.length === 0 || !users[0].isAdmin) {
      return res.status(403).json({ data: null, message: 'Admin access required' });
    }

    const messageId = req.params.id;
    await pool.execute('DELETE FROM support_messages WHERE id = ?', [messageId]);
    res.json({ data: 'Message deleted successfully', message: 'Success' });
  } catch (error) {
    console.error('Delete support message error:', error);
    res.status(500).json({ data: null, message: error.message });
  }
});

// ==================== USER MANAGEMENT ENDPOINTS (ADMIN) ====================

// GET /api/Admin/get-all-users - Admin endpoint to get all users
app.get('/api/Admin/get-all-users', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    const [users] = await pool.execute('SELECT isAdmin FROM users WHERE id = ?', [req.user.userId]);
    if (users.length === 0 || !users[0].isAdmin) {
      return res.status(403).json({ data: null, message: 'Admin access required' });
    }

    const [allUsers] = await pool.execute(
      `SELECT id, username, email, firstName, lastName, isAdmin, flightsBookNumber, flightsDoneNumber,
       flightsCanceledNumber, flightPrice, jetPoints, tierLevel, loyaltyJoinDate, createdAt, updatedAt
       FROM users ORDER BY createdAt DESC`
    );
    
    const formattedUsers = allUsers.map(user => formatUser(user));
    res.json({ data: formattedUsers, message: 'Success' });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ data: null, message: error.message });
  }
});

// POST /api/Admin/create-user - Admin endpoint to create a new user
app.post('/api/Admin/create-user', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    const [users] = await pool.execute('SELECT isAdmin FROM users WHERE id = ?', [req.user.userId]);
    if (users.length === 0 || !users[0].isAdmin) {
      return res.status(403).json({ data: null, message: 'Admin access required' });
    }

    const { email, password, firstName, lastName, isAdmin } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ data: null, message: 'Email, password, first name, and last name are required' });
    }

    // Check if user exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ data: null, message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const loyaltyJoinDate = new Date();
    const defaultTier = 'Silver';
    const defaultJetPoints = 0;
    const adminStatus = Boolean(isAdmin);

    // Create user
    const [result] = await pool.execute(
      'INSERT INTO users (email, password, firstName, lastName, username, jetPoints, tierLevel, loyaltyJoinDate, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        email.toLowerCase(),
        hashedPassword,
        firstName,
        lastName,
        `${firstName} ${lastName}`,
        defaultJetPoints,
        defaultTier,
        loyaltyJoinDate,
        adminStatus
      ]
    );

    const [newUser] = await pool.execute(
      `SELECT id, username, email, firstName, lastName, isAdmin, flightsBookNumber, flightsDoneNumber,
       flightsCanceledNumber, flightPrice, jetPoints, tierLevel, loyaltyJoinDate, createdAt, updatedAt
       FROM users WHERE id = ?`,
      [result.insertId]
    );

    res.status(201).json({ data: formatUser(newUser[0]), message: 'User created successfully' });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ data: null, message: error.message });
  }
});

// POST /api/Admin/update-user-admin - Admin endpoint to toggle user admin status
app.post('/api/Admin/update-user-admin', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    const [users] = await pool.execute('SELECT isAdmin FROM users WHERE id = ?', [req.user.userId]);
    if (users.length === 0 || !users[0].isAdmin) {
      return res.status(403).json({ data: null, message: 'Admin access required' });
    }

    const { userId, isAdmin } = req.body;

    if (!userId || isAdmin === undefined) {
      return res.status(400).json({ data: null, message: 'User ID and admin status are required' });
    }

    // Prevent admin from removing their own admin status
    if (parseInt(userId) === parseInt(req.user.userId)) {
      return res.status(400).json({ data: null, message: 'You cannot change your own admin status' });
    }

    await pool.execute(
      'UPDATE users SET isAdmin = ? WHERE id = ?',
      [Boolean(isAdmin), userId]
    );

    const [updatedUser] = await pool.execute(
      `SELECT id, username, email, firstName, lastName, isAdmin, flightsBookNumber, flightsDoneNumber,
       flightsCanceledNumber, flightPrice, jetPoints, tierLevel, loyaltyJoinDate, createdAt, updatedAt
       FROM users WHERE id = ?`,
      [userId]
    );

    if (updatedUser.length === 0) {
      return res.status(404).json({ data: null, message: 'User not found' });
    }

    res.json({ data: formatUser(updatedUser[0]), message: 'User admin status updated successfully' });
  } catch (error) {
    console.error('Update user admin error:', error);
    res.status(500).json({ data: null, message: error.message });
  }
});

// DELETE /api/Admin/delete-user/:id - Admin endpoint to delete a user
app.delete('/api/Admin/delete-user/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    const [users] = await pool.execute('SELECT isAdmin FROM users WHERE id = ?', [req.user.userId]);
    if (users.length === 0 || !users[0].isAdmin) {
      return res.status(403).json({ data: null, message: 'Admin access required' });
    }

    const userId = req.params.id;

    // Prevent admin from deleting themselves
    if (parseInt(userId) === parseInt(req.user.userId)) {
      return res.status(400).json({ data: null, message: 'You cannot delete your own account' });
    }

    const [userToDelete] = await pool.execute('SELECT id FROM users WHERE id = ?', [userId]);

    if (userToDelete.length === 0) {
      return res.status(404).json({ data: null, message: 'User not found' });
    }

    await pool.execute('DELETE FROM users WHERE id = ?', [userId]);
    res.json({ data: 'User deleted successfully', message: 'Success' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ data: null, message: error.message });
  }
});

// ==================== LOCATION ENDPOINTS ====================

// GET /api/location/get-all-locations
// Extract unique locations directly from flights table
app.get('/api/location/get-all-locations', async (req, res) => {
  try {
    // Get unique arrival locations from flights
    const [flights] = await pool.execute('SELECT DISTINCT arrivalLocation, continent FROM flights WHERE arrivalLocation IS NOT NULL AND arrivalLocation != ""');
    
    // Format as location objects for compatibility with frontend
    const locations = flights.map((flight, index) => ({
      id: index + 1,
      name: flight.arrivalLocation,
      locationName: flight.arrivalLocation,
      continent: flight.continent || 'Unknown',
      country: flight.arrivalLocation, // Use arrivalLocation as country fallback
      description: null,
      imageUrl: null
    }));
    // Get unique departure locations from flights table
app.get('/api/location/get-all-departures', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT DISTINCT departureLocation
      FROM flights
      WHERE departureLocation IS NOT NULL
        AND departureLocation != ''
    `);

    res.json({
      data: rows.map(r => r.departureLocation),
      message: 'Success'
    });
  } catch (error) {
    console.error('Get all departures error:', error);
    res.status(500).json({ data: null, message: error.message });
  }
});


    res.json({ data: locations, message: 'Success' });
  } catch (error) {
    console.error('Get all locations error:', error);
    res.status(500).json({ data: null, message: error.message });
  }
});


// ==================== CHATBOT ENDPOINT ====================

app.post('/api/chatbot/query', async (req, res) => {
  try {
    const { message, flights } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // Extract unique locations from flights for context
    const uniqueLocations = flights ? [...new Set(flights.map(f => f.arrivalLocation).filter(Boolean))] : [];
    const locationNames = uniqueLocations.length > 0 
      ? uniqueLocations.join(', ') 
      : 'Beirut, Paris, London, New York, Dubai, Istanbul, Cairo, Rome, Madrid, Berlin';

    // Get available flights summary for context
    const flightsSummary = flights?.slice(0, 10).map(f => 
      `${f.departureLocation} to ${f.arrivalLocation} - $${f.price}`
    ).join('; ') || 'No flights available';

    // Create a prompt for OpenAI to extract flight search parameters
    const systemPrompt = `You are a helpful flight booking assistant. Your job is to:
1. Understand user queries about flights
2. Extract flight search parameters: departure location, arrival location, date, budget, trip type
3. Respond naturally and helpfully

Available locations: ${locationNames}
All flights depart from Beirut by default.

When a user asks about flights, extract:
- destination/arrival location (from the query or available locations)
- budget/max price (if mentioned)
- trip type: "Round Trip" or "One way" (if mentioned)
- date (if mentioned, otherwise use today's date: ${new Date().toISOString().split('T')[0]})

Respond in a friendly, conversational way. If you find flights, mention the key details.`;

    const userPrompt = `User query: "${message}"

Available flights sample: ${flightsSummary}

Extract the flight search parameters and provide a helpful response. If the user is asking to find flights, search for matching flights from the available flights list.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const aiResponse = completion.choices[0].message.content;

    // Extract search parameters from the query using simple pattern matching
    const searchParams = {
      destination: null,
      date: new Date().toISOString().split('T')[0],
      budget: null,
      tripType: null,
    };

    // Extract destination
    const destinationMatch = message.match(/to\s+([A-Za-z\s]+)|from\s+[A-Za-z\s]+\s+to\s+([A-Za-z\s]+)/i);
    if (destinationMatch && flights) {
      const dest = (destinationMatch[1] || destinationMatch[2])?.trim();
      // Match with available flight destinations
      const matchedLocation = flights.find(flight => {
        const locName = (flight.arrivalLocation || '').toLowerCase();
        return locName.includes(dest.toLowerCase()) || dest.toLowerCase().includes(locName);
      });
      if (matchedLocation) {
        searchParams.destination = matchedLocation.arrivalLocation;
      }
    }

    // Extract budget
    const budgetMatch = message.match(/(?:under|below|less than|max|maximum|budget|price)\s*\$?(\d+)/i);
    if (budgetMatch) {
      searchParams.budget = budgetMatch[1];
    }

    // Extract trip type
    if (message.toLowerCase().includes('round trip') || message.toLowerCase().includes('return')) {
      searchParams.tripType = 'Round Trip';
    } else if (message.toLowerCase().includes('one way') || message.toLowerCase().includes('one-way')) {
      searchParams.tripType = 'One way';
    }

    // Search for matching flights
    let matchingFlights = [];
    if (flights && searchParams.destination) {
      matchingFlights = flights.filter(flight => {
        const matchesDestination = flight.arrivalLocation?.toLowerCase() === searchParams.destination?.toLowerCase();
        const matchesBudget = !searchParams.budget || flight.price <= Number(searchParams.budget);
        const matchesTripType = !searchParams.tripType || 
          (searchParams.tripType === 'Round Trip' && flight.roundTrip?.toLowerCase().includes('round')) ||
          (searchParams.tripType === 'One way' && !flight.roundTrip?.toLowerCase().includes('round'));
        
        return matchesDestination && matchesBudget && matchesTripType;
      });

      // Sort by price if user asked for cheapest
      if (message.toLowerCase().includes('cheapest') || message.toLowerCase().includes('cheap')) {
        matchingFlights.sort((a, b) => (a.price || 0) - (b.price || 0));
      }
    }

    // Format response
    let responseMessage = aiResponse;
    if (matchingFlights.length > 0) {
      const cheapest = matchingFlights[0];
      responseMessage += `\n\nI found ${matchingFlights.length} flight(s) matching your criteria. The cheapest option is ${cheapest.departureLocation} to ${cheapest.arrivalLocation} for $${cheapest.price} (${cheapest.roundTrip}). I've prepared the search results for you - check your dashboard!`;
    } else if (searchParams.destination) {
      responseMessage += `\n\nI couldn't find any flights matching your exact criteria. Would you like to search with different parameters?`;
    }

    res.json({
      success: true,
      message: responseMessage,
      flights: matchingFlights.slice(0, 5), // Return top 5 results
      searchParams: matchingFlights.length > 0 ? searchParams : null,
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'I apologize, but I encountered an error processing your request. Please try again.',
    });
  }
});

// ==================== START SERVER ====================

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`API endpoints available at http://localhost:${port}/api`);
});


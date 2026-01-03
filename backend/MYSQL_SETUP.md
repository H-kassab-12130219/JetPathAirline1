# MySQL Setup Guide for XAMPP/MAMP

This guide will help you set up the MySQL database for the Airlines MEA project using XAMPP or MAMP.

## Quick Setup Steps

### 1. Start Your Server

**XAMPP:**
- Open XAMPP Control Panel
- Click "Start" for Apache and MySQL
- phpMyAdmin will be available at: `http://localhost/phpmyadmin`

**MAMP:**
- Open MAMP
- Click "Start Servers" for Apache and MySQL
- phpMyAdmin will be available at: `http://localhost:8888/phpMyAdmin`

### 2. Create Database

**Option A: Import SQL File (Recommended)**
1. Open phpMyAdmin in your browser
2. Click on "Import" tab
3. Click "Choose File" and select `backend/init_database.sql`
4. Click "Go" to import
5. The database `airlinesmea` and all tables will be created automatically

**Option B: Manual Creation**
1. In phpMyAdmin, click "New" in the left sidebar
2. Enter database name: `airlinesmea`
3. Choose collation: `utf8mb4_unicode_ci`
4. Click "Create"
5. Select the `airlinesmea` database
6. Click on "SQL" tab
7. Copy and paste the contents of `backend/init_database.sql`
8. Click "Go"

### 3. Configure Backend

Create a `.env` file in the `backend` directory:

**For XAMPP (default settings):**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=airlinesmea
PORT=3001
JWT_SECRET=your-secret-key-change-in-production
```

**For MAMP (default settings):**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=airlinesmea
PORT=3001
JWT_SECRET=your-secret-key-change-in-production
```

**Note:** If you've changed the MySQL root password, update `DB_PASSWORD` accordingly.

### 4. Install Dependencies

```bash
cd backend
npm install
```

### 5. Seed Sample Data (Optional)

```bash
node seedData.js
```

This will populate the database with sample flight data.

### 6. Start Backend Server

```bash
npm start
# or for development:
npm run dev
```

## Database Tables

The following tables will be created:

- **users** - User accounts and profiles
- **flights** - Available flights
- **userflights** - User flight bookings
- **reviews** - User reviews
- **locations** - Destination locations

## Troubleshooting

### Connection Error: "Access denied for user 'root'@'localhost'"

**XAMPP:**
- Default user is `root` with no password
- If you set a password, update `DB_PASSWORD` in `.env`

**MAMP:**
- Default user is `root` with password `root`
- Check MAMP preferences if password is different

### Database doesn't exist

- Make sure you've imported `init_database.sql` or created the database manually
- Verify database name matches `DB_NAME` in `.env`

### Tables not found

- Run the SQL script from `init_database.sql` in phpMyAdmin
- Make sure you're using the correct database (`airlinesmea`)

### Port already in use

- Change `PORT` in `.env` to a different port (e.g., 3002)
- Or stop the service using port 3001

## Managing Data with phpMyAdmin

You can use phpMyAdmin to:
- View all tables and data
- Run SQL queries
- Export/import data
- Manage users and permissions
- View table structure

## Default Credentials

**XAMPP:**
- MySQL User: `root`
- MySQL Password: (empty)
- phpMyAdmin: `http://localhost/phpmyadmin`

**MAMP:**
- MySQL User: `root`
- MySQL Password: `root` (check MAMP preferences)
- phpMyAdmin: `http://localhost:8888/phpMyAdmin`

## Next Steps

After setting up the database:
1. Start the backend server (`npm start`)
2. Start the frontend server (`cd frontend && npm run dev`)
3. Open `http://localhost:5173` in your browser
4. Register a new user and start booking flights!


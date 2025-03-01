import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "quicklift"
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('✅ Connected to MySQL database');
  }
});

// Helper function to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, "your_secret_key", (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = decoded; // Store decoded info for further use
    next();
  });
};

// User Registration (for both users and riders)
app.post('/api/register', async (req, res) => {
  const { name, email, password, role, car_number, car_details } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
  const values = [name, email, hashedPassword, role];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    // If the role is 'rider', insert into the riders table
    if (role === 'rider') {
      const userId = result.insertId; // Get the ID of the newly created user
      const riderSql = "INSERT INTO riders (user_id, car_number, car_details) VALUES (?, ?, ?)";
      const riderValues = [userId, car_number, car_details];

      db.query(riderSql, riderValues, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database error while registering rider' });
        }
      });
    }

    // Generate JWT token
    const token = jwt.sign({ user_id: result.insertId, email }, "your_secret_key", { expiresIn: '1h' });

    res.status(201).json({ message: "User registered successfully", token });
  });
});

// User Login (for both users and riders)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ user_id: user.id, email }, "your_secret_key", { expiresIn: '1h' });

    res.status(200).json({ message: "Login successful", token, user });
  });
});

// Create Ride Request (For users to request rides)
app.post('/api/ride-request', verifyToken, (req, res) => {
  const { pickup_location, dropoff_location } = req.body;
  const user_id = req.user.user_id;

  const sql = "INSERT INTO ride_requests (user_id, pickup_location, dropoff_location) VALUES (?, ?, ?)";
  const values = [user_id, pickup_location, dropoff_location];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error while creating ride request' });
    }

    res.status(201).json({ message: "Ride request created successfully", requestId: result.insertId });
  });
});

// Assign Rider to Ride Request
app.post('/api/assign-ride', verifyToken, (req, res) => {
  const { request_id, rider_id } = req.body;

  const sql = "SELECT * FROM ride_requests WHERE id = ?";
  db.query(sql, [request_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Ride request not found' });
    }

    // Check if the rider is available
    const availabilitySql = "SELECT availability FROM riders WHERE id = ?";
    db.query(availabilitySql, [rider_id], (err, riderResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error checking rider availability' });
      }

      if (riderResult.length === 0 || riderResult[0].availability === 'Unavailable') {
        return res.status(400).json({ error: 'Rider is unavailable' });
      }

      // Assign the rider to the request
      const assignSql = "INSERT INTO ride_assignments (request_id, rider_id) VALUES (?, ?)";
      const values = [request_id, rider_id];

      db.query(assignSql, values, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error assigning rider' });
        }

        res.status(200).json({ message: 'Rider assigned successfully' });
      });
    });
  });
});

// View Rider Details
app.get('/api/rider-details', verifyToken, (req, res) => {
  const sql = "SELECT * FROM rider_details WHERE rider_id = ?";
  db.query(sql, [req.user.user_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error fetching rider details' });
    }

    res.status(200).json(result);
  });
});



// Add this endpoint to your existing code
app.get('/api/profile', (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, "your_secret_key", (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }

        const sql = "SELECT * FROM users WHERE email = ?";
        db.query(sql, [decoded.email], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (result.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            const user = result[0];

            // If the user is a rider, fetch additional rider information
            if (user.role === 'rider') {
                const riderSql = "SELECT * FROM riders WHERE user_id = ?";
                db.query(riderSql, [user.id], (err, riderResult) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: 'Database error' });
                    }

                    // Combine user and rider information
                    const riderInfo = riderResult.length > 0 ? riderResult[0] : {};
                    res.json({ ...user, ...riderInfo }); // Return combined user and rider data
                });
            } else {
                res.json(user); // Return user data for non-riders
            }
        });
    });
});



app.listen(8000, () => {
    console.log("Server running on port 8000");
});

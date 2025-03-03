// routes/userRoutes.js
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();

// Register user (for both riders and users)
router.post('/register', async (req, res) => {
  const { name, email, password, role, car_number, car_details } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    const values = [name, email, hashedPassword, role];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (role === 'rider') {
        const userId = result.insertId;
        const riderSql = "INSERT INTO riders (user_id, car_number, car_details) VALUES (?, ?, ?)";
        const riderValues = [userId, car_number, car_details];

        db.query(riderSql, riderValues, (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error registering rider' });
          }
        });
      }

      const token = jwt.sign({ user_id: result.insertId, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(201).json({ message: "User registered successfully", token });
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Login user
router.post('/login', (req, res) => {
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

    const token = jwt.sign({ user_id: user.id, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: "Login successful", token, user });
  });
});

// Verify JWT
router.use((req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
});

// Get user profile
router.get('/profile', (req, res) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [req.user.email], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (result.length === 0) return res.status(404).json({ error: 'User not found' });

    const user = result[0];

    if (user.role === 'rider') {
      const riderSql = "SELECT * FROM riders WHERE user_id = ?";
      db.query(riderSql, [user.id], (err, riderResult) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        const riderInfo = riderResult.length > 0 ? riderResult[0] : {};
        res.json({ ...user, ...riderInfo });
      });
    } else {
      res.json(user);
    }
  });
});


// Update User Profile
router.put('/profile', async (req, res) => {
  const { name, email, password, car_number, car_details } = req.body;
  const user_id = req.user.user_id;

  try {
    // Check if the user exists
    const sql = "SELECT * FROM users WHERE id = ?";
    db.query(sql, [user_id], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (result.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      let updateSql = "UPDATE users SET name = ?, email = ? WHERE id = ?";
      let updateValues = [name, email, user_id];

      // If the user is updating their password
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updateSql = "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?";
        updateValues = [name, email, hashedPassword, user_id];
      }

      // Update user information
      db.query(updateSql, updateValues, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error updating user profile' });
        }

        // If the user is a rider, update the rider's details
        if (result[0].role === 'rider') {
          const riderSql = "UPDATE riders SET car_number = ?, car_details = ? WHERE user_id = ?";
          const riderValues = [car_number, car_details, user_id];

          db.query(riderSql, riderValues, (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Error updating rider details' });
            }
          });
        }

        res.status(200).json({ message: 'Profile updated successfully' });
      });
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

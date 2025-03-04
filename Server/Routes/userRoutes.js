import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();

// Register Route
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
        return res.status(500).json({ success: false, error: 'Database error' });
      }

      // If the user is a rider, save the rider's details
      if (role === 'rider') {
        const userId = result.insertId;
        const riderSql = "INSERT INTO riders (user_id, car_number, car_details) VALUES (?, ?, ?)";
        const riderValues = [userId, car_number, car_details];

        db.query(riderSql, riderValues, (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ success: false, error: 'Database error while registering rider' });
          }
        });
      }

      const token = jwt.sign({ userId: result.insertId, email }, "your_secret_key", { expiresIn: '1h' });
      res.status(201).json({ success: true, message: "User registered successfully", token });
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: 'Database error' });
    }

    if (result.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, email }, "your_secret_key", { expiresIn: '1h' });
    res.status(200).json({ success: true, message: "Login successful", token, user });
  });
});

// Fetch User Profile Route
router.get('/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ success: false, error: 'Token required' });
  }

  try {
    const decoded = jwt.verify(token, "your_secret_key");
    const userId = decoded.userId;

    // Query for the user data
    const sql = "SELECT * FROM users WHERE id = ?";
    db.query(sql, [userId], (err, userResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: 'Database error' });
      }

      if (userResult.length === 0) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      const user = userResult[0];
      if (user.role === 'rider') {
        // If the user is a rider, get the rider's additional details
        const riderSql = "SELECT * FROM riders WHERE user_id = ?";
        db.query(riderSql, [userId], (err, riderResult) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ success: false, error: 'Database error' });
          }

          user.car_number = riderResult[0]?.car_number || null;
          user.car_details = riderResult[0]?.car_details || null;
          res.status(200).json({ success: true, user });
        });
      } else {
        res.status(200).json({ success: true, user });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
});

// Update User Profile Route
router.put('/profile', async (req, res) => {
  const { name, email, password, car_number, car_details } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Token required' });
  }

  try {
    const decoded = jwt.verify(token, "your_secret_key");
    const userId = decoded.userId;

    // Check if the user exists
    const sql = "SELECT * FROM users WHERE id = ?";
    db.query(sql, [userId], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: 'Database error' });
      }

      if (result.length === 0) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      let updateSql = "UPDATE users SET name = ?, email = ? WHERE id = ?";
      let updateValues = [name, email, userId];

      // If the user is updating their password
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updateSql = "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?";
        updateValues = [name, email, hashedPassword, userId];
      }

      // Update user information
      db.query(updateSql, updateValues, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ success: false, error: 'Error updating user profile' });
        }

        // If the user is a rider, update the rider's details
        if (result[0].role === 'rider') {
          const riderSql = "UPDATE riders SET car_number = ?, car_details = ? WHERE user_id = ?";
          const riderValues = [car_number, car_details, userId];

          db.query(riderSql, riderValues, (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ success: false, error: 'Error updating rider details' });
            }

            // Fetch updated user data
            const updatedUserSql = "SELECT * FROM users WHERE id = ?";
            db.query(updatedUserSql, [userId], (err, updatedUserResult) => {
              if (err) {
                console.error(err);
                return res.status(500).json({ success: false, error: 'Database error' });
              }

              const updatedUser = updatedUserResult[0];

              // Fetch updated rider details
              const updatedRiderSql = "SELECT * FROM riders WHERE user_id = ?";
              db.query(updatedRiderSql, [userId], (err, updatedRiderResult) => {
                if (err) {
                  console.error(err);
                  return res.status(500).json({ success: false, error: 'Database error' });
                }

                updatedUser.car_number = updatedRiderResult[0]?.car_number || null;
                updatedUser.car_details = updatedRiderResult[0]?.car_details || null;

                // Return updated user data
                res.status(200).json({ success: true, message: 'Profile updated successfully', user: updatedUser });
              });
            });
          });
        } else {
          // Fetch updated user data
          const updatedUserSql = "SELECT * FROM users WHERE id = ?";
          db.query(updatedUserSql, [userId], (err, updatedUserResult) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ success: false, error: 'Database error' });
            }

            const updatedUser = updatedUserResult[0];
            res.status(200).json({ success: true, message: 'Profile updated successfully', user: updatedUser });
          });
        }
      });
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
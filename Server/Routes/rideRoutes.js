import express from 'express';
import db from '../db.js';

const router = express.Router();

// Create Ride Request
router.post('/ride-request', (req, res) => {
  const { pickup_location, dropoff_location } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }

  try {
    const decoded = jwt.verify(token, "your_secret_key");
    const userId = decoded.userId;

    const sql = "INSERT INTO ride_requests (user_id, pickup_location, dropoff_location) VALUES (?, ?, ?)";
    const values = [userId, pickup_location, dropoff_location];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error creating ride request' });
      }

      res.status(201).json({ message: "Ride request created successfully", requestId: result.insertId });
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// Assign Rider to Ride Request
router.post('/assign-ride', (req, res) => {
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

    const availabilitySql = "SELECT availability FROM riders WHERE id = ?";
    db.query(availabilitySql, [rider_id], (err, riderResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error checking rider availability' });
      }

      if (riderResult.length === 0 || riderResult[0].availability === 'Unavailable') {
        return res.status(400).json({ error: 'Rider is unavailable' });
      }

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

export default router;
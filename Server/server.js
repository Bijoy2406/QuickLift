import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test"
});

db.connect(err => {
  if (err) return console.error('Database connection failed:', err);
  console.log('Connected to the database');
});

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Register user
app.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', 
  [name, email, hashedPassword, role], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error registering user' });
    db.query('SELECT id, name, email, role FROM users WHERE id = ?', [result.insertId], (err, userResult) => {
      if (err) return res.status(500).json({ error: 'Error fetching user details' });
      res.status(201).json({ message: 'User registered', user: userResult[0] });
    });
  });
});

// Login user
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });
});

// Get profile (only logged-in user)
app.get('/api/profile', authenticateToken, (req, res) => {
  db.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [req.user.userId], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(results[0]);
  });
});

// Get only logged-in users
app.get('/api/users/loggedin', authenticateToken, (req, res) => {
  db.query('SELECT * FROM user_sessions WHERE logout_time IS NULL', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error fetching logged-in users' });
    res.json(results);
  });
});

// Get only logged-out users
app.get('/api/users/loggedout', authenticateToken, (req, res) => {
  db.query('SELECT * FROM user_sessions WHERE logout_time IS NOT NULL', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error fetching logged-out users' });
    res.json(results);
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

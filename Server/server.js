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
    database: "test" // Add your database name here
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

app.post('/register', async (req, res) => {
  const { name, email, password, role, car_number, car_details, preferred_location } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO users (name, email, password, role, car_number, car_details, preferred_location) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [name, email, hashedPassword, role, car_number, car_details, preferred_location], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error registering user' });
    } else {
      res.status(201).json({ message: 'User registered successfully' });
    }
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error logging in' });
    } else if (results.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
    } else {
      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    }
  });
});


app.get('/api/profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, "your_secret_key");
    const query = "SELECT id, name, email FROM users WHERE email = ?";

    db.query(query, [decoded.email], (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(results[0]);
    });

  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

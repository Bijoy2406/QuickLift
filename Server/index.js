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
    password: "zinku;sempire08214",
    database: "quicklift"
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('✅ Connected to MySQL database');
    }
});

// Middleware for authentication
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, "your_secret_key", (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
};

// Register User
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

        if (role === 'rider') {
            const userId = result.insertId;
            const riderSql = "INSERT INTO riders (user_id, car_number, car_details) VALUES (?, ?, ?)";
            const riderValues = [userId, car_number, car_details];

            db.query(riderSql, riderValues, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Database error while registering rider' });
                }
            });
        }

        const token = jwt.sign({ email }, "your_secret_key", { expiresIn: '1h' });

        db.query("SELECT * FROM users WHERE email = ?", [email], (err, userResult) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }

            console.log("User registered successfully:", userResult);
            res.status(201).json({ message: "User registered successfully", token });
        });
    });
});

// Login User
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

        const token = jwt.sign({ email }, "your_secret_key", { expiresIn: '1h' });

        res.status(200).json({ message: "Login successful", token, user });
    });
});

// ✏️ Update user profile
app.put('/api/profile', authenticateToken, async (req, res) => {
    const { name, password, role, car_number, car_details } = req.body;
    const email = req.user.email;

    console.log("🔄 Updating profile for:", email);
    console.log("Received data:", req.body);

    let updateUserSQL = "UPDATE users SET name = ? WHERE email = ?";
    let values = [name, email];

    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateUserSQL = "UPDATE users SET name = ?, password = ? WHERE email = ?";
        values = [name, hashedPassword, email];
    }

    db.query(updateUserSQL, values, (err, result) => {
        if (err) {
            console.error("❌ Error updating user:", err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (role === 'rider') {
            db.query("SELECT id FROM users WHERE email = ?", [email], (err, userResult) => {
                if (err || userResult.length === 0) {
                    console.error("❌ Error fetching user ID:", err);
                    return res.status(500).json({ error: 'User retrieval failed' });
                }

                const userId = userResult[0].id;
                const updateRiderSQL = "UPDATE riders SET car_number = ?, car_details = ? WHERE user_id = ?";
                db.query(updateRiderSQL, [car_number, car_details, userId], (err) => {
                    if (err) {
                        console.error("❌ Error updating rider details:", err);
                        return res.status(500).json({ error: 'Error updating rider details' });
                    }
                    console.log("✅ Rider profile updated successfully!");
                    res.json({ message: "Profile updated successfully" });
                });
            });
        } else {
            console.log("✅ User profile updated successfully!");
            res.json({ message: "Profile updated successfully" });
        }
    });
});

app.listen(8000, () => {
    console.log("🚀 Server running on port 8000");
});
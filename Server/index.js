import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import db from './db.js';
import userRoutes from './Routes/userRoutes.js'; // Import user routes
import rideRoutes from './routes/rideRoutes.js'; // Import ride routes
import infoRoutes from './Routes/InfoRoute.js'; // Import info routes
import dotenv from 'dotenv';
dotenv.config(); // This loads environment variables from the .env file

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());

// Use async/await for the database connection
async function startServer() {
  try {
    await db.connect(); // Assuming db.connect() returns a promise
    console.log("✅ Database connected successfully");

    // Start the server after the database connection is successful
    app.listen(8000, () => {
      console.log("🚀 Server running on port 8000");
    });
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1); // Exit the process if the database connection fails
  }
}

// Start the server
startServer();

// Use imported routes
app.use('/api', userRoutes); // Use user routes for /api
app.use('/api', rideRoutes); // Use ride routes for /api
app.use('/api', infoRoutes); // Use info routes for /api

// db.js
import mysql from 'mysql2';

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "zinku;sempire08214",  // Replace with your actual password
  database: "quicklift"
});

db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ Connected to MySQL database');
  }
});

export default db;

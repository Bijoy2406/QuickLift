-- Use the QuickLift database
USE quicklift;

-- ================================
-- Table Definitions
-- ================================

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,  -- Ensure this stores hashed passwords
    role ENUM('user', 'rider') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Riders Table
CREATE TABLE riders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    car_number VARCHAR(50) NOT NULL,
    car_details TEXT NOT NULL,
    availability ENUM('Available', 'Unavailable', 'Busy', 'Offline') DEFAULT 'Available',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Ride Requests Table
CREATE TABLE ride_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    pickup_location TEXT NOT NULL,
    dropoff_location TEXT NOT NULL,
    pickup_coords POINT NOT NULL,
    dropoff_coords POINT NOT NULL,
    status ENUM('Pending', 'Accepted', 'Completed', 'Cancelled') DEFAULT 'Pending',
    fare DECIMAL(8,2) AFTER status,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Ride Assignments Table
CREATE TABLE ride_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    rider_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('In Progress', 'Completed', 'Cancelled') DEFAULT 'In Progress',
    FOREIGN KEY (request_id) REFERENCES ride_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (rider_id) REFERENCES riders(id) ON DELETE CASCADE
);

-- Driver Locations Table
CREATE TABLE driver_locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rider_id INT NOT NULL,
    coordinates POINT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rider_id) REFERENCES riders(id)
);

-- User Sessions Table (for login/logout tracking)
CREATE TABLE user_sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logout_time TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index for Faster Queries
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);

-- ================================
-- Views for Quick Data Retrieval
-- ================================

-- Rider Details View
CREATE VIEW rider_details AS
SELECT 
    r.id AS rider_id,
    u.name AS rider_name,
    u.email AS rider_email,
    u.role AS rider_role,
    r.car_number,
    r.car_details,
    r.availability
FROM 
    riders r
JOIN 
    users u ON r.user_id = u.id;

-- Ride History View (User Perspective)
CREATE VIEW ride_history AS
SELECT 
    rr.id AS ride_id,
    u.name AS user_name,
    u.email AS user_email,
    rr.pickup_location,
    rr.dropoff_location,
    rr.status,
    rr.fare,
    rr.requested_at
FROM ride_requests rr
JOIN users u ON rr.user_id = u.id;

-- ================================
-- Sample Data
-- ================================

-- Sample Users (hashed passwords)
INSERT INTO users (name, email, password, role) VALUES 
('John Doe', 'john@example.com', 'hashed_password1', 'user'),
('Jane Smith', 'jane@example.com', 'hashed_password2', 'rider');

-- Sample Riders
INSERT INTO riders (user_id, car_number, car_details) VALUES 
(1, 'ABC123', 'Toyota Camry, 2020'),
(2, 'XYZ789', 'Honda Accord, 2019');

-- Sample User Sessions
INSERT INTO user_sessions (user_id, login_time) VALUES
(1, NOW()),
(2, NOW());

-- ================================
-- Useful Queries
-- ================================

-- View Logged-in Users
SELECT u.id, u.name, u.email, s.login_time
FROM user_sessions s
JOIN users u ON s.user_id = u.id
WHERE s.logout_time IS NULL;

-- View Logged-out Users
SELECT u.id, u.name, u.email, s.login_time, s.logout_time
FROM user_sessions s
JOIN users u ON s.user_id = u.id
WHERE s.logout_time IS NOT NULL;

-- Get All Active Rides with User & Rider Details
SELECT 
    rr.id AS ride_id, 
    u.name AS user_name, 
    u.email AS user_email, 
    r.name AS rider_name,
    rr.pickup_location, 
    rr.dropoff_location, 
    ra.status, 
    rr.fare, 
    rr.requested_at
FROM ride_requests rr
JOIN users u ON rr.user_id = u.id
JOIN ride_assignments ra ON rr.id = ra.request_id
JOIN riders ri ON ra.rider_id = ri.id
JOIN users r ON ri.user_id = r.id
WHERE ra.status = 'In Progress';

-- Get All Available Riders
SELECT u.id AS rider_id, u.name AS rider_name, r.car_number, r.car_details, r.availability
FROM users u
JOIN riders r ON u.id = r.user_id
WHERE r.availability = 'Available';

-- Get Ride Requests for a Specific User
SELECT * FROM ride_requests WHERE user_id = 1;

-- Get Ride Assignments for a Specific Rider
SELECT 
    ra.id AS assignment_id, 
    rr.pickup_location, 
    rr.dropoff_location, 
    rr.fare, 
    ra.status, 
    ra.assigned_at
FROM ride_assignments ra
JOIN ride_requests rr ON ra.request_id = rr.id
WHERE ra.rider_id = 2;

-- ================================
-- Show Table Data
-- ================================
SHOW TABLES;
SELECT * FROM users;
SELECT * FROM riders;
SELECT * FROM ride_requests;
SELECT * FROM ride_assignments;
SELECT * FROM user_sessions;
SELECT * FROM rider_details;
SELECT * FROM ride_history;

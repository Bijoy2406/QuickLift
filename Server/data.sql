
USE quicklift;

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'rider') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Riders Table
CREATE TABLE riders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    car_number VARCHAR(50) NOT NULL,
    car_details TEXT NOT NULL,
    availability ENUM('Available', 'Unavailable') DEFAULT 'Available',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Ride Requests Table
CREATE TABLE ride_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    pickup_location TEXT NOT NULL,
    dropoff_location TEXT NOT NULL,
    status ENUM('Pending', 'Accepted', 'Completed', 'Cancelled') DEFAULT 'Pending',
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

-- User Sessions Table (for login/logout tracking)
CREATE TABLE user_sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logout_time TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Index for Faster Queries on user_sessions
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);

INSERT INTO user_sessions (user_id, login_time, logout_time) 
VALUES 
(1, NOW(), NULL),  -- User 1 logged in, not logged out
(2, NOW(), NOW()); -- User 2 logged in and logged out

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

-- Sample Users
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

SELECT * 
FROM user_sessions 
WHERE logout_time IS NULL;

SELECT * FROM user_sessions;


SELECT * 
FROM user_sessions 
WHERE logout_time IS NULL;


SELECT * 
FROM user_sessions 
WHERE logout_time IS NOT NULL;

SELECT u.id AS user_id, 
       u.name AS user_name, 
       u.email, 
       CASE 
           WHEN s.logout_time IS NULL THEN 'Logged In' 
           ELSE 'Logged Out' 
       END AS session_status
FROM users u
LEFT JOIN user_sessions s ON u.id = s.user_id;
SELECT * FROM riders;
select * from users;
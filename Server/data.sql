CREATE DATABASE quicklift;
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
select * from users;


-- Riders Table
CREATE TABLE riders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    car_number VARCHAR(50) NOT NULL,
    car_details TEXT NOT NULL,
    availability ENUM('Available', 'Unavailable') DEFAULT 'Available',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- Ride Requests Table (For Users Requesting Rides)
CREATE TABLE ride_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    pickup_location TEXT NOT NULL,
    dropoff_location TEXT NOT NULL,
    status ENUM('Pending', 'Accepted', 'Completed', 'Cancelled') DEFAULT 'Pending',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Ride Assignments Table (For Assigning Riders to Requests)
CREATE TABLE ride_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    rider_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('In Progress', 'Completed', 'Cancelled') DEFAULT 'In Progress',
    FOREIGN KEY (request_id) REFERENCES ride_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (rider_id) REFERENCES riders(id) ON DELETE CASCADE
);

-- View all tables
SHOW TABLES;

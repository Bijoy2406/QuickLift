import express from "express";
import db from "../db.js";

const router = express.Router();

// Get all users (including riders)
router.get("/allUsers", async (req, res) => {
    try {
        const sql = `
            SELECT users.id AS user_id, users.name, users.email, users.phone, users.role, 
                   riders.car_number, riders.car_details, riders.availability,
                   payment.payment_method, payment.balance
            FROM users
            LEFT JOIN riders ON users.id = riders.user_id
            LEFT JOIN payment ON users.id = payment.user_id
        `;

        db.query(sql, (error, results) => {
            if (error) return res.status(500).json({ success: false, message: "Server Error", error });
            return res.status(200).json({ success: true, users: results });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error });
    }
});

// Get all active ride requests
router.get("/active-rides", async (req, res) => {
    try {
        const sql = `
            SELECT rr.id AS request_id, u.name AS user_name, u.email AS user_email, 
                   rr.pickup_location, rr.dropoff_location, rr.status, rr.requested_at,
                   r.name AS rider_name, r.email AS rider_email, riders.car_number, 
                   pricing.estimated_fare, pricing.final_fare
            FROM ride_requests rr
            INNER JOIN users u ON rr.user_id = u.id
            LEFT JOIN ride_assignments ra ON rr.id = ra.request_id
            LEFT JOIN riders ON ra.rider_id = riders.id
            LEFT JOIN users r ON riders.user_id = r.id
            LEFT JOIN pricing ON rr.id = pricing.request_id
            WHERE rr.status = 'Pending' OR rr.status = 'Accepted'
        `;

        db.query(sql, (error, results) => {
            if (error) return res.status(500).json({ success: false, message: "Server Error", error });
            return res.status(200).json({ success: true, activeRides: results });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error });
    }
});

// Get ride statistics
router.get("/ride-stats", async (req, res) => {
    try {
        const sql = `
            SELECT COUNT(*) AS total_rides,
                   SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completed_rides,
                   SUM(CASE WHEN status = 'Canceled' THEN 1 ELSE 0 END) AS canceled_rides,
                   SUM(final_fare) AS total_earnings
            FROM ride_requests
            LEFT JOIN pricing ON ride_requests.id = pricing.request_id
        `;

        db.query(sql, (error, results) => {
            if (error) return res.status(500).json({ success: false, message: "Server Error", error });
            return res.status(200).json({ success: true, rideStats: results[0] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error });
    }
});

// Get rider performance
router.get("/rider-performance", async (req, res) => {
    try {
        const sql = `
            SELECT u.id AS rider_id, u.name AS rider_name, COUNT(rr.id) AS total_rides,
                   AVG(feedback.rider_rating) AS avg_rating, SUM(pricing.final_fare) AS total_earnings
            FROM users u
            INNER JOIN riders ON u.id = riders.user_id
            LEFT JOIN ride_assignments ra ON riders.id = ra.rider_id
            LEFT JOIN ride_requests rr ON ra.request_id = rr.id
            LEFT JOIN feedback ON rr.id = feedback.request_id
            LEFT JOIN pricing ON rr.id = pricing.request_id
            WHERE rr.status = 'Completed'
            GROUP BY u.id, u.name
        `;

        db.query(sql, (error, results) => {
            if (error) return res.status(500).json({ success: false, message: "Server Error", error });
            return res.status(200).json({ success: true, riderPerformance: results });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error });
    }
});

// Get user activity tracking
router.get("/user-activity", async (req, res) => {
    try {
        const sql = `
            SELECT u.id AS user_id, u.name AS user_name, COUNT(rr.id) AS total_requests,
                   SUM(CASE WHEN rr.status = 'Completed' THEN 1 ELSE 0 END) AS completed_requests,
                   SUM(CASE WHEN rr.status = 'Canceled' THEN 1 ELSE 0 END) AS canceled_requests,
                   AVG(feedback.user_rating) AS avg_rating
            FROM users u
            LEFT JOIN ride_requests rr ON u.id = rr.user_id
            LEFT JOIN feedback ON rr.id = feedback.request_id
            GROUP BY u.id, u.name
        `;

        db.query(sql, (error, results) => {
            if (error) return res.status(500).json({ success: false, message: "Server Error", error });
            return res.status(200).json({ success: true, userActivity: results });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error });
    }
});

export default router;

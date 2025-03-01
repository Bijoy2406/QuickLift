import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import '../styles/help.css';

const Help = () => {
    const [user, setUser] = useState(null);
    const [openIndex, setOpenIndex] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8000/api/profile", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => {
            setUser(response.data);
        })
        .catch(error => {
            console.error("❌ Failed to fetch profile:", error);
            alert("Please log in first!");
            navigate("/login");
        });
    }, [navigate]);

    const toggleDropdown = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const riderFAQs = [
        { question: "How do I accept a ride request?", answer: "You can accept a ride request from the dashboard and click 'Accept' on incoming rides." },
        { question: "How do I check my earnings?", answer: "Your earnings are visible in the 'Earnings' tab, updated after every completed ride." },
        { question: "What if my rider cancels the ride?", answer: "If a rider cancels after you arrive, you may receive a cancellation fee." },
        { question: "How do I update my vehicle details?", answer: "Go to your profile settings and update your car number and details." },
        { question: "What should I do in case of an emergency?", answer: "Use the emergency button in the app to contact support or emergency services." },
        { question: "How do I rate a rider?", answer: "After completing a ride, you can rate the rider from your ride history section." },
    ];

    const userFAQs = [
        { question: "How do I book a ride?", answer: "Enter your destination, choose your ride type, and click 'Book Now'." },
        { question: "How do I cancel a ride?", answer: "Go to your ride history, select the active ride, and click 'Cancel' before the driver arrives." },
        { question: "How are fares calculated?", answer: "Fares are based on distance, time, and demand. Additional charges apply for peak hours." },
        { question: "How do I report a problem?", answer: "Go to 'Help & Support' and select the issue type to report it to our team." },
        { question: "What payment methods are accepted?", answer: "We accept credit/debit cards, mobile wallets, and cash (where available)." },
        { question: "Can I schedule a ride in advance?", answer: "Yes, you can schedule a ride up to 24 hours in advance." },
    ];

    return (
        <div className="help-container">
            <h2 className="help-title">Help & Support</h2>

            {user ? (
                <div className="help-section">
                    <h3 className="help-subtitle">
                        {user.role === "rider" ? "Rider Help Center" : "User Help Center"}
                    </h3>

                    {(user.role === "rider" ? riderFAQs : userFAQs).map((faq, index) => (
                        <div key={index} className="faq-item">
                            <button className="faq-question" onClick={() => toggleDropdown(index)}>
                                {faq.question}
                                {openIndex === index ? (
                                    <FaChevronUp className="icon rotate" />
                                ) : (
                                    <FaChevronDown className="icon" />
                                )}
                            </button>
                            <p className={`faq-answer ${openIndex === index ? "show" : ""}`}>
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600">Loading help content...</p>
            )}
        </div>
    );
};

export default Help;

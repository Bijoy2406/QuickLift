
import React, { useState } from 'react';
import "../styles/paymentOptions.css";

const PaymentOptions = ({ fare, onPaymentSelect }) => {
  const [selectedMethod, setSelectedMethod] = useState('');

  const handlePaymentSelect = (method) => {
    setSelectedMethod(method);
    onPaymentSelect(method);
  };

  return (
    <div className="payment-container">
      <h3>Select Payment Method</h3>
      <p>Total Fare: ৳{fare}</p>
      
      <div className="payment-options">
        <div 
          className={`payment-option ${selectedMethod === 'bkash' ? 'selected' : ''}`}
          onClick={() => handlePaymentSelect('bkash')}
        >
          <img src="../../src/assets/bkash.jpg" alt="bKash" />
          <span>bKash</span>
        </div>

        <div 
          className={`payment-option ${selectedMethod === 'nagad' ? 'selected' : ''}`}
          onClick={() => handlePaymentSelect('nagad')}
        >
          <img src="../../src/assets/nogod.jpg" alt="Nagad" />
          <span>Nagad</span>
        </div>

        <div 
          className={`payment-option ${selectedMethod === 'cash' ? 'selected' : ''}`}
          onClick={() => handlePaymentSelect('cash')}
        >
          <img src="../../src/assets/cash.jpg" alt="Cash" />
          <span>Cash</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptions;

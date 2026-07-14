import React, { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

const CheckoutForm = ({ cartItems, total, onCancel, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess({
        paymentId: paymentIntent.id,
        amount: paymentIntent.amount,
        status: paymentIntent.status
      });
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '0.5rem' }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>Order Summary</h3>
        {cartItems.map((item) => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>{item.name} x {item.quantity}</span>
            <span>${(item.price * item.quantity / 100).toFixed(2)} AUD</span>
          </div>
        ))}
        <div style={{ borderTop: '1px solid #ddd', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
          <strong>Total: ${(total / 100).toFixed(2)} AUD</strong>
        </div>
      </div>

      <PaymentElement id="payment-element" />
      
      {message && <div id="payment-message" style={{ color: 'red', marginTop: '1rem' }}>{message}</div>}
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            flex: 1,
            padding: '1rem',
            backgroundColor: '#eee',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
        <button
          disabled={isLoading || !stripe || !elements}
          id="submit"
          style={{
            flex: 2,
            padding: '1rem',
            backgroundColor: isLoading ? '#ccc' : '#8b4513',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? "Processing..." : `Pay $${(total / 100).toFixed(2)} AUD`}
        </button>
      </div>
    </form>
  );
};

const Checkout = ({ cartItems, onSuccess, onCancel }) => {
  const [clientSecret, setClientSecret] = useState("");
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    // In a real environment, you'd point to your actual backend URL
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cartItems }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          console.error("No client secret received", data);
        }
      })
      .catch(err => console.error("Error creating payment intent:", err));
  }, [cartItems]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '1rem',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ margin: 0 }}>Checkout</h2>
          <button 
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>

        {clientSecret ? (
          <CheckoutForm 
            cartItems={cartItems} 
            total={total} 
            onCancel={onCancel} 
            onSuccess={onSuccess} 
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Initializing secure checkout...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;

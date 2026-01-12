import React, { useState } from 'react';

const Checkout = ({ cartItems, onSuccess, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'AU'
  });

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // For now, simulate payment processing
      // In a real implementation, you would integrate with Stripe Elements
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment
      onSuccess({
        paymentId: 'pi_' + Math.random().toString(36).substr(2, 9),
        amount: total,
        customerInfo,
        items: cartItems
      });
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

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
          <h2 style={{ margin: 0, color: 'var(--dreamtime-900)' }}>Checkout</h2>
          <button 
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--dreamtime-700)'
            }}
          >
            ×
          </button>
        </div>

        {/* Order Summary */}
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: 'var(--dreamtime-50)', borderRadius: '0.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: 'var(--dreamtime-900)' }}>Order Summary</h3>
          {cartItems.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity / 100).toFixed(2)} AUD</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--dreamtime-200)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
            <strong>Total: ${(total / 100).toFixed(2)} AUD</strong>
          </div>
        </div>

        {/* Customer Information Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--dreamtime-900)' }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={customerInfo.email}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--dreamtime-300)',
                borderRadius: '0.25rem',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--dreamtime-900)' }}>
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={customerInfo.name}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--dreamtime-300)',
                borderRadius: '0.25rem',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--dreamtime-900)' }}>
              Address
            </label>
            <input
              type="text"
              name="address"
              value={customerInfo.address}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--dreamtime-300)',
                borderRadius: '0.25rem',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--dreamtime-900)' }}>
                City
              </label>
              <input
                type="text"
                name="city"
                value={customerInfo.city}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--dreamtime-300)',
                  borderRadius: '0.25rem',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--dreamtime-900)' }}>
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                value={customerInfo.postalCode}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--dreamtime-300)',
                  borderRadius: '0.25rem',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                flex: 1,
                padding: '1rem',
                backgroundColor: 'var(--ochre-200)',
                color: 'var(--ochre-800)',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              style={{
                flex: 2,
                padding: '1rem',
                backgroundColor: isProcessing ? 'var(--dreamtime-300)' : 'var(--dreamtime-600)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isProcessing ? 'not-allowed' : 'pointer'
              }}
            >
              {isProcessing ? 'Processing...' : `Pay $${(total / 100).toFixed(2)} AUD`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;

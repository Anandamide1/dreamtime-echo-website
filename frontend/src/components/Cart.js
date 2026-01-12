import React, { useState, useEffect } from 'react';

const Cart = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const newTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  }, [cartItems]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '400px',
      height: '100vh',
      backgroundColor: 'white',
      boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
      zIndex: 1000,
      padding: '2rem',
      overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, color: 'var(--dreamtime-900)' }}>Shopping Cart</h2>
        <button 
          onClick={onClose}
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

      {cartItems.length === 0 ? (
        <p style={{ color: 'var(--dreamtime-700)' }}>Your cart is empty</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem 0',
              borderBottom: '1px solid #eee'
            }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--dreamtime-900)' }}>{item.name}</h4>
                <p style={{ margin: 0, color: 'var(--dreamtime-700)', fontSize: '0.9rem' }}>
                  ${(item.price / 100).toFixed(2)} AUD
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    style={{
                      width: '30px',
                      height: '30px',
                      border: '1px solid var(--dreamtime-300)',
                      background: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    -
                  </button>
                  <span style={{ minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    style={{
                      width: '30px',
                      height: '30px',
                      border: '1px solid var(--dreamtime-300)',
                      background: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  style={{
                    background: 'var(--ochre-600)',
                    color: 'white',
                    border: 'none',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '2px solid var(--dreamtime-200)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <strong style={{ fontSize: '1.2rem', color: 'var(--dreamtime-900)' }}>
                Total: ${(total / 100).toFixed(2)} AUD
              </strong>
            </div>
            <button
              onClick={onCheckout}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: 'var(--dreamtime-600)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = 'var(--dreamtime-700)'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'var(--dreamtime-600)'}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;

import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import Cart from './Cart';
import Checkout from './Checkout';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const STRIPE_PUBLISHABLE_KEY = 'pk_live_51RJS3OCAexvWGCM2QQ4IE9z6VEVJ83ZIL5zcjgJzjUd0DRglAPkqtZfyd3LgEsR1OTEqcbIwknG9tKglmsZrmCtL00NE3lT3Vh';

  const products = [
    {
      id: 'cosmic_journey',
      name: 'Cosmic Journey Process',
      description: 'A comprehensive spiritual guidance system that takes you from initial spark to universal resonance.',
      price: 4999, // Price in cents
      image: '/images/cosmic_journey_overall_indigenous.png'
    },
    {
      id: 'digital_art',
      name: 'Digital Art Collection',
      description: 'High-resolution Indigenous-inspired digital artworks perfect for prints and digital use.',
      price: 2999,
      image: '/images/thunder_api_indigenous.png'
    },
    {
      id: 'wisdom_guides',
      name: 'Wisdom Guides',
      description: 'Digital guides combining traditional knowledge with modern applications for personal growth.',
      price: 1999,
      image: '/images/shaman_validation_indigenous.png'
    },
    {
      id: 'storytelling_prompts',
      name: 'Australian Storytelling Prompt Pack',
      description: '100+ unique AI prompts for creating authentic Australian Indigenous-inspired stories and content.',
      price: 2499,
      image: '/images/storytelling_prompts_indigenous.png'
    },
    {
      id: 'art_style_guide',
      name: 'Indigenous Art Style Guide for AI',
      description: 'Complete guide to creating respectful Indigenous-inspired art using AI tools and traditional techniques.',
      price: 3999,
      image: '/images/art_style_guide_indigenous.png'
    },
    {
      id: 'bush_tucker_cards',
      name: 'Bush Tucker Knowledge Cards',
      description: 'Educational digital cards featuring native Australian foods, their uses, and nutritional benefits.',
      price: 1999,
      image: '/images/bush_tucker_cards_indigenous.png'
    },
    {
      id: 'social_media_templates',
      name: 'Dreamtime Social Media Templates',
      description: 'Professional social media templates with authentic Australian Indigenous design elements.',
      price: 3499,
      image: '/images/social_media_templates_indigenous.png'
    },
    {
      id: 'wildlife_content_pack',
      name: 'Australian Wildlife Content Pack',
      description: 'Comprehensive content pack featuring native Australian animals with cultural significance and facts.',
      price: 2999,
      image: '/images/wildlife_content_pack_indigenous.png'
    },
    {
      id: 'sacred_sites_collection',
      name: 'Sacred Sites Inspiration Collection',
      description: 'Respectful artistic interpretations and stories inspired by Australia\'s sacred landscapes and sites.',
      price: 4499,
      image: '/images/sacred_sites_indigenous.png'
    }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productId);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handlePaymentSuccess = (paymentDetails) => {
    alert(`Payment successful! Order ID: ${paymentDetails.paymentId}`);
    setCartItems([]);
    setIsCheckoutOpen(false);
    // Here you would typically send order details to your backend
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient">
      <Analytics />
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            Dreamtime Echo
          </div>
          
          <ul className="nav-links">
            <li><a href="#home" className="nav-link">Home</a></li>
            <li><a href="#gallery" className="nav-link">Gallery</a></li>
            <li><a href="#store" className="nav-link">Store</a></li>
            <li><a href="#blog" className="nav-link">Blog</a></li>
            <li><a href="#contact" className="nav-link">Contact</a></li>
            <li>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="nav-link"
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  position: 'relative',
                  padding: '0.5rem'
                }}
              >
                🛒 Cart
                {cartItemCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    backgroundColor: 'var(--ochre-600)',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {cartItemCount}
                  </span>
                )}
              </button>
            </li>
          </ul>

          <button className="mobile-menu-btn" onClick={toggleMenu}>
            ☰
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="container">
          <h1>Welcome to Dreamtime Echo</h1>
          <p>
            Where ancient wisdom meets modern creativity. Explore our gallery of Indigenous-inspired art 
            and discover spiritual guidance through our unique cosmic journey process.
          </p>
          <div className="hero-buttons">
            <a href="#gallery" className="btn btn-primary">Explore Gallery</a>
            <a href="#store" className="btn btn-secondary">Visit Store</a>
          </div>
        </div>
      </section>

      {/* Featured Gallery Preview */}
      <section id="gallery" className="section section-alt">
        <div className="container">
          <h2 className="section-title">Featured Gallery</h2>
          <p className="section-subtitle">
            Discover our collection of Indigenous-inspired digital art, each piece telling a story 
            of connection between ancient wisdom and modern expression.
          </p>
          
          <div className="grid grid-3">
            {[
              { 
                src: '/images/cosmic_journey_overall_indigenous.png', 
                title: 'Cosmic Journey', 
                description: 'A mystical pathway through the universe' 
              },
              { 
                src: '/images/thunder_api_indigenous.png', 
                title: 'Thunder API', 
                description: 'The power of transformation' 
              },
              { 
                src: '/images/eagle_oversight_indigenous.png', 
                title: 'Wedge-tailed Eagle Oversight', 
                description: 'Watchful guidance from Australia\'s largest bird of prey' 
              },
              { 
                src: '/images/shaman_validation_indigenous.png', 
                title: 'Shaman Validation', 
                description: 'Ancient wisdom and authenticity' 
              },
              { 
                src: '/images/rainbow_bridge_indigenous.png', 
                title: 'Rainbow Bridge', 
                description: 'Connection between realms' 
              },
              { 
                src: '/images/songline_ledger_indigenous.png', 
                title: 'Songline Ledger', 
                description: 'Eternal resonance and wisdom' 
              }
            ].map((item, index) => (
              <div key={index} className="card">
                <img 
                  src={item.src} 
                  alt={item.title}
                  className="card-image"
                />
                <div className="card-content">
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-description">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Store Preview */}
      <section id="store" className="section">
        <div className="container">
          <h2 className="section-title">Our Store</h2>
          <p className="section-subtitle">
            Discover digital products that blend ancient wisdom with modern insights. 
            From spiritual guidance to creative tools.
          </p>
          
          <div className="grid grid-3">
            {products.map((product) => (
              <div key={product.id} className="card">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="card-image"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-content">
                  <h3 className="card-title">{product.name}</h3>
                  <p className="card-description">{product.description}</p>
                  <div className="card-footer">
                    <span className="price">${(product.price / 100).toFixed(2)} AUD</span>
                    <button 
                      className="btn btn-primary"
                      onClick={() => addToCart(product.id)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section section-alt">
        <div className="container">
          <h2 className="section-title">Connect With Us</h2>
          <p className="section-subtitle">
            Ready to begin your journey? Get in touch to learn more about our products and services.
          </p>
          <div style={{ textAlign: 'center' }}>
            <button className="btn btn-secondary">
              ✉️ Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <h3>Dreamtime Echo</h3>
          <p>Bridging ancient wisdom with modern creativity</p>
          <p className="footer-text">© 2024 Dreamtime Echo. All rights reserved.</p>
        </div>
      </footer>

      {/* Shopping Cart */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />

      {/* Checkout */}
      {isCheckoutOpen && (
        <Checkout
          cartItems={cartItems}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setIsCheckoutOpen(false)}
        />
      )}
    </div>
  );
}

export default App;

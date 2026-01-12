from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import stripe
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='../static', static_url_path='')
CORS(app)

# Stripe configuration
stripe.api_key = os.getenv('STRIPE_SECRET_KEY', 'sk_test_placeholder')

# Product catalog
PRODUCTS = {
    'cosmic_journey': {
        'id': 'cosmic_journey',
        'name': 'Cosmic Journey Process',
        'description': 'A comprehensive spiritual guidance system that takes you from initial spark to universal resonance.',
        'price': 4999,  # Price in cents
        'currency': 'aud',
        'image': '/images/cosmic_journey_overall_indigenous.png'
    },
    'digital_art': {
        'id': 'digital_art',
        'name': 'Digital Art Collection',
        'description': 'High-resolution Indigenous-inspired digital artworks perfect for prints and digital use.',
        'price': 2999,  # Price in cents
        'currency': 'aud',
        'image': '/images/thunder_api_indigenous.png'
    },
    'wisdom_guides': {
        'id': 'wisdom_guides',
        'name': 'Wisdom Guides',
        'description': 'Digital guides combining traditional knowledge with modern applications for personal growth.',
        'price': 1999,  # Price in cents
        'currency': 'aud',
        'image': '/images/shaman_validation_indigenous.png'
    },
    'storytelling_prompts': {
        'id': 'storytelling_prompts',
        'name': 'Australian Storytelling Prompt Pack',
        'description': '100+ unique AI prompts for creating authentic Australian Indigenous-inspired stories and content.',
        'price': 2499,  # Price in cents
        'currency': 'aud',
        'image': '/images/storytelling_prompts_indigenous.png'
    },
    'art_style_guide': {
        'id': 'art_style_guide',
        'name': 'Indigenous Art Style Guide for AI',
        'description': 'Complete guide to creating respectful Indigenous-inspired art using AI tools and traditional techniques.',
        'price': 3999,  # Price in cents
        'currency': 'aud',
        'image': '/images/art_style_guide_indigenous.png'
    },
    'bush_tucker_cards': {
        'id': 'bush_tucker_cards',
        'name': 'Bush Tucker Knowledge Cards',
        'description': 'Educational digital cards featuring native Australian foods, their uses, and nutritional benefits.',
        'price': 1999,  # Price in cents
        'currency': 'aud',
        'image': '/images/bush_tucker_cards_indigenous.png'
    },
    'social_media_templates': {
        'id': 'social_media_templates',
        'name': 'Dreamtime Social Media Templates',
        'description': 'Professional social media templates with authentic Australian Indigenous design elements.',
        'price': 3499,  # Price in cents
        'currency': 'aud',
        'image': '/images/social_media_templates_indigenous.png'
    },
    'wildlife_content_pack': {
        'id': 'wildlife_content_pack',
        'name': 'Australian Wildlife Content Pack',
        'description': 'Comprehensive content pack featuring native Australian animals with cultural significance and facts.',
        'price': 2999,  # Price in cents
        'currency': 'aud',
        'image': '/images/wildlife_content_pack_indigenous.png'
    },
    'sacred_sites_collection': {
        'id': 'sacred_sites_collection',
        'name': 'Sacred Sites Inspiration Collection',
        'description': 'Respectful artistic interpretations and stories inspired by Australia\'s sacred landscapes and sites.',
        'price': 4499,  # Price in cents
        'currency': 'aud',
        'image': '/images/sacred_sites_indigenous.png'
    }
}

@app.route('/')
def index():
    return send_from_directory('../static', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    """Serve static files and handle React routing"""
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory('../static', path)
    else:
        # For React routing, serve index.html for unknown paths
        return send_from_directory('../static', 'index.html')

@app.route('/api/products', methods=['GET'])
def get_products():
    """Get all available products"""
    return jsonify(list(PRODUCTS.values()))

@app.route('/api/products/<product_id>', methods=['GET'])
def get_product(product_id):
    """Get a specific product by ID"""
    if product_id in PRODUCTS:
        return jsonify(PRODUCTS[product_id])
    return jsonify({'error': 'Product not found'}), 404

@app.route('/api/create-payment-intent', methods=['POST'])
def create_payment_intent():
    """Create a Stripe payment intent"""
    try:
        data = request.get_json()
        product_id = data.get('product_id')
        quantity = data.get('quantity', 1)
        
        if product_id not in PRODUCTS:
            return jsonify({'error': 'Invalid product'}), 400
        
        product = PRODUCTS[product_id]
        amount = product['price'] * quantity
        
        # Create payment intent
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency=product['currency'],
            metadata={
                'product_id': product_id,
                'product_name': product['name'],
                'quantity': quantity
            }
        )
        
        return jsonify({
            'client_secret': intent.client_secret,
            'amount': amount,
            'currency': product['currency']
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/webhook', methods=['POST'])
def stripe_webhook():
    """Handle Stripe webhooks"""
    payload = request.get_data()
    sig_header = request.headers.get('Stripe-Signature')
    endpoint_secret = os.getenv('STRIPE_WEBHOOK_SECRET')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError:
        return jsonify({'error': 'Invalid payload'}), 400
    except stripe.error.SignatureVerificationError:
        return jsonify({'error': 'Invalid signature'}), 400
    
    # Handle the event
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        # Handle successful payment
        print(f"Payment succeeded: {payment_intent['id']}")
        # You can add email notifications, order fulfillment, etc. here
    
    return jsonify({'status': 'success'})

@app.route('/api/cart/add', methods=['POST'])
def add_to_cart():
    """Add item to cart (session-based for now)"""
    try:
        data = request.get_json()
        product_id = data.get('product_id')
        quantity = data.get('quantity', 1)
        
        if product_id not in PRODUCTS:
            return jsonify({'error': 'Invalid product'}), 400
        
        # For now, just return success
        # In a full implementation, you'd store this in a session or database
        return jsonify({
            'success': True,
            'message': f'Added {quantity} x {PRODUCTS[product_id]["name"]} to cart'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import stripe
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)

# Stripe configuration
stripe.api_key = os.getenv('STRIPE_SECRET_KEY', 'sk_test_placeholder')

# Product catalog (Synchronized with frontend)
PRODUCTS = {
    'cosmic_journey': {
        'id': 'cosmic_journey',
        'name': 'Cosmic Journey Process',
        'price': 4999,
        'currency': 'aud'
    },
    'digital_art': {
        'id': 'digital_art',
        'name': 'Digital Art Collection',
        'price': 2999,
        'currency': 'aud'
    },
    'wisdom_guides': {
        'id': 'wisdom_guides',
        'name': 'Wisdom Guides',
        'price': 1999,
        'currency': 'aud'
    },
    'storytelling_prompts': {
        'id': 'storytelling_prompts',
        'name': 'Australian Storytelling Prompt Pack',
        'price': 2499,
        'currency': 'aud'
    },
    'art_style_guide': {
        'id': 'art_style_guide',
        'name': 'Indigenous Art Style Guide for AI',
        'price': 3999,
        'currency': 'aud'
    },
    'bush_tucker_cards': {
        'id': 'bush_tucker_cards',
        'name': 'Bush Tucker Knowledge Cards',
        'price': 1999,
        'currency': 'aud'
    },
    'social_media_templates': {
        'id': 'social_media_templates',
        'name': 'Dreamtime Social Media Templates',
        'price': 3499,
        'currency': 'aud'
    },
    'wildlife_content_pack': {
        'id': 'wildlife_content_pack',
        'name': 'Australian Wildlife Content Pack',
        'price': 2999,
        'currency': 'aud'
    },
    'sacred_sites_collection': {
        'id': 'sacred_sites_collection',
        'name': 'Sacred Sites Inspiration Collection',
        'price': 4499,
        'currency': 'aud'
    }
}

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/api/products', methods=['GET'])
def get_products():
    """Get all available products"""
    return jsonify(list(PRODUCTS.values()))

@app.route('/api/create-payment-intent', methods=['POST'])
def create_payment_intent():
    """Create a Stripe payment intent for multiple items"""
    try:
        data = request.get_json()
        items = data.get('items', [])
        
        if not items:
            return jsonify({'error': 'No items in cart'}), 400
        
        total_amount = 0
        order_description = []
        
        for item in items:
            product_id = item.get('id')
            quantity = item.get('quantity', 1)
            
            if product_id not in PRODUCTS:
                return jsonify({'error': f'Invalid product: {product_id}'}), 400
            
            product = PRODUCTS[product_id]
            total_amount += product['price'] * quantity
            order_description.append(f"{product['name']} (x{quantity})")
        
        # Create payment intent
        intent = stripe.PaymentIntent.create(
            amount=total_amount,
            currency='aud',
            metadata={
                'order_items': json.dumps(items),
                'description': ", ".join(order_description)
            },
            automatic_payment_methods={
                'enabled': True,
            },
        )
        
        return jsonify({
            'clientSecret': intent.client_secret,
            'amount': total_amount
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/webhook', methods=['POST'])
def stripe_webhook():
    """Handle Stripe webhooks"""
    payload = request.get_data()
    sig_header = request.headers.get('Stripe-Signature')
    endpoint_secret = os.getenv('STRIPE_WEBHOOK_SECRET')
    
    if not endpoint_secret:
        # For development/testing if secret isn't set
        return jsonify({'status': 'ignored', 'reason': 'no secret'}), 200

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
        print(f"Payment succeeded: {payment_intent['id']}")
        # Here you would trigger fulfillment, send emails, etc.
    
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)

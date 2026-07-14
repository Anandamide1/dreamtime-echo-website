"""
Advanced Stripe Webhook Handler
Processes payment events and triggers order fulfillment workflows
"""

import stripe
import json
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

class StripeWebhookHandler:
    """Handles Stripe webhook events"""
    
    def __init__(self):
        self.stripe_api_key = os.getenv('STRIPE_SECRET_KEY')
        stripe.api_key = self.stripe_api_key
    
    def handle_payment_intent_succeeded(self, payment_intent):
        """
        Handle successful payment
        
        Args:
            payment_intent: Stripe PaymentIntent object
        """
        payment_id = payment_intent['id']
        amount = payment_intent['amount']
        currency = payment_intent['currency']
        metadata = payment_intent.get('metadata', {})
        
        print(f"✓ Payment succeeded: {payment_id}")
        print(f"  Amount: {amount/100:.2f} {currency.upper()}")
        print(f"  Metadata: {metadata}")
        
        # TODO: Implement order creation
        order_data = {
            'payment_id': payment_id,
            'amount': amount,
            'currency': currency,
            'items': json.loads(metadata.get('order_items', '[]')),
            'timestamp': datetime.utcnow().isoformat(),
            'status': 'completed'
        }
        
        # TODO: Save order to database
        # TODO: Send confirmation email
        # TODO: Trigger digital product delivery
        
        return order_data
    
    def handle_payment_intent_payment_failed(self, payment_intent):
        """
        Handle failed payment
        
        Args:
            payment_intent: Stripe PaymentIntent object
        """
        payment_id = payment_intent['id']
        last_error = payment_intent.get('last_payment_error', {})
        
        print(f"✗ Payment failed: {payment_id}")
        print(f"  Error: {last_error.get('message', 'Unknown error')}")
        
        # TODO: Send failure notification email
        # TODO: Log failed payment attempt
        
        return {
            'payment_id': payment_id,
            'error': last_error.get('message'),
            'status': 'failed'
        }
    
    def handle_charge_refunded(self, charge):
        """
        Handle refund
        
        Args:
            charge: Stripe Charge object
        """
        charge_id = charge['id']
        refund_amount = charge.get('amount_refunded', 0)
        
        print(f"↩ Refund processed: {charge_id}")
        print(f"  Refund amount: {refund_amount/100:.2f}")
        
        # TODO: Update order status to refunded
        # TODO: Send refund confirmation email
        
        return {
            'charge_id': charge_id,
            'refund_amount': refund_amount,
            'status': 'refunded'
        }
    
    def handle_customer_subscription_created(self, subscription):
        """
        Handle new subscription (for future subscription products)
        
        Args:
            subscription: Stripe Subscription object
        """
        subscription_id = subscription['id']
        customer_id = subscription['customer']
        
        print(f"+ Subscription created: {subscription_id}")
        print(f"  Customer: {customer_id}")
        
        # TODO: Create subscription record in database
        
        return {
            'subscription_id': subscription_id,
            'customer_id': customer_id,
            'status': 'active'
        }
    
    def handle_invoice_payment_succeeded(self, invoice):
        """
        Handle successful invoice payment (for subscriptions)
        
        Args:
            invoice: Stripe Invoice object
        """
        invoice_id = invoice['id']
        amount_paid = invoice.get('amount_paid', 0)
        
        print(f"✓ Invoice paid: {invoice_id}")
        print(f"  Amount: {amount_paid/100:.2f}")
        
        # TODO: Update subscription payment record
        
        return {
            'invoice_id': invoice_id,
            'amount_paid': amount_paid,
            'status': 'paid'
        }
    
    def process_event(self, event):
        """
        Process a Stripe webhook event
        
        Args:
            event: Stripe event object
            
        Returns:
            Result of event processing
        """
        event_type = event['type']
        event_data = event['data']['object']
        
        handlers = {
            'payment_intent.succeeded': self.handle_payment_intent_succeeded,
            'payment_intent.payment_failed': self.handle_payment_intent_payment_failed,
            'charge.refunded': self.handle_charge_refunded,
            'customer.subscription.created': self.handle_customer_subscription_created,
            'invoice.payment_succeeded': self.handle_invoice_payment_succeeded,
        }
        
        handler = handlers.get(event_type)
        
        if handler:
            return handler(event_data)
        else:
            print(f"⚠ Unhandled event type: {event_type}")
            return None


# Example usage
if __name__ == '__main__':
    handler = StripeWebhookHandler()
    
    # Example event structure
    example_event = {
        'type': 'payment_intent.succeeded',
        'data': {
            'object': {
                'id': 'pi_1234567890',
                'amount': 10997,
                'currency': 'aud',
                'metadata': {
                    'order_items': '[{"id": "cosmic_journey", "quantity": 1}]',
                    'description': 'Cosmic Journey Process'
                }
            }
        }
    }
    
    result = handler.process_event(example_event)
    print(f"\nProcessed result: {result}")

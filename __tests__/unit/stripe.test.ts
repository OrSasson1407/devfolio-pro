import { POST } from '@/app/api/stripe/webhook/route';
import { stripe } from '@/lib/stripe';

// Mock the Stripe library to simulate the webhook construction safely without hitting the network
jest.mock('@/lib/stripe', () => ({
  stripe: {
    webhooks: {
      constructEvent: jest.fn(),
    },
  },
}));

describe('Stripe Webhook API', () => {
  it('returns 400 on invalid signature', async () => {
    // Force constructEvent to throw an error, simulating a bad signature validation
    (stripe.webhooks.constructEvent as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid signature');
    });

    // Create a fake Next.js Request object with a fake signature
    const req = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      body: JSON.stringify({ type: 'fake_event' }),
      headers: { 'stripe-signature': 'invalid_signature_string' },
    });

    // Call the route handler
    const response = await POST(req);
    
    // Assert the response is correctly handled as a 400 Bad Request
    expect(response.status).toBe(400);
  });
});
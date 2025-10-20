import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_live_l34uez5g0kwyeFGtf1MGYAlC');

export { stripePromise };

// Your KenjiAI Complete product with 30-day money-back guarantee
export const STRIPE_PRODUCT_ID = 'prod_SaHy0mYrFO5hEC';

// Direct Stripe Payment Links
export const STRIPE_PAYMENT_LINKS = {
  monthly: 'https://freedom.kenjiai.com/checkout-4912-2457-3370',
  yearly: 'https://freedom.kenjiai.com/checkout-4912-2457-3370'
};

// Updated Price IDs for reference (if needed)
export const STRIPE_PRICE_IDS = {
  monthly: 'price_1Rf7OfAFtO7OZUieg3UtHcyK', // Monthly - $275
  yearly: 'price_1Rf7OgAFtO7OZUieV7GjTset'    // Yearly - $2600
};

// Simplified redirect function using payment links
export const redirectToPaymentLink = async (planType: 'monthly' | 'yearly') => {
  try {
    console.log('Redirecting to payment link for:', planType);

    // Get the payment link
    const paymentLink = STRIPE_PAYMENT_LINKS[planType];
    
    if (!paymentLink) {
      throw new Error('Payment link not found for the selected plan');
    }

    // Check if user earned the discount coupon
    const earnedDiscount = localStorage.getItem('kenjiai-discount-earned');
    
    // Show loading state
    const loadingElement = document.createElement('div');
    loadingElement.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        color: white;
        font-family: system-ui, -apple-system, sans-serif;
        backdrop-filter: blur(10px);
      ">
        <div style="text-align: center; padding: 2rem;">
          <div style="
            width: 60px;
            height: 60px;
            border: 4px solid #3B82F6;
            border-top: 4px solid transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 24px;
          "></div>
          <div style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem;">
            Redirecting to Secure Checkout
          </div>
          <div style="font-size: 1rem; color: #9CA3AF;">
            Please wait while we prepare your payment...
          </div>
          <div style="font-size: 0.875rem; color: #6B7280; margin-top: 1rem;">
            🔒 Secured by Stripe
          </div>
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </div>
    `;
    document.body.appendChild(loadingElement);

    // Show discount message if earned
    if (earnedDiscount === 'true') {
      try {
        console.log('User has earned discount - they can enter LUCKY at checkout');
        
        // Clear the discount from localStorage
        localStorage.removeItem('kenjiai-discount-earned');
        localStorage.removeItem('kenjiai-discount-coupon');
        
        // Show a message to the user about the discount code
        const discountMessage = document.createElement('div');
        discountMessage.innerHTML = `
          <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 10000;
            font-family: system-ui, -apple-system, sans-serif;
            max-width: 300px;
          ">
            <div style="font-weight: 600; margin-bottom: 0.5rem;">🎉 Discount Available!</div>
            <div style="font-size: 0.875rem;">Enter code <strong>LUCKY</strong> at checkout for 10% off!</div>
          </div>
        `;
        document.body.appendChild(discountMessage);
        
        // Remove message after 5 seconds
        setTimeout(() => {
          if (document.body.contains(discountMessage)) {
            discountMessage.remove();
          }
        }, 5000);
        
      } catch (discountError) {
        console.warn('Could not prepare discount, proceeding without it:', discountError);
      }
    }

    // Add timeout protection
    const timeoutId = setTimeout(() => {
      if (document.body.contains(loadingElement)) {
        document.body.removeChild(loadingElement);
      }
      throw new Error('Payment redirect timed out. Please try again.');
    }, 10000);

    // Small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Clear timeout
    clearTimeout(timeoutId);

    // Remove loading state
    if (document.body.contains(loadingElement)) {
      document.body.removeChild(loadingElement);
    }

    // Track the payment attempt
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'begin_checkout', {
        currency: 'USD',
        value: planType === 'yearly' ? 2600 : 275,
        items: [{
          item_id: `kenjiai_${planType}`,
          item_name: `KenjiAI ${planType} Plan`,
          category: 'Software',
          quantity: 1,
          price: planType === 'yearly' ? 2600 : 275
        }]
      });
    }

    // Redirect to the payment link
    window.location.href = paymentLink;

  } catch (error) {
    console.error('Payment redirect error:', error);
    
    // Remove loading state if it exists
    const loadingElement = document.querySelector('[style*="position: fixed"][style*="z-index: 9999"]');
    if (loadingElement) {
      loadingElement.remove();
    }
    
    // Enhanced error handling
    let errorMessage = 'Payment redirect failed. Please try again.';
    
    if (error instanceof Error) {
      if (error.message.includes('network') || error.message.includes('connection')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else if (error.message.includes('not found')) {
        errorMessage = 'Payment option not available. Please contact support at care@kenjiai.com';
      } else {
        errorMessage = error.message;
      }
    }
    
    throw new Error(errorMessage);
  }
};

// Legacy function for backward compatibility - now redirects to payment links
export const redirectToCheckout = async (priceId: string) => {
  const planType = priceId === STRIPE_PRICE_IDS.yearly ? 'yearly' : 'monthly';
  return redirectToPaymentLink(planType);
};

// Function to validate checkout prerequisites
export const validateCheckoutPrerequisites = () => {
  if (typeof window === 'undefined') {
    throw new Error('Checkout not available in server environment');
  }
  
  if (!window.fetch) {
    throw new Error('Your browser does not support modern payment features. Please update your browser.');
  }
  
  return true;
};

// Function to prepare checkout data
export const prepareCheckoutData = (planType: 'monthly' | 'yearly') => {
  const hasDiscount = localStorage.getItem('kenjiai-discount-earned') === 'true';
  
  return {
    planType,
    hasDiscount,
    timestamp: new Date().toISOString(),
    referrer: document.referrer || 'direct',
    pageUrl: window.location.href,
    paymentLink: STRIPE_PAYMENT_LINKS[planType]
  };
};

// Function to track checkout events
export const trackCheckoutEvent = (eventName: string, properties: Record<string, any> = {}) => {
  try {
    // Google Analytics 4 tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, {
        ...properties,
        timestamp: new Date().toISOString(),
      });
    }
    
    console.log('Checkout event tracked:', eventName, properties);
  } catch (error) {
    console.warn('Failed to track checkout event:', error);
  }
};

// Helper function to verify Stripe configuration
export const verifyStripeConfig = async () => {
  try {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe not initialized');
    }
    
    console.log('Stripe configuration verified successfully');
    return true;
  } catch (error) {
    console.error('Stripe configuration error:', error);
    return false;
  }
};

// Test function for development
export const testStripeIntegration = async () => {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('Test function only available in development');
    return;
  }
  
  try {
    console.log('Testing Stripe integration...');
    console.log('Publishable Key:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? 'Set' : 'Missing');
    console.log('Payment Links:', STRIPE_PAYMENT_LINKS);
    
    const stripe = await stripePromise;
    console.log('Stripe instance:', stripe ? 'Loaded' : 'Failed to load');
    
    return {
      stripeLoaded: !!stripe,
      paymentLinks: STRIPE_PAYMENT_LINKS,
      publishableKey: !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    };
  } catch (error) {
    console.error('Stripe test failed:', error);
    return { error: error.message };
  }
};
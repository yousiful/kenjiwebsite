/**
 * Example Usage: Accessible Component Implementations
 *
 * This file demonstrates how to integrate accessible components
 * into your existing application to replace problematic patterns.
 */

import React, { useState } from 'react';
import AccessibleCarousel from './AccessibleCarousel';
import AccessibleDropdown from './AccessibleDropdown';
import { AccessibleNotifications } from './AccessibleNotifications';
import ProgressivelyEnhancedInfiniteScroll from './ProgressivelyEnhancedInfiniteScroll';
import SkipLinks from './SkipLinks';
import AccessibilityControls from './AccessibilityControls';

// Example 1: Replace Hero Rotating Headlines with Accessible Carousel
export const AccessibleHeroExample = () => {
  const headlines = [
    {
      id: 'headline-1',
      label: 'AI Revenue Generator',
      content: (
        <div className="p-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Turn Every Lead Into Revenue With AI
          </h2>
          <p className="text-xl text-gray-300">
            Stop losing money to manual work. Our AI voice agents close deals 24/7.
          </p>
        </div>
      )
    },
    {
      id: 'headline-2',
      label: 'Automation Platform',
      content: (
        <div className="p-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            AI That Closes Deals While You Sleep
          </h2>
          <p className="text-xl text-gray-300">
            Your competitors are sleeping. Your AI isn't.
          </p>
        </div>
      )
    },
    {
      id: 'headline-3',
      label: 'Business Intelligence',
      content: (
        <div className="p-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Automate Your Sales, 10X Your Revenue
          </h2>
          <p className="text-xl text-gray-300">
            Average ROI: 425% in first 90 days.
          </p>
        </div>
      )
    }
  ];

  return (
    <section className="py-24">
      <AccessibleCarousel
        items={headlines}
        autoPlayInterval={5000}
        ariaLabel="Product value propositions"
      />
    </section>
  );
};

// Example 2: Replace Pricing Selector with Accessible Dropdown
export const AccessiblePricingSelectorExample = () => {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [error, setError] = useState('');

  const pricingOptions = [
    {
      id: 'monthly',
      label: 'Monthly Plan',
      value: 'monthly',
      description: '$275/month - Flexible billing'
    },
    {
      id: 'yearly',
      label: 'Yearly Plan',
      value: 'yearly',
      description: '$2,600/year - Save 21%'
    },
    {
      id: 'enterprise',
      label: 'Enterprise Plan',
      value: 'enterprise',
      description: 'Custom pricing - Contact us',
      disabled: false
    }
  ];

  const handlePlanChange = (value: string) => {
    setSelectedPlan(value);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) {
      setError('Please select a plan to continue');
      return;
    }
    console.log('Selected plan:', selectedPlan);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6">
      <AccessibleDropdown
        options={pricingOptions}
        value={selectedPlan}
        onChange={handlePlanChange}
        label="Choose your plan"
        placeholder="Select a billing plan"
        helpText="You can change your plan anytime"
        required={true}
        error={error}
      />

      <button
        type="submit"
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Continue to Checkout
      </button>
    </form>
  );
};

// Example 3: Product Grid with Progressive Enhancement
export const AccessibleProductGridExample = () => {
  const [products, setProducts] = useState([
    { id: '1', name: 'Product 1', price: 29.99 },
    { id: '2', name: 'Product 2', price: 39.99 },
    // ... more products
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');

  const loadMoreProducts = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newProducts = Array.from({ length: 12 }, (_, i) => ({
        id: `${products.length + i + 1}`,
        name: `Product ${products.length + i + 1}`,
        price: Math.random() * 100
      }));

      setProducts(prev => [...prev, ...newProducts]);

      // Simulate pagination end
      if (products.length > 50) {
        setHasMore(false);
      }
    } catch (err) {
      setError('Failed to load more products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderProduct = (product: typeof products[0], index: number) => (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-blue-500 transition-colors">
      <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
      <p className="text-gray-400">${product.price.toFixed(2)}</p>
      <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
        Add to Cart
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-8">Product Catalog</h1>

      <ProgressivelyEnhancedInfiniteScroll
        items={products}
        renderItem={renderProduct}
        loadMore={loadMoreProducts}
        hasMore={hasMore}
        isLoading={isLoading}
        error={error}
        itemsPerPage={12}
        loadMoreLabel="Load more products"
        ariaLabel="Product catalog"
      />
    </div>
  );
};

// Example 4: Complete Layout with Accessibility Features
export const AccessibleLayoutExample: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {/* Skip Links - First element for keyboard users */}
      <SkipLinks
        links={[
          { id: 'skip-main', label: 'Skip to main content', target: '#main-content' },
          { id: 'skip-nav', label: 'Skip to navigation', target: '#main-navigation' },
          { id: 'skip-footer', label: 'Skip to footer', target: '#footer' }
        ]}
      />

      {/* Main Navigation */}
      <nav id="main-navigation" role="navigation" aria-label="Main navigation">
        <div className="bg-gray-900 border-b border-gray-800 p-4">
          <h1 className="text-2xl font-bold text-white">My Application</h1>
        </div>
      </nav>

      {/* Main Content */}
      <main id="main-content" tabIndex={-1} className="min-h-screen">
        {children}
      </main>

      {/* Footer */}
      <footer id="footer" className="bg-gray-900 border-t border-gray-800 p-8">
        <p className="text-gray-400 text-center">© 2025 My Application</p>
      </footer>

      {/* Accessibility Controls - Fixed position */}
      <AccessibilityControls />

      {/* Notification System */}
      <AccessibleNotifications position="top-right" />
    </>
  );
};

// Example 5: Using Accessible Notifications
export const NotificationExamples = () => {
  // This would typically be managed by a context or state management system
  const showNotification = (type: 'success' | 'error' | 'warning' | 'info') => {
    // Call notification system
    console.log('Show notification:', type);
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">Notification Examples</h2>

      <button
        onClick={() => showNotification('success')}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
      >
        Show Success
      </button>

      <button
        onClick={() => showNotification('error')}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
      >
        Show Error
      </button>

      <button
        onClick={() => showNotification('warning')}
        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
      >
        Show Warning
      </button>

      <button
        onClick={() => showNotification('info')}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
      >
        Show Info
      </button>
    </div>
  );
};

// Example 6: Form with Multiple Dropdowns and Validation
export const AccessibleFormExample = () => {
  const [formData, setFormData] = useState({
    country: '',
    state: '',
    plan: ''
  });
  const [errors, setErrors] = useState({
    country: '',
    state: '',
    plan: ''
  });

  const countries = [
    { id: 'us', label: 'United States', value: 'us' },
    { id: 'ca', label: 'Canada', value: 'ca' },
    { id: 'uk', label: 'United Kingdom', value: 'uk' }
  ];

  const states = [
    { id: 'ca', label: 'California', value: 'ca' },
    { id: 'ny', label: 'New York', value: 'ny' },
    { id: 'tx', label: 'Texas', value: 'tx' }
  ];

  const plans = [
    { id: 'basic', label: 'Basic', value: 'basic', description: '$10/month' },
    { id: 'pro', label: 'Pro', value: 'pro', description: '$20/month' },
    { id: 'enterprise', label: 'Enterprise', value: 'enterprise', description: 'Custom' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      country: formData.country ? '' : 'Please select a country',
      state: formData.state ? '' : 'Please select a state',
      plan: formData.plan ? '' : 'Please select a plan'
    };

    setErrors(newErrors);

    if (!Object.values(newErrors).some(error => error)) {
      console.log('Form submitted:', formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Sign Up Form</h2>

      <AccessibleDropdown
        options={countries}
        value={formData.country}
        onChange={(value) => setFormData({ ...formData, country: value })}
        label="Country"
        placeholder="Select your country"
        required={true}
        error={errors.country}
      />

      <AccessibleDropdown
        options={states}
        value={formData.state}
        onChange={(value) => setFormData({ ...formData, state: value })}
        label="State"
        placeholder="Select your state"
        required={true}
        error={errors.state}
      />

      <AccessibleDropdown
        options={plans}
        value={formData.plan}
        onChange={(value) => setFormData({ ...formData, plan: value })}
        label="Plan"
        placeholder="Choose a plan"
        helpText="You can upgrade or downgrade anytime"
        required={true}
        error={errors.plan}
      />

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
      >
        Complete Sign Up
      </button>
    </form>
  );
};

export default {
  AccessibleHeroExample,
  AccessiblePricingSelectorExample,
  AccessibleProductGridExample,
  AccessibleLayoutExample,
  NotificationExamples,
  AccessibleFormExample
};

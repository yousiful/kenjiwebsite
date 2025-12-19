import { useState } from 'react';
import { useFormValidation } from '../hooks/useFormValidation';
import { FormField } from './FormField';
import { FormNotification, InlineFormMessage } from './FormNotification';
import { Loader2, Send } from 'lucide-react';

export function ExampleContactForm() {
  const [showNotification, setShowNotification] = useState(false);

  const {
    values,
    isSubmitting,
    submitError,
    submitSuccess,
    isFormValid,
    isFormDirty,
    handleSubmit,
    resetForm,
    getFieldProps,
  } = useFormValidation(
    {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      website: '',
      message: '',
      subject: '',
    },
    {
      firstName: {
        required: 'First name is required',
        minLength: {
          value: 2,
          message: 'First name must be at least 2 characters',
        },
        maxLength: {
          value: 50,
          message: 'First name must not exceed 50 characters',
        },
        pattern: {
          value: /^[a-zA-Z\s'-]+$/,
          message: 'First name can only contain letters, spaces, hyphens, and apostrophes',
        },
      },
      lastName: {
        required: 'Last name is required',
        minLength: {
          value: 2,
          message: 'Last name must be at least 2 characters',
        },
        maxLength: {
          value: 50,
          message: 'Last name must not exceed 50 characters',
        },
        pattern: {
          value: /^[a-zA-Z\s'-]+$/,
          message: 'Last name can only contain letters, spaces, hyphens, and apostrophes',
        },
      },
      email: {
        required: 'Email address is required',
        email: 'Please enter a valid email address (e.g., name@company.com)',
      },
      phone: {
        pattern: {
          value: /^[\d\s\-\+\(\)]+$/,
          message: 'Please enter a valid phone number',
        },
        minLength: {
          value: 10,
          message: 'Phone number must be at least 10 digits',
        },
      },
      company: {
        minLength: {
          value: 2,
          message: 'Company name must be at least 2 characters',
        },
      },
      website: {
        url: 'Please enter a valid website URL (e.g., https://example.com)',
      },
      subject: {
        required: 'Please select a subject',
      },
      message: {
        required: 'Message is required',
        minLength: {
          value: 10,
          message: 'Message must be at least 10 characters',
        },
        maxLength: {
          value: 1000,
          message: 'Message must not exceed 1000 characters',
        },
      },
    },
    {
      validateOnChange: true,
      validateOnBlur: true,
      validateDebounceMs: 300,
    }
  );

  const onSubmit = async (formValues: Record<string, any>) => {
    console.log('Form submitted:', formValues);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const success = Math.random() > 0.2;

    if (!success) {
      throw new Error('Failed to submit form. Please try again.');
    }

    setShowNotification(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(onSubmit);
  };

  const handleNotificationClose = () => {
    setShowNotification(false);
    if (submitSuccess) {
      resetForm();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <FormNotification
        type={submitSuccess ? 'success' : 'error'}
        message={
          submitSuccess
            ? 'Your message has been sent successfully! We will get back to you soon.'
            : submitError || 'An error occurred'
        }
        show={showNotification}
        onClose={handleNotificationClose}
      />

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Get in Touch</h2>
          <p className="text-gray-600">
            Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="First Name"
              name="firstName"
              required
              placeholder="John"
              helpText="Enter your legal first name"
              autoComplete="given-name"
              {...getFieldProps('firstName')}
            />

            <FormField
              label="Last Name"
              name="lastName"
              required
              placeholder="Doe"
              helpText="Enter your legal last name"
              autoComplete="family-name"
              {...getFieldProps('lastName')}
            />
          </div>

          <FormField
            label="Email Address"
            name="email"
            type="email"
            required
            placeholder="john.doe@example.com"
            helpText="We'll never share your email with anyone"
            autoComplete="email"
            {...getFieldProps('email')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              helpText="Optional - for urgent matters"
              autoComplete="tel"
              {...getFieldProps('phone')}
            />

            <FormField
              label="Company"
              name="company"
              placeholder="Acme Inc."
              helpText="Optional"
              autoComplete="organization"
              {...getFieldProps('company')}
            />
          </div>

          <FormField
            label="Website"
            name="website"
            type="url"
            placeholder="https://example.com"
            helpText="Optional - include https://"
            autoComplete="url"
            {...getFieldProps('website')}
          />

          <FormField
            label="Subject"
            name="subject"
            type="select"
            required
            options={[
              { value: 'general', label: 'General Inquiry' },
              { value: 'support', label: 'Technical Support' },
              { value: 'sales', label: 'Sales Question' },
              { value: 'partnership', label: 'Partnership Opportunity' },
              { value: 'feedback', label: 'Product Feedback' },
            ]}
            helpText="Choose the category that best describes your inquiry"
            {...getFieldProps('subject')}
          />

          <FormField
            label="Message"
            name="message"
            type="textarea"
            required
            placeholder="Tell us more about your inquiry..."
            helpText="Please provide as much detail as possible"
            rows={6}
            maxLength={1000}
            showCharacterCount
            {...getFieldProps('message')}
          />

          {submitError && (
            <InlineFormMessage
              type="error"
              message={submitError}
              show={!!submitError}
            />
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-gray-600">
              {isFormDirty && !isFormValid && (
                <span className="text-amber-600">
                  Please fix the errors above before submitting
                </span>
              )}
              {isFormValid && isFormDirty && (
                <span className="text-green-600">
                  Form is ready to submit!
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isFormValid || !isFormDirty}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg font-semibold
                transition-all duration-200 transform
                ${
                  isSubmitting || !isFormValid || !isFormDirty
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Send Message
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">
            Form Validation Features:
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Real-time validation as you type</li>
            <li>✓ Clear, helpful error messages</li>
            <li>✓ Visual feedback for valid/invalid fields</li>
            <li>✓ Success confirmation on submission</li>
            <li>✓ Prevents submission until all fields are valid</li>
            <li>✓ Character count for long text fields</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

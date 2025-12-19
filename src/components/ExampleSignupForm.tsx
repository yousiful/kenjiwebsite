import { useState, useEffect } from 'react';
import { useFormValidation } from '../hooks/useFormValidation';
import { FormField } from './FormField';
import { FormNotification } from './FormNotification';
import { Loader2, UserPlus, Shield, Check } from 'lucide-react';

export function ExampleSignupForm() {
  const [showNotification, setShowNotification] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    label: string;
    color: string;
  }>({ score: 0, label: '', color: '' });

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
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
    {
      username: {
        required: 'Username is required',
        minLength: {
          value: 3,
          message: 'Username must be at least 3 characters',
        },
        maxLength: {
          value: 20,
          message: 'Username must not exceed 20 characters',
        },
        pattern: {
          value: /^[a-zA-Z0-9_-]+$/,
          message: 'Username can only contain letters, numbers, underscores, and hyphens',
        },
        custom: async (value) => {
          if (value.length < 3) return null;

          await new Promise(resolve => setTimeout(resolve, 500));

          const takenUsernames = ['admin', 'test', 'user'];
          if (takenUsernames.includes(value.toLowerCase())) {
            return 'This username is already taken';
          }
          return null;
        },
      },
      email: {
        required: 'Email address is required',
        email: 'Please enter a valid email address',
        custom: async (value) => {
          if (!value || !value.includes('@')) return null;

          await new Promise(resolve => setTimeout(resolve, 500));

          const takenEmails = ['test@example.com', 'admin@example.com'];
          if (takenEmails.includes(value.toLowerCase())) {
            return 'An account with this email already exists';
          }
          return null;
        },
      },
      password: {
        required: 'Password is required',
        minLength: {
          value: 8,
          message: 'Password must be at least 8 characters',
        },
        custom: (value) => {
          if (!value || value.length < 8) return null;

          const hasUpperCase = /[A-Z]/.test(value);
          const hasLowerCase = /[a-z]/.test(value);
          const hasNumber = /\d/.test(value);
          const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

          const missingRequirements = [];
          if (!hasUpperCase) missingRequirements.push('uppercase letter');
          if (!hasLowerCase) missingRequirements.push('lowercase letter');
          if (!hasNumber) missingRequirements.push('number');
          if (!hasSpecialChar) missingRequirements.push('special character');

          if (missingRequirements.length > 0) {
            return `Password must include: ${missingRequirements.join(', ')}`;
          }

          return null;
        },
      },
      confirmPassword: {
        required: 'Please confirm your password',
        match: {
          field: 'password',
          message: 'Passwords do not match',
        },
      },
    },
    {
      validateOnChange: true,
      validateOnBlur: true,
      validateDebounceMs: 500,
    }
  );

  useEffect(() => {
    const password = values.password;
    if (!password) {
      setPasswordStrength({ score: 0, label: '', color: '' });
      return;
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

    const strengthLevels = [
      { score: 0, label: '', color: '' },
      { score: 1, label: 'Very Weak', color: 'bg-red-500' },
      { score: 2, label: 'Weak', color: 'bg-orange-500' },
      { score: 3, label: 'Fair', color: 'bg-yellow-500' },
      { score: 4, label: 'Strong', color: 'bg-blue-500' },
      { score: 5, label: 'Very Strong', color: 'bg-green-500' },
    ];

    setPasswordStrength(strengthLevels[score]);
  }, [values.password]);

  const onSubmit = async (formValues: Record<string, any>) => {
    console.log('Signup form submitted:', formValues);
    await new Promise((resolve) => setTimeout(resolve, 2000));
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

  const passwordRequirements = [
    { met: values.password.length >= 8, text: 'At least 8 characters' },
    { met: /[A-Z]/.test(values.password), text: 'One uppercase letter' },
    { met: /[a-z]/.test(values.password), text: 'One lowercase letter' },
    { met: /\d/.test(values.password), text: 'One number' },
    { met: /[!@#$%^&*(),.?":{}|<>]/.test(values.password), text: 'One special character' },
  ];

  return (
    <div className="max-w-md mx-auto p-6">
      <FormNotification
        type={submitSuccess ? 'success' : 'error'}
        message={
          submitSuccess
            ? 'Account created successfully! Welcome aboard!'
            : submitError || 'An error occurred'
        }
        show={showNotification}
        onClose={handleNotificationClose}
      />

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <UserPlus className="text-blue-600" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600">
            Join us today and start your journey
          </p>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6" noValidate>
          <FormField
            label="Username"
            name="username"
            required
            placeholder="johndoe"
            helpText="3-20 characters, letters, numbers, - and _ only"
            autoComplete="username"
            {...getFieldProps('username')}
          />

          <FormField
            label="Email Address"
            name="email"
            type="email"
            required
            placeholder="john@example.com"
            helpText="We'll send a verification email to this address"
            autoComplete="email"
            {...getFieldProps('email')}
          />

          <div>
            <FormField
              label="Password"
              name="password"
              type="password"
              required
              placeholder="Enter a strong password"
              autoComplete="new-password"
              {...getFieldProps('password')}
            />

            {values.password && (
              <div className="mt-3 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Password Strength:
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        passwordStrength.score >= 4
                          ? 'text-green-600'
                          : passwordStrength.score >= 3
                          ? 'text-blue-600'
                          : 'text-orange-600'
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield size={16} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Password Requirements:
                    </span>
                  </div>
                  <div className="space-y-2">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                            req.met
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                          }`}
                        >
                          {req.met && <Check size={12} className="text-white" />}
                        </div>
                        <span
                          className={`text-sm ${
                            req.met ? 'text-green-700 font-medium' : 'text-gray-600'
                          }`}
                        >
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <FormField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            required
            placeholder="Re-enter your password"
            helpText="Must match the password above"
            autoComplete="new-password"
            {...getFieldProps('confirmPassword')}
          />

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-gray-600">
              {isFormDirty && !isFormValid && (
                <span className="text-amber-600">
                  Please complete all fields
                </span>
              )}
              {isFormValid && isFormDirty && (
                <span className="text-green-600 flex items-center gap-1">
                  <Check size={16} />
                  Ready to sign up!
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isFormValid || !isFormDirty}
            className={`
              w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold
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
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus size={20} />
                Create Account
              </>
            )}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

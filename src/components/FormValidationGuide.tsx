export function FormValidationGuide() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Form Validation System Guide
        </h1>
        <p className="text-lg text-gray-600">
          A comprehensive user-friendly form validation implementation designed to reduce
          form abandonment and user frustration.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Key Features
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              title: 'Real-time Validation',
              description: 'Validates as users type with configurable debouncing',
            },
            {
              title: 'Inline Error Messages',
              description: 'Clear, contextual feedback right next to each field',
            },
            {
              title: 'Visual State Indicators',
              description: 'Icons and colors show validation status at a glance',
            },
            {
              title: 'Error Prevention',
              description: 'Disabled submit button until form is valid',
            },
            {
              title: 'Success Confirmation',
              description: 'Toast notifications confirm successful submissions',
            },
            {
              title: 'Progressive Enhancement',
              description: 'Validates on blur, then on change after first touch',
            },
            {
              title: 'Async Validation',
              description: 'Check username/email availability in real-time',
            },
            {
              title: 'Password Strength Meter',
              description: 'Visual feedback on password quality',
            },
          ].map((feature, index) => (
            <div key={index} className="border-2 border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Validation Strategies
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              1. Inline Validation
            </h3>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="text-gray-700 mb-2">
                <strong>What:</strong> Validates fields as users interact with them
              </p>
              <p className="text-gray-700 mb-2">
                <strong>When:</strong> On blur (leaving field) and on change (after first blur)
              </p>
              <p className="text-gray-700">
                <strong>Why:</strong> Provides immediate feedback without being intrusive
              </p>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <strong>Implementation:</strong>
              <pre className="bg-gray-100 p-3 rounded mt-2 overflow-x-auto">
{`const { getFieldProps } = useFormValidation(
  initialValues,
  validationRules,
  {
    validateOnChange: true,  // Validate as user types
    validateOnBlur: true,     // Validate when field loses focus
    validateDebounceMs: 300   // Wait 300ms after typing stops
  }
);`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              2. Error Prevention
            </h3>
            <div className="bg-green-50 border-l-4 border-green-500 p-4">
              <p className="text-gray-700 mb-2">
                <strong>What:</strong> Prevents form submission until all validations pass
              </p>
              <p className="text-gray-700 mb-2">
                <strong>How:</strong> Disabled submit button + clear messaging
              </p>
              <p className="text-gray-700">
                <strong>Why:</strong> Prevents wasted server requests and user frustration
              </p>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <strong>Best Practices:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Disable submit button when form is invalid</li>
                <li>Show clear message about what needs fixing</li>
                <li>Keep submit button visible (don't hide it)</li>
                <li>Use visual cues (color, opacity) for disabled state</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              3. Helpful Error Messages
            </h3>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
              <p className="text-gray-700 mb-2">
                <strong>What:</strong> Clear, actionable error messages
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Examples:</strong>
              </p>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>❌ "Invalid email" → ✅ "Please enter a valid email address (e.g., name@company.com)"</li>
                <li>❌ "Too short" → ✅ "Password must be at least 8 characters"</li>
                <li>❌ "Error" → ✅ "This username is already taken"</li>
              </ul>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <strong>Writing Good Error Messages:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Be specific about what's wrong</li>
                <li>Provide examples of valid input</li>
                <li>Use friendly, non-technical language</li>
                <li>Avoid blame ("You entered..." vs "Please enter...")</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              4. Success Confirmation
            </h3>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
              <p className="text-gray-700 mb-2">
                <strong>What:</strong> Clear feedback when form submits successfully
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Types:</strong> Toast notifications, inline messages, page redirects
              </p>
              <p className="text-gray-700">
                <strong>Why:</strong> Confirms action completed and builds trust
              </p>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <strong>Best Practices:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Show success message immediately after submission</li>
                <li>Use positive language and colors (green)</li>
                <li>Provide next steps or confirmation details</li>
                <li>Auto-hide after a few seconds (with progress bar)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Available Validation Rules
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Rule</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Purpose</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                {
                  rule: 'required',
                  purpose: 'Field cannot be empty',
                  example: "required: 'This field is required'",
                },
                {
                  rule: 'email',
                  purpose: 'Valid email format',
                  example: "email: 'Please enter a valid email'",
                },
                {
                  rule: 'minLength',
                  purpose: 'Minimum character count',
                  example: "minLength: { value: 8, message: '...' }",
                },
                {
                  rule: 'maxLength',
                  purpose: 'Maximum character count',
                  example: "maxLength: { value: 100, message: '...' }",
                },
                {
                  rule: 'pattern',
                  purpose: 'Must match regex pattern',
                  example: "pattern: { value: /^[A-Z]/, message: '...' }",
                },
                {
                  rule: 'min/max',
                  purpose: 'Number range validation',
                  example: "min: { value: 18, message: 'Must be 18+' }",
                },
                {
                  rule: 'match',
                  purpose: 'Must match another field',
                  example: "match: { field: 'password', message: '...' }",
                },
                {
                  rule: 'custom',
                  purpose: 'Custom validation logic',
                  example: 'custom: (value) => { /* logic */ }',
                },
              ].map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-blue-600">{row.rule}</td>
                  <td className="px-4 py-3 text-gray-700">{row.purpose}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{row.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Quick Start Example
        </h2>
        <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto text-sm">
{`import { useFormValidation } from './hooks/useFormValidation';
import { FormField } from './components/FormField';

function MyForm() {
  const { values, handleSubmit, getFieldProps } = useFormValidation(
    { email: '', password: '' },  // Initial values
    {
      email: {
        required: 'Email is required',
        email: 'Please enter a valid email'
      },
      password: {
        required: 'Password is required',
        minLength: { value: 8, message: 'At least 8 characters' }
      }
    }
  );

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(async (values) => {
        // Submit form data
        console.log(values);
      });
    }}>
      <FormField
        label="Email"
        name="email"
        type="email"
        {...getFieldProps('email')}
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        {...getFieldProps('password')}
      />
      <button type="submit">Submit</button>
    </form>
  );
}`}
        </pre>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">
          UX Benefits
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Reduces Form Abandonment</h3>
            <ul className="space-y-2 text-blue-100">
              <li>• Clear expectations upfront</li>
              <li>• Immediate feedback prevents errors</li>
              <li>• Progress indicators show completion</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Reduces User Frustration</h3>
            <ul className="space-y-2 text-blue-100">
              <li>• No surprise errors on submit</li>
              <li>• Helpful, not judgmental messages</li>
              <li>• Visual confirmation of success</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

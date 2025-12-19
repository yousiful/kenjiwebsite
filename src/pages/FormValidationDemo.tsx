import { useState } from 'react';
import { ExampleContactForm } from '../components/ExampleContactForm';
import { ExampleSignupForm } from '../components/ExampleSignupForm';
import { FormValidationGuide } from '../components/FormValidationGuide';
import { FileText, UserPlus, BookOpen } from 'lucide-react';

type Tab = 'contact' | 'signup' | 'guide';

export function FormValidationDemo() {
  const [activeTab, setActiveTab] = useState<Tab>('contact');

  const tabs = [
    { id: 'contact' as Tab, label: 'Contact Form', icon: FileText },
    { id: 'signup' as Tab, label: 'Signup Form', icon: UserPlus },
    { id: 'guide' as Tab, label: 'Documentation', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Form Validation System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive, user-friendly form validation implementation designed to reduce
            form abandonment and user frustration through clear feedback and smart error prevention.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-lg font-semibold
                  transition-all duration-200 transform hover:scale-105
                  ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                  }
                `}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mb-8">
          {activeTab === 'contact' && (
            <div className="animate-fadeIn">
              <ExampleContactForm />
            </div>
          )}
          {activeTab === 'signup' && (
            <div className="animate-fadeIn">
              <ExampleSignupForm />
            </div>
          )}
          {activeTab === 'guide' && (
            <div className="animate-fadeIn">
              <FormValidationGuide />
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Implementation Highlights
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Real-time Feedback</h3>
              <p className="text-sm text-gray-600">
                Validates as you type with smart debouncing to avoid annoying users while typing
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Visual Indicators</h3>
              <p className="text-sm text-gray-600">
                Icons, colors, and animations provide instant visual feedback on field validity
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Error Prevention</h3>
              <p className="text-sm text-gray-600">
                Submit button disabled until form is valid, preventing wasted requests
              </p>
            </div>
            <div className="border-l-4 border-amber-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Helpful Messages</h3>
              <p className="text-sm text-gray-600">
                Clear, actionable error messages explain exactly what needs to be fixed
              </p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Async Validation</h3>
              <p className="text-sm text-gray-600">
                Check username availability and email existence in real-time
              </p>
            </div>
            <div className="border-l-4 border-cyan-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Success Feedback</h3>
              <p className="text-sm text-gray-600">
                Toast notifications confirm successful submissions with auto-hide
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

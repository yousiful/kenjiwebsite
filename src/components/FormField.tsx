import { useState } from 'react';
import { Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, Info } from 'lucide-react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number' | 'textarea' | 'select';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onBlur: () => void;
  error?: string | null;
  touched?: boolean;
  validating?: boolean;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  options?: { value: string; label: string }[];
  autoComplete?: string;
  disabled?: boolean;
  maxLength?: number;
  rows?: number;
  showCharacterCount?: boolean;
}

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  touched,
  validating,
  required,
  placeholder,
  helpText,
  options,
  autoComplete,
  disabled,
  maxLength,
  rows = 4,
  showCharacterCount,
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isValid = touched && !error && value && !validating;
  const hasError = touched && error;

  const inputClasses = `
    w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${hasError
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
      : isValid
      ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
      : isFocused
      ? 'border-blue-400 focus:border-blue-500 focus:ring-blue-200'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
    }
  `;

  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <div className="relative">
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={(e) => {
              onBlur();
              setIsFocused(false);
            }}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            rows={rows}
            className={`${inputClasses} resize-none`}
          />
          {showCharacterCount && maxLength && (
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              {value.length}/{maxLength}
            </div>
          )}
        </div>
      );
    }

    if (type === 'select' && options) {
      return (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            onBlur();
            setIsFocused(false);
          }}
          onFocus={() => setIsFocused(true)}
          disabled={disabled}
          className={inputClasses}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (type === 'password') {
      return (
        <div className="relative">
          <input
            id={name}
            name={name}
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={onChange}
            onBlur={(e) => {
              onBlur();
              setIsFocused(false);
            }}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            autoComplete={autoComplete}
            disabled={disabled}
            maxLength={maxLength}
            className={`${inputClasses} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      );
    }

    return (
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={(e) => {
          onBlur();
          setIsFocused(false);
        }}
        onFocus={() => setIsFocused(true)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        maxLength={maxLength}
        className={inputClasses}
      />
    );
  };

  return (
    <div className="w-full">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        {renderInput()}

        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {validating && <Loader2 size={20} className="text-blue-500 animate-spin" />}
          {isValid && <CheckCircle2 size={20} className="text-green-500" />}
          {hasError && <AlertCircle size={20} className="text-red-500" />}
        </div>
      </div>

      {helpText && !hasError && !isValid && (
        <div className="flex items-start gap-1.5 mt-1.5 text-sm text-gray-600">
          <Info size={16} className="mt-0.5 flex-shrink-0" />
          <p>{helpText}</p>
        </div>
      )}

      {hasError && (
        <div className="flex items-start gap-1.5 mt-1.5">
          <div className="bg-red-50 border border-red-200 rounded-md px-3 py-2 w-full">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {isValid && (
        <div className="flex items-start gap-1.5 mt-1.5">
          <div className="bg-green-50 border border-green-200 rounded-md px-3 py-2 w-full">
            <p className="text-sm text-green-700">Looks good!</p>
          </div>
        </div>
      )}
    </div>
  );
}

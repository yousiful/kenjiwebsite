import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownOption {
  id: string;
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

interface AccessibleDropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  error?: string;
}

const AccessibleDropdown: React.FC<AccessibleDropdownProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select an option',
  helpText,
  required = false,
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const selectedOption = options.find(opt => opt.value === value);
  const filteredOptions = options.filter(opt => !opt.disabled);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      const selectedIndex = filteredOptions.findIndex(opt => opt.value === value);
      setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }
  };

  const handleSelect = (option: DropdownOption) => {
    if (!option.disabled) {
      onChange(option.value);
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        buttonRef.current?.focus();
        break;

      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;

      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;

      case 'End':
        e.preventDefault();
        setFocusedIndex(filteredOptions.length - 1);
        break;

      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0) {
          handleSelect(filteredOptions[focusedIndex]);
        }
        break;

      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          setSearchQuery(prev => prev + e.key);

          if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
          }

          searchTimeoutRef.current = setTimeout(() => {
            setSearchQuery('');
          }, 1000);

          const matchIndex = filteredOptions.findIndex(opt =>
            opt.label.toLowerCase().startsWith(searchQuery.toLowerCase() + e.key.toLowerCase())
          );

          if (matchIndex >= 0) {
            setFocusedIndex(matchIndex);
          }
        }
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && listboxRef.current) {
      const focusedElement = listboxRef.current.children[focusedIndex] as HTMLElement;
      focusedElement?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [focusedIndex, isOpen]);

  const labelId = `dropdown-label-${label.replace(/\s/g, '-').toLowerCase()}`;
  const listboxId = `dropdown-listbox-${label.replace(/\s/g, '-').toLowerCase()}`;
  const helpTextId = helpText ? `dropdown-help-${label.replace(/\s/g, '-').toLowerCase()}` : undefined;
  const errorId = error ? `dropdown-error-${label.replace(/\s/g, '-').toLowerCase()}` : undefined;

  return (
    <div ref={dropdownRef} className="relative w-full">
      <label
        id={labelId}
        className="block text-sm font-medium text-gray-300 mb-2"
      >
        {label}
        {required && <span className="text-red-400 ml-1" aria-label="required">*</span>}
      </label>

      {helpText && (
        <p id={helpTextId} className="text-sm text-gray-400 mb-2">
          {helpText}
        </p>
      )}

      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={`w-full flex items-center justify-between gap-2 bg-gray-800 text-white px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
          error
            ? 'border-red-500 hover:border-red-400'
            : 'border-gray-700 hover:border-gray-600'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={labelId}
        aria-describedby={[helpTextId, errorId].filter(Boolean).join(' ') || undefined}
        aria-required={required}
        aria-invalid={!!error}
      >
        <span className={selectedOption ? 'text-white' : 'text-gray-400'}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {error && (
        <p id={errorId} className="mt-2 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      {isOpen && (
        <ul
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={labelId}
          aria-activedescendant={
            focusedIndex >= 0 ? `option-${filteredOptions[focusedIndex].id}` : undefined
          }
          className="absolute z-50 w-full mt-2 bg-gray-800 border-2 border-gray-700 rounded-lg shadow-xl max-h-60 overflow-auto"
          tabIndex={-1}
        >
          {filteredOptions.length === 0 ? (
            <li className="px-4 py-3 text-gray-400 text-center">
              No options available
            </li>
          ) : (
            filteredOptions.map((option, index) => (
              <li
                key={option.id}
                id={`option-${option.id}`}
                role="option"
                aria-selected={option.value === value}
                aria-disabled={option.disabled}
                onClick={() => handleSelect(option)}
                className={`px-4 py-3 cursor-pointer transition-colors ${
                  index === focusedIndex
                    ? 'bg-blue-600 text-white'
                    : option.value === value
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                } ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <div className="font-medium">{option.label}</div>
                    {option.description && (
                      <div className="text-sm opacity-80">{option.description}</div>
                    )}
                  </div>
                  {option.value === value && (
                    <Check className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      )}

      {isOpen && (
        <div className="sr-only" role="status" aria-live="polite">
          {filteredOptions.length} options available.
          {focusedIndex >= 0 && ` Focused on ${filteredOptions[focusedIndex].label}.`}
        </div>
      )}
    </div>
  );
};

export default AccessibleDropdown;

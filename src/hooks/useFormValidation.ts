import { useState, useCallback, useEffect } from 'react';

export interface ValidationRule {
  required?: boolean | string;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  custom?: (value: any) => string | null;
  email?: boolean | string;
  url?: boolean | string;
  min?: { value: number; message: string };
  max?: { value: number; message: string };
  match?: { field: string; message: string };
}

export interface FormField {
  value: any;
  error: string | null;
  touched: boolean;
  dirty: boolean;
  validating: boolean;
}

export interface FormState {
  [key: string]: FormField;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface UseFormValidationOptions {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateDebounceMs?: number;
}

export function useFormValidation(
  initialValues: Record<string, any>,
  validationRules: ValidationRules,
  options: UseFormValidationOptions = {}
) {
  const {
    validateOnChange = true,
    validateOnBlur = true,
    validateDebounceMs = 300,
  } = options;

  const [formState, setFormState] = useState<FormState>(() => {
    const state: FormState = {};
    Object.keys(initialValues).forEach((key) => {
      state[key] = {
        value: initialValues[key],
        error: null,
        touched: false,
        dirty: false,
        validating: false,
      };
    });
    return state;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateField = useCallback(
    (fieldName: string, value: any, allValues: Record<string, any>): string | null => {
      const rules = validationRules[fieldName];
      if (!rules) return null;

      if (rules.required) {
        const isEmpty = value === '' || value === null || value === undefined ||
                       (Array.isArray(value) && value.length === 0);
        if (isEmpty) {
          return typeof rules.required === 'string'
            ? rules.required
            : 'This field is required';
        }
      }

      if (value === '' || value === null || value === undefined) {
        return null;
      }

      if (rules.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return typeof rules.email === 'string'
            ? rules.email
            : 'Please enter a valid email address';
        }
      }

      if (rules.url) {
        try {
          new URL(value);
        } catch {
          return typeof rules.url === 'string'
            ? rules.url
            : 'Please enter a valid URL';
        }
      }

      if (rules.minLength && value.length < rules.minLength.value) {
        return rules.minLength.message;
      }

      if (rules.maxLength && value.length > rules.maxLength.value) {
        return rules.maxLength.message;
      }

      if (rules.min && Number(value) < rules.min.value) {
        return rules.min.message;
      }

      if (rules.max && Number(value) > rules.max.value) {
        return rules.max.message;
      }

      if (rules.pattern && !rules.pattern.value.test(value)) {
        return rules.pattern.message;
      }

      if (rules.match) {
        if (value !== allValues[rules.match.field]) {
          return rules.match.message;
        }
      }

      if (rules.custom) {
        const customError = rules.custom(value);
        if (customError) return customError;
      }

      return null;
    },
    [validationRules]
  );

  const getAllValues = useCallback(() => {
    const values: Record<string, any> = {};
    Object.keys(formState).forEach((key) => {
      values[key] = formState[key].value;
    });
    return values;
  }, [formState]);

  const validateAllFields = useCallback((): boolean => {
    const allValues = getAllValues();
    let isValid = true;
    const newState = { ...formState };

    Object.keys(formState).forEach((fieldName) => {
      const error = validateField(fieldName, formState[fieldName].value, allValues);
      newState[fieldName] = {
        ...newState[fieldName],
        error,
        touched: true,
      };
      if (error) isValid = false;
    });

    setFormState(newState);
    return isValid;
  }, [formState, validateField, getAllValues]);

  const handleChange = useCallback(
    (fieldName: string, value: any) => {
      setFormState((prev) => {
        const newState = {
          ...prev,
          [fieldName]: {
            ...prev[fieldName],
            value,
            dirty: true,
            validating: validateOnChange && validateDebounceMs > 0,
          },
        };

        if (validateOnChange && validateDebounceMs === 0) {
          const allValues = { ...getAllValues(), [fieldName]: value };
          const error = validateField(fieldName, value, allValues);
          newState[fieldName].error = error;
          newState[fieldName].validating = false;
        }

        return newState;
      });

      if (validateOnChange && validateDebounceMs > 0) {
        const timeoutId = setTimeout(() => {
          setFormState((prev) => {
            const allValues = { ...getAllValues(), [fieldName]: value };
            const error = validateField(fieldName, value, allValues);
            return {
              ...prev,
              [fieldName]: {
                ...prev[fieldName],
                error,
                validating: false,
              },
            };
          });
        }, validateDebounceMs);

        return () => clearTimeout(timeoutId);
      }
    },
    [validateOnChange, validateDebounceMs, validateField, getAllValues]
  );

  const handleBlur = useCallback(
    (fieldName: string) => {
      setFormState((prev) => {
        const field = prev[fieldName];
        if (!field.touched && validateOnBlur) {
          const allValues = getAllValues();
          const error = validateField(fieldName, field.value, allValues);
          return {
            ...prev,
            [fieldName]: {
              ...field,
              touched: true,
              error,
            },
          };
        }
        return {
          ...prev,
          [fieldName]: {
            ...field,
            touched: true,
          },
        };
      });
    },
    [validateOnBlur, validateField, getAllValues]
  );

  const handleSubmit = useCallback(
    async (onSubmit: (values: Record<string, any>) => Promise<void>) => {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      const isValid = validateAllFields();

      if (!isValid) {
        setIsSubmitting(false);
        return;
      }

      try {
        const values = getAllValues();
        await onSubmit(values);
        setSubmitSuccess(true);
        setSubmitError(null);
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : 'An error occurred. Please try again.'
        );
        setSubmitSuccess(false);
      } finally {
        setIsSubmitting(false);
      }
    },
    [validateAllFields, getAllValues]
  );

  const resetForm = useCallback(() => {
    const state: FormState = {};
    Object.keys(initialValues).forEach((key) => {
      state[key] = {
        value: initialValues[key],
        error: null,
        touched: false,
        dirty: false,
        validating: false,
      };
    });
    setFormState(state);
    setIsSubmitting(false);
    setSubmitError(null);
    setSubmitSuccess(false);
  }, [initialValues]);

  const setFieldValue = useCallback((fieldName: string, value: any) => {
    handleChange(fieldName, value);
  }, [handleChange]);

  const setFieldError = useCallback((fieldName: string, error: string | null) => {
    setFormState((prev) => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        error,
      },
    }));
  }, []);

  const getFieldProps = useCallback(
    (fieldName: string) => ({
      value: formState[fieldName]?.value || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        handleChange(fieldName, e.target.value),
      onBlur: () => handleBlur(fieldName),
      error: formState[fieldName]?.error,
      touched: formState[fieldName]?.touched,
      validating: formState[fieldName]?.validating,
    }),
    [formState, handleChange, handleBlur]
  );

  const isFormValid = Object.values(formState).every((field) => !field.error);
  const isFormDirty = Object.values(formState).some((field) => field.dirty);

  return {
    formState,
    values: getAllValues(),
    isSubmitting,
    submitError,
    submitSuccess,
    isFormValid,
    isFormDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    getFieldProps,
    validateAllFields,
  };
}

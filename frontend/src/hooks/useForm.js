import { useState } from 'react';

export function useForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues(current => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(current => ({ ...current, [name]: null }));
    }
  };

  const setFieldError = (field, error) => {
    setErrors(current => ({ ...current, [field]: error }));
  };

  const setFormErrors = (newErrors) => {
    setErrors(newErrors);
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    handleChange,
    setFieldError,
    setFormErrors,
    resetForm,
    setValues,
  };
}
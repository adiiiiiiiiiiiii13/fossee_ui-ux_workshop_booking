import { useState, useCallback } from 'react';
import { getErrorMessage } from '../services/api';

export function useAsync() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = useCallback(async (asyncFunction, errorMsg = 'Operation failed') => {
    setLoading(true);
    setError('');
    
    try {
      const result = await asyncFunction();
      return result;
    } catch (err) {
      const message = getErrorMessage(err, errorMsg);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = () => setError('');

  return { loading, error, execute, clearError };
}
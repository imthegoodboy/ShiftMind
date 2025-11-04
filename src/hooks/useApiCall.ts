import { useState, useCallback } from 'react';

interface UseApiCallProps<T> {
  errorMessage?: string;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useApiCall<T>({ 
  errorMessage = 'An error occurred',
  onSuccess,
  onError 
}: UseApiCallProps<T> = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (promise: Promise<T>) => {
    setLoading(true);
    setError(null);

    try {
      const data = await promise;
      onSuccess?.(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(errorMessage);
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [errorMessage, onSuccess, onError]);

  return {
    loading,
    error,
    execute
  };
}

export default useApiCall;
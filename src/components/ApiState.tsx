import React from 'react';

interface ApiStateProps {
  loading: boolean;
  error: Error | null;
  children: React.ReactNode;
}

const ApiState: React.FC<ApiStateProps> = ({ loading, error, children }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-50 border border-red-200">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
        <p className="text-red-600">{error.message}</p>
        {error.message.toLowerCase().includes('failed to fetch') && (
          <div className="mt-4 text-sm text-gray-600">
            <p>This could be due to:</p>
            <ul className="list-disc ml-5 mt-2">
              <li>No internet connection</li>
              <li>API service is down</li>
              <li>CORS configuration issue</li>
            </ul>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
};

export default ApiState;
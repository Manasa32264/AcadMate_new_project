import React from 'react';

const ProtectedRoute = ({ children, isAuthenticated, onLoginRequired }) => {
  // If user is not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen custom-beige flex items-center justify-center">
        <div className="text-center p-8 max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-accent">
            <div className="mb-6">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold custom-brown mb-2">Authentication Required</h2>
              <p className="text-gray-600 mb-6">
                You need to login or register to access this page.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={onLoginRequired}
                className="w-full px-6 py-3 bg-accent text-brown font-semibold rounded-lg hover:bg-yellow-500 transition-colors duration-200 shadow-md"
              >
                Login / Register
              </button>
              
              <p className="text-sm text-gray-500 mt-4">
                Don't have an account? Click the button above to register!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated, render the protected content
  return children;
};

export default ProtectedRoute;

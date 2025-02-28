import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { AlertCircle, ArrowRight, Lock, Mail, Shield, X } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { db } from '../data/firebase';

const LoginScreen = ({ onLoginSuccess, darkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Verify we have a token before proceeding
      const token = await user.getIdToken();
      if (!token) {
        throw new Error("Failed to get auth token");
      }
      
      // Check if the user has pol_admin role
      const usersCollection = collection(db, 'users');
      const adminQuery = query(
        usersCollection, 
        where('email', '==', email.toLowerCase()),
        where('user_type', '==', 'pol_admin')
      );
      const adminSnapshot = await getDocs(adminQuery);
      
      if (adminSnapshot.empty) {
        // Not an admin, sign out and show error
        await auth.signOut();
        toast.error("Access denied: Admin privileges required");
        setError("Access denied. Only administrators can access this application.");
        setLoading(false);
        return;
      }
      
      console.log("Authentication successful - Admin access granted");
      toast.success("Admin login successful");
      onLoginSuccess(user);
    } catch (error) {
      console.error("Login error:", error);
      
      // Provide user-friendly error messages
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-email' || error.code === 'auth/wrong-password') {
        setError("Invalid email or password. Please try again.");
      } else if (error.code === 'auth/user-not-found') {
        setError("No account found with this email. Please check your email or sign up.");
      } else if (error.code === 'auth/too-many-requests') {
        setError("Too many unsuccessful login attempts. Please try again later or reset your password.");
      } else {
        setError(`Login failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setResetEmail(email); // Pre-fill with login email if available
    setResetSent(false);
    setResetError(null);
    setShowResetPopup(true);
  };

  const handleClosePopup = () => {
    setShowResetPopup(false);
    setResetSent(false);
    setResetError(null);
  };

  const handleSendReset = async () => {
    if (!resetEmail.trim()) {
      setResetError('Please enter your email address');
      return;
    }

    setResetLoading(true);
    setResetError(null);

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSent(true);
      toast.success("Password reset email sent");
      console.log(`Password reset email sent to: ${resetEmail}`);
    } catch (error) {
      console.error("Password reset error:", error);
      
      if (error.code === 'auth/user-not-found') {
        setResetError("No account found with this email address.");
      } else if (error.code === 'auth/invalid-email') {
        setResetError("Please enter a valid email address.");
      } else if (error.code === 'auth/too-many-requests') {
        setResetError("Too many requests. Please try again later.");
      } else {
        setResetError(`Failed to send reset email: ${error.message}`);
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`max-w-md w-full mx-auto rounded-xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="p-8">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${darkMode ? 'bg-purple-900/20' : 'bg-purple-50'} mb-4`}>
              <Shield className={`w-8 h-8 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Admin Access
            </h2>
            <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Please sign in with your administrator credentials
            </p>
          </div>
          
          {error && (
            <div className={`mb-6 p-3 rounded-lg flex items-start gap-3 ${darkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-600'}`}>
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email Address
                </label>
                <div className={`relative rounded-md shadow-sm`}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-2.5 rounded-md text-sm focus:outline-none focus:ring-2 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500' 
                        : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                    }`}
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Password
                </label>
                <div className={`relative rounded-md shadow-sm`}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-2.5 rounded-md text-sm focus:outline-none focus:ring-2 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500' 
                        : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                    }`}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="mt-1.5 flex justify-end">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className={`text-xs font-medium ${darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'}`}
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                    ${loading 
                      ? `${darkMode ? 'bg-purple-800' : 'bg-purple-400'} cursor-not-allowed` 
                      : `${darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-600 hover:bg-purple-700'}`
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Sign in as Admin
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Password Reset Popup */}
      {showResetPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`relative max-w-md w-full rounded-lg shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <button 
              onClick={handleClosePopup}
              className={`absolute top-3 right-3 p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </button>
            
            <div className="text-center mb-6">
              <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Reset Your Password
              </h3>
              {!resetSent && (
                <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              )}
            </div>
            
            {resetSent ? (
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-900/20 text-green-300' : 'bg-green-50 text-green-600'}`}>
                <p className="text-sm font-medium">Password reset email sent!</p>
                <p className="text-sm mt-1">Check your inbox at <span className="font-semibold">{resetEmail}</span> for instructions.</p>
                <div className="mt-4">
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    For development purposes, the reset link would typically be sent to your email. 
                    In a real application, you would check your inbox for this link.
                  </p>
                </div>
                <button
                  onClick={handleClosePopup}
                  className={`mt-4 w-full py-2 px-4 rounded-md text-sm font-medium ${
                    darkMode 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                {resetError && (
                  <div className={`mb-4 p-3 rounded-lg flex items-start gap-3 ${darkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-600'}`}>
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{resetError}</span>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="resetEmail" className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email Address
                    </label>
                    <div className={`relative rounded-md shadow-sm`}>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      </div>
                      <input
                        type="email"
                        id="resetEmail"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className={`block w-full pl-10 pr-3 py-2.5 rounded-md text-sm focus:outline-none focus:ring-2 ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500' 
                            : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                        }`}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSendReset}
                    disabled={resetLoading}
                    className={`w-full flex items-center justify-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                      ${resetLoading 
                        ? `${darkMode ? 'bg-purple-800' : 'bg-purple-400'} cursor-not-allowed` 
                        : `${darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-600 hover:bg-purple-700'}`
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
                  >
                    {resetLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : 'Send Reset Link'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginScreen;
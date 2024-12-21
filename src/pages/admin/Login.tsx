import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../../api/auth';
import { checkConnection } from '../../lib/database/connection';
import { supabase } from '../../lib/supabase';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  async function init() {
    try {
      const isOnline = await checkConnection();
      if (!isOnline) {
        setConnectionError('Unable to connect to server');
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        navigate('/admin');
        return;
      }

      setConnectionError(null);
    } catch (error) {
      console.error('Setup error:', error);
      setConnectionError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    init();
  }, [navigate]);

  const handleRetry = async () => {
    setConnectionError(null);
    init();
  };

  if (connectionError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Connection Error</h2>
            <p className="text-gray-600 mb-6">{connectionError}</p>
            <button
              onClick={handleRetry}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const trimmedEmail = email.trim();
      if (!trimmedEmail || !password) {
        setError('Please enter both email and password');
        return;
      }

      setLoading(true);
      setError(null);
      const { session } = await signIn(trimmedEmail, password);
      if (session) {
        navigate('/admin');
      } else {
        throw new Error('Failed to create session');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid email or password';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Apristo Admin
          </h2>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center mt-4">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
}
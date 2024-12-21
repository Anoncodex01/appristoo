import React, { useState, useEffect, useCallback } from 'react';
import { getCurrentUser } from '../api/auth';
import { checkConnection, getConnectionStatus } from '../lib/database/connection';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false); // Added state for retrying
  const maxRetries = 3;

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setIsRetrying(true); // Set retry state

      // Check connection first
      const isConnected = await checkConnection();
      if (!isConnected) {
        if (retryAttempts < maxRetries) {
          setRetryAttempts(prev => prev + 1);
          throw new Error('Connection failed, retrying...');
        }
        throw new Error('Unable to connect to server');
      }

      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setRetryAttempts(0); // Reset retry count on success
    } catch (err) {
      console.error('Error loading user:', err);
      setError(err instanceof Error ? err.message : 'Failed to load user');
      setUser(null);
    } finally {
      setLoading(false);
      setIsRetrying(false); // Reset retry state
    }
  }, [retryAttempts]);

  // Initial load
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Periodic connection check
  useEffect(() => {
    const checkServerConnection = async () => {
      const isConnected = await checkConnection();
      if (!isConnected && getConnectionStatus()) {
        setError('Connection lost. Retrying...');
        loadUser(); // Trigger user reload if connection is lost
      }
    };

    const interval = setInterval(checkServerConnection, 30000);
    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [loadUser]);

  return {
    user,
    loading,
    error,
    reload: loadUser,
    retryAttempts,
    isRetrying, // Expose retry state so that the component can react
  };
}

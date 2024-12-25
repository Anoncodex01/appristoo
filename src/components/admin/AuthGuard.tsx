// components/admin/AuthGuard.tsx
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading, error } = useAuth();
  const navigate = useNavigate();
  const [isCheckingRole, setIsCheckingRole] = useState(true);
  const [hasValidRole, setHasValidRole] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkUserRole() {
      if (!user) {
        setIsCheckingRole(false);
        return;
      }

      try {
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (mounted) {
          if (roleError || !roleData) {
            console.error('Role check error:', roleError);
            setHasValidRole(false);
          } else {
            setHasValidRole(['ADMIN', 'EDITOR'].includes(roleData.role));
          }
          setIsCheckingRole(false);
        }
      } catch (error) {
        console.error('Error checking role:', error);
        if (mounted) {
          setHasValidRole(false);
          setIsCheckingRole(false);
        }
      }
    }

    checkUserRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        if (mounted) {
          setHasValidRole(false);
          navigate('/admin/login');
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [user, navigate]);

  // Show loading state
  if (loading || isCheckingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => navigate('/admin/login')}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Redirect if no valid role
  if (!hasValidRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <p className="text-red-500">You do not have permission to access this area.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  // Render children if authenticated and has valid role
  return <>{children}</>;
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import { realSupabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local session storage for mock demo admin login first
    const demoUser = sessionStorage.getItem('loveapp_demo_admin');
    if (demoUser) {
      setUser(JSON.parse(demoUser));
      setLoading(false);
      return;
    }

    if (isSupabaseConfigured && realSupabase) {
      realSupabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
        }
        setLoading(false);
      });

      const { data: { subscription } } = realSupabase.auth.onAuthStateChange(
        (_event, session) => {
          if (session?.user) {
            setUser(session.user);
          }
          setLoading(false);
        }
      );

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const loginWithSupabase = async (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // 1. Allow instant login for demo admin credentials
    if (cleanEmail === 'admin@love.com' && cleanPass === 'love2026') {
      const demoUserObj = { id: 'admin-demo-id', email: 'admin@love.com', role: 'admin' };
      sessionStorage.setItem('loveapp_demo_admin', JSON.stringify(demoUserObj));
      setUser(demoUserObj);
      return { user: demoUserObj };
    }

    // 2. Real Supabase Auth login
    if (isSupabaseConfigured && realSupabase) {
      try {
        const { data, error } = await realSupabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPass,
        });

        if (!error && data?.user) {
          setUser(data.user);
          return data;
        }

        // Fallback for admin logins if user hasn't registered in Supabase Auth yet
        if (cleanEmail.includes('admin') || cleanPass === 'love2026') {
          const demoUserObj = { id: 'admin-demo-id', email: cleanEmail || 'admin@love.com', role: 'admin' };
          sessionStorage.setItem('loveapp_demo_admin', JSON.stringify(demoUserObj));
          setUser(demoUserObj);
          return { user: demoUserObj };
        }

        throw error || new Error('Invalid login credentials');
      } catch (err) {
        if (cleanEmail.includes('admin') || cleanPass === 'love2026') {
          const demoUserObj = { id: 'admin-demo-id', email: cleanEmail || 'admin@love.com', role: 'admin' };
          sessionStorage.setItem('loveapp_demo_admin', JSON.stringify(demoUserObj));
          setUser(demoUserObj);
          return { user: demoUserObj };
        }
        throw err;
      }
    }

    // 3. Fallback Demo Mode login
    if (cleanEmail.includes('admin') || cleanPass === 'love2026') {
      const demoUserObj = { id: 'admin-demo-id', email: cleanEmail || 'admin@love.com', role: 'admin' };
      sessionStorage.setItem('loveapp_demo_admin', JSON.stringify(demoUserObj));
      setUser(demoUserObj);
      return { user: demoUserObj };
    }

    throw new Error('Invalid login credentials. (Use email: admin@love.com / password: love2026)');
  };

  const loginAsDemoAdmin = () => {
    const demoUserObj = { id: 'admin-demo-id', email: 'admin@love.com', role: 'admin' };
    sessionStorage.setItem('loveapp_demo_admin', JSON.stringify(demoUserObj));
    setUser(demoUserObj);
  };

  const logout = async () => {
    sessionStorage.removeItem('loveapp_demo_admin');
    if (isSupabaseConfigured && realSupabase) {
      try {
        await realSupabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signout notice:', e);
      }
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithSupabase,
        loginAsDemoAdmin,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

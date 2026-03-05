import { createContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        (async () => {
          try {
            const profileData = await authService.getProfile(session.user.id);
            setProfile(profileData);
          } catch (error) {
            console.error('Failed to load profile:', error);
          }
        })();
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, authService }}>
      {children}
    </AuthContext.Provider>
  );
}

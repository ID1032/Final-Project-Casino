import { signIn, signOut, useSession } from 'next-auth/react';

export const handleSignIn = () => signIn('google', { redirect: false });
export const handleSignOut = () => signOut();

// Client-side authentication utilities
export const useAuth = () => {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    isUnauthenticated: status === 'unauthenticated',
    session,
  };
};

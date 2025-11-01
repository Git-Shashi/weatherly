import React from 'react';
import { LogIn, LogOut, User } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../hooks/useAuth';

export const AuthButton = () => {
  const { user, isAuthenticated, signIn, signOut, loading } = useAuth();

  if (loading) {
    return (
      <Button variant="ghost" disabled>
        Loading...
      </Button>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <User className="w-6 h-6" />
          )}
          <span className="text-sm">{user?.displayName}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={signOut}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={signIn}
      className="flex items-center gap-2"
      size="sm"
    >
      <LogIn className="w-4 h-4" />
      <span>Sign in with Google</span>
    </Button>
  );
};

// src/hooks/useUser.js
import { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';

export function useUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    apiFetch('/auth/me')
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  return user;
}
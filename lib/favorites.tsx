'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (programId: string) => void;
  removeFavorite: (programId: string) => void;
  isFavorite: (programId: string) => boolean;
  toggleFavorite: (programId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEY = 'arivo-favorites';

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setFavorites(JSON.parse(stored));
        } catch {
          setFavorites([]);
        }
      }
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage when favorites change
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }
  }, [favorites, isInitialized]);

  const addFavorite = (programId: string) => {
    setFavorites((prev) => {
      if (prev.includes(programId)) return prev;
      return [...prev, programId];
    });
  };

  const removeFavorite = (programId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== programId));
  };

  const isFavorite = (programId: string) => {
    return favorites.includes(programId);
  };

  const toggleFavorite = (programId: string) => {
    if (isFavorite(programId)) {
      removeFavorite(programId);
    } else {
      addFavorite(programId);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}

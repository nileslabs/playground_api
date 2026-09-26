'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CountsContextType {
  counts: {
    users: number;
    posts: number;
    comments: number;
    todos: number;
  };
  isLoading: boolean;
  refreshCounts: () => void;
}

const defaultCounts = {
  users: 10,
  posts: 100,
  comments: 500,
  todos: 200,
};

const CountsContext = createContext<CountsContextType>({
  counts: defaultCounts,
  isLoading: false,
  refreshCounts: () => {},
});

export function CountsProvider({ children }: { children: React.ReactNode }) {
  const [counts, setCounts] = useState(defaultCounts);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCounts = () => {
    // Optionally fetch actual counts from /api/v1/counts
  };

  useEffect(() => {
    refreshCounts();
  }, []);

  return (
    <CountsContext.Provider value={{ counts, isLoading, refreshCounts }}>
      {children}
    </CountsContext.Provider>
  );
}

export function useCounts() {
  return useContext(CountsContext);
}

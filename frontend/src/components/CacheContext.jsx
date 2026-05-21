import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const CacheContext = createContext();

export function CacheProvider({ children }) {
  const [cache, setCache] = useState({});
  const inFlightRequests = useRef({});

  const getCachedData = useCallback((key) => {
    return cache[key]?.data;
  }, [cache]);

  const setCachedData = useCallback((key, data) => {
    setCache((prev) => ({
      ...prev,
      [key]: { data, timestamp: Date.now() },
    }));
  }, []);

  const clearCache = useCallback(() => {
    setCache({});
    inFlightRequests.current = {};
  }, []);

  const isCacheFresh = useCallback((key, maxAgeMs = 15000) => {
    const entry = cache[key];
    if (!entry) return false;
    return Date.now() - entry.timestamp < maxAgeMs;
  }, [cache]);

  const fetchWithCache = useCallback(async (key, fetchFn, maxAgeMs = 15000) => {
    // 1. If cache is fresh, return cached data immediately
    const entry = cache[key];
    if (entry && (Date.now() - entry.timestamp < maxAgeMs)) {
      return entry.data;
    }

    // 2. If there is already an in-flight request for this key, return that promise
    if (inFlightRequests.current[key]) {
      return inFlightRequests.current[key];
    }

    // 3. Otherwise, perform the fetch and track it
    const promise = (async () => {
      try {
        const response = await fetchFn();
        // Support both axios response objects and raw data
        let data = response && response.data !== undefined ? response.data : response;
        // Unpack DRF paginated results if present
        if (data && data.results !== undefined) {
          data = data.results;
        }
        setCache((prev) => ({
          ...prev,
          [key]: { data, timestamp: Date.now() },
        }));
        return data;
      } finally {
        delete inFlightRequests.current[key];
      }
    })();

    inFlightRequests.current[key] = promise;
    return promise;
  }, [cache]);

  return (
    <CacheContext.Provider value={{ 
      getCachedData, 
      setCachedData, 
      clearCache, 
      isCacheFresh, 
      fetchWithCache 
    }}>
      {children}
    </CacheContext.Provider>
  );
}

export function useCache() {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
}

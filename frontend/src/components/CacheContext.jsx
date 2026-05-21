import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

const CacheContext = createContext();

export function CacheProvider({ children }) {
  const [cache, setCache] = useState(() => {
    try {
      const persisted = localStorage.getItem('fieldops_cache');
      return persisted ? JSON.parse(persisted) : {};
    } catch (e) {
      console.error('Failed to parse persisted cache', e);
      return {};
    }
  });
  const inFlightRequests = useRef({});

  // Sync cache state to localStorage whenever it updates
  useEffect(() => {
    try {
      localStorage.setItem('fieldops_cache', JSON.stringify(cache));
    } catch (e) {
      console.error('Failed to save cache to localStorage', e);
    }
  }, [cache]);

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
    try {
      localStorage.removeItem('fieldops_cache');
    } catch (e) {
      console.error('Failed to clear cache from localStorage', e);
    }
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

        // Compare structure with existing cache to keep references if unchanged
        const existingEntry = cache[key];
        if (existingEntry && JSON.stringify(existingEntry.data) === JSON.stringify(data)) {
          // Data is identical: update the timestamp only, return same data reference
          setCache((prev) => ({
            ...prev,
            [key]: { data: existingEntry.data, timestamp: Date.now() },
          }));
          return existingEntry.data;
        } else {
          // Data changed or no cache existed: update both
          setCache((prev) => ({
            ...prev,
            [key]: { data, timestamp: Date.now() },
          }));
          return data;
        }
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

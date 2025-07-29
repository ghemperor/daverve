import { useState, useCallback, useRef } from 'react';

// Optimized localStorage hook with debouncing and performance improvements
export const useLocalStorage = (key, initialValue) => {
  const timeoutRef = useRef(null);
  
  // Lazy initialization with better error handling
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // SSR safety check
      if (typeof window === 'undefined' || !window.localStorage) {
        return initialValue;
      }
      
      const item = window.localStorage.getItem(key);
      
      if (item === null || item === 'null' || item === 'undefined') {
        return initialValue;
      }
      
      return JSON.parse(item);
    } catch (error) {
      // Silent failure for better performance - no console.error in production
      return initialValue;
    }
  });

  // Debounced setValue for better performance - prevents excessive localStorage writes
  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Update React state immediately for UI responsiveness
      setStoredValue(valueToStore);
      
      // Debounce localStorage writes to reduce blocking operations
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          }
        } catch (error) {
          // Silent failure for production performance
        }
      }, 100); // 100ms debounce
      
    } catch (error) {
      // Silent failure for better performance
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

export default useLocalStorage;
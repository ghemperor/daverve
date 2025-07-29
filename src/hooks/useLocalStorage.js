import { useState } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      console.log(`🔍 useLocalStorage init for "${key}"`);
      
      // Check if localStorage is available
      if (typeof window === 'undefined' || !window.localStorage) {
        console.log(`⚠️ localStorage not available for "${key}"`);
        return initialValue;
      }
      
      const item = window.localStorage.getItem(key);
      console.log(`📦 localStorage.getItem("${key}"):`, item);
      
      if (item === null || item === 'null' || item === 'undefined') {
        console.log(`⚠️ localStorage item is null/invalid for "${key}"`);
        return initialValue;
      }
      
      const result = JSON.parse(item);
      console.log(`📝 Returning parsed result:`, result);
      return result;
    } catch (error) {
      console.error(`❌ Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      console.log(`💾 Setting localStorage "${key}":`, valueToStore);
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      console.log(`✅ Successfully saved to localStorage "${key}"`);
    } catch (error) {
      console.error(`❌ Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
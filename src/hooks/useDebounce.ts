import { useState, useEffect } from "react";

/**
* A custom hook that delays the update of a value (debounce). 
* Helps optimize performance during searches. 
*
* @param value The value to be debounced (e.g., a text string from a search field)
* @param delay The delay in milliseconds (default is 400ms)
*/

export function useDebounce<T>(value: T, delay = 400): T {
  // 1. create a local state for the delayed value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  // 2. start a timer that updates the value after the selected delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 3. CLEANUP: If the user presses a new key BEFORE
// the timer finishes, we clear the old timer and start a new one. 
// This is the magic that prevents unnecessary API calls!
return () => {
  clearTimeout(handler);
}
  }, [value, delay]); // Re-runs every time the value or the delay changes

  return debouncedValue;
}
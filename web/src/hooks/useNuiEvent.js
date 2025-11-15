import { useEffect } from 'react';

/**
 * Custom hook to listen for NUI events from FiveM
 * @param {string} action - The action name to listen for
 * @param {function} handler - The callback function to execute when the event is received
 */
export const useNuiEvent = (action, handler) => {
  useEffect(() => {
    const eventListener = (event) => {
      const { action: eventAction, data } = event.data;

      if (eventAction === action) {
        handler(data);
      }
    };

    window.addEventListener('message', eventListener);

    return () => window.removeEventListener('message', eventListener);
  }, [action, handler]);
};

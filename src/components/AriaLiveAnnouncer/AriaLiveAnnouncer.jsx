import { createContext, useContext, useState, useCallback } from 'react';

/**
 * AriaLiveAnnouncer - WCAG 4.1.3 Status Messages
 *
 * Provides a way to announce status changes to screen readers.
 * Uses aria-live="polite" to not interrupt current speech.
 */

const AriaLiveContext = createContext(null);

export function useAnnounce() {
  const context = useContext(AriaLiveContext);
  if (!context) {
    throw new Error('useAnnounce must be used within AriaLiveProvider');
  }
  return context;
}

export function AriaLiveProvider({ children }) {
  const [message, setMessage] = useState('');

  const announce = useCallback((text) => {
    // Clear first to ensure screen reader picks up repeated messages
    setMessage('');
    // Use setTimeout to ensure the clear happens before new message
    setTimeout(() => setMessage(text), 100);
  }, []);

  return (
    <AriaLiveContext.Provider value={announce}>
      {children}
      {/* Visually hidden but accessible to screen readers */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {message}
      </div>
    </AriaLiveContext.Provider>
  );
}

export default AriaLiveProvider;

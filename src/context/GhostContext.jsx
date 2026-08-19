import { createContext, useContext, useState, useEffect } from 'react';

const GhostContext = createContext();

export const useGhost = () => useContext(GhostContext);

export const GhostProvider = ({ children }) => {
  const [isGhostMode, setIsGhostMode] = useState(false);

  useEffect(() => {
    // Optionally persist ghost mode across reloads
    const stored = localStorage.getItem('cx_ghost_mode');
    if (stored === 'true') {
      setIsGhostMode(true);
    }
  }, []);

  const toggleGhostMode = () => {
    setIsGhostMode(prev => {
      const next = !prev;
      localStorage.setItem('cx_ghost_mode', String(next));
      return next;
    });
  };

  return (
    <GhostContext.Provider value={{ isGhostMode, toggleGhostMode }}>
      {children}
    </GhostContext.Provider>
  );
};

"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

interface RevealContextType {
  revealed: boolean;
  setRevealed: (revealed: boolean) => void;
}

const RevealContext = createContext<RevealContextType>({
  revealed: false,
  setRevealed: () => {},
});

// Lets components outside HeroSection's tree (KineticBackground lives in the
// root layout, as a sibling — not a child) react to its entrance-animation
// state without prop drilling or a DOM event bus.
export const useReveal = () => useContext(RevealContext);

interface RevealProviderProps {
  children: React.ReactNode;
}

export default function RevealProvider({ children }: RevealProviderProps) {
  const [revealed, setRevealedState] = useState(false);
  const setRevealed = useCallback((value: boolean) => setRevealedState(value), []);

  return (
    <RevealContext.Provider value={{ revealed, setRevealed }}>
      {children}
    </RevealContext.Provider>
  );
}

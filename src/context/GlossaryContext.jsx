import { createContext, useContext, useState } from "react";

const GlossaryContext = createContext(null);

export function GlossaryProvider({ children }) {
  const [activeTerm, setActiveTerm] = useState(null);
  return (
    <GlossaryContext.Provider value={{ activeTerm, setActiveTerm }}>
      {children}
    </GlossaryContext.Provider>
  );
}

export function useGlossary() {
  return useContext(GlossaryContext);
}

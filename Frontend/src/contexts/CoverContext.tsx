import React, { createContext, useState, ReactNode } from 'react';
import { ICover } from "@/types/main";

interface CoverContextType {
  selectedCover: ICover | null;
  setSelectedCover: (card: ICover | null) => void;
}

export const CoverContext = createContext<CoverContextType | undefined>(undefined);

export const CoverProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCover, setSelectedCover] = useState<ICover | null>(null);

  return (
    <CoverContext.Provider value={{ selectedCover, setSelectedCover }}>
      {children}
    </CoverContext.Provider>
  );
};

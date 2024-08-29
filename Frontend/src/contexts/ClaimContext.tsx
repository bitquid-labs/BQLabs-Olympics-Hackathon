import React, { createContext, useState, ReactNode } from 'react';
import { IClaim } from "@/types/main";

interface ClaimContextType {
  selectedClaimFor: bigint | undefined;
  setSelectedClaimFor: (claim: bigint | undefined) => void;
}

export const ClaimContext = createContext<ClaimContextType | undefined>(undefined);

export const ClaimProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedClaimFor, setSelectedClaimFor] = useState<bigint | undefined>(undefined);

  return (
    <ClaimContext.Provider value={{ selectedClaimFor, setSelectedClaimFor }}>
      {children}
    </ClaimContext.Provider>
  );
};

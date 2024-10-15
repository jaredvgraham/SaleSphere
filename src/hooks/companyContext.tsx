"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type CompanyContextType = {
  globalCompanyId: string | null;
  setGlobalCompanyId: (id: string) => void;
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
};

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [globalCompanyId, setGlobalCompanyId] = useState<string | null>(null);

  return (
    <CompanyContext.Provider value={{ globalCompanyId, setGlobalCompanyId }}>
      {children}
    </CompanyContext.Provider>
  );
};

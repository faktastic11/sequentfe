import React, { useState, createContext, useContext, ReactNode } from 'react';
import MainLayout from '../components/mainLayout';

type CompanyContextType = {
  activeCompany: string | null;
  setActiveCompany: React.Dispatch<React.SetStateAction<string | null>>;
  searchCompany: boolean;
  setSearchCompany: React.Dispatch<React.SetStateAction<boolean>>;
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

const useCompanyContext = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompanyContext must be used within a CompanyProvider');
  }
  return context;
};

type Props = {
  children: ReactNode;
};

const CompanyMainLayout: React.FC<Props> = ({ children }) => {
  const [activeCompany, setActiveCompany] = useState<string | null>(null);
  const [searchCompany, setSearchCompany] = useState<boolean>(false);

  return (
    <CompanyContext.Provider
      value={{ activeCompany, setActiveCompany, searchCompany, setSearchCompany }}
    >
      <MainLayout
        setActiveCompany={setActiveCompany}
        setSearchCompany={setSearchCompany}
        searchCompany={searchCompany}
        activeCompany={activeCompany}
      >
        {children}
      </MainLayout>
    </CompanyContext.Provider>
  );
};

export default CompanyMainLayout;
export { useCompanyContext };

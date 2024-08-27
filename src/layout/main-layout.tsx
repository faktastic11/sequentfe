import React, { useState, createContext, useContext, ReactNode } from 'react';
import Sidebar from './sidebar';
import TopBar from './topbar';

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
      <div className="flex h-screen  bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col max-h-screen overflow-auto">
      <div className="sticky top-0 z-[100]">
        <TopBar />
      </div>
        {children}
      </div>
    </div>
    </CompanyContext.Provider>
  );
};

export default CompanyMainLayout;
export { useCompanyContext };

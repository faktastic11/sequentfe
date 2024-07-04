// src/components/MainLayout.tsx
import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
  setActiveCompany: React.Dispatch<React.SetStateAction<string | null>>;
  setSearchCompany: React.Dispatch<React.SetStateAction<boolean>>;
  searchCompany: boolean;
  activeCompany: string | null;
  
}



const MainLayout: React.FC<MainLayoutProps> = ({ children, setActiveCompany, setSearchCompany, searchCompany, activeCompany }) => {
  return (
    <div className="flex h-screen  bg-gray-100">
      <Sidebar setActiveCompany={setActiveCompany} setSearchCompany={setSearchCompany} searchCompany={searchCompany} activeCompany={activeCompany} />
      <div className="flex-1 flex flex-col max-h-screen overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import CompaniesDropdown from './CompaniesDropdown';
import guidanceBackend from '../services/guidanceBackend';

type Props = {
  setActiveCompany: React.Dispatch<React.SetStateAction<string | null>>;
  activeCompany: string | null;
  fetchPeriods: (company: string) => void;
  setLoading: Dispatch<SetStateAction<boolean>>; 
};

const TopBar: React.FC<Props> = ({ setActiveCompany, activeCompany, fetchPeriods, setLoading }) => {
  const [companies, setCompanies] = useState<string[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState<boolean>(true);
  const [userName, setUserName] = useState<string>(''); 
  const location = useLocation();

  useEffect(() => {
    async function fetchCompanies() {
      const response = await guidanceBackend.getGuidanceCompanies();
      setCompanies(response.companies);
      setCompaniesLoading(false);
    }
    void fetchCompanies();

    const userInfo = localStorage.getItem('name');

    setUserName(userInfo || '');
  }, []);

  return (
    <div className="w-full bg-[#800080] text-white flex py-4 px-4 items-center justify-between">
      <div className='flex  gap-4 '>
      <div>
        <h1 className="text-3xl font-medium">Sequent</h1>
      </div>
      <div className="flex items-center">
        {!companiesLoading && companies.length > 0 && location.pathname !== '/user-info' && (
          <CompaniesDropdown setLoading={setLoading} companies={companies} activeCompany={activeCompany} setActiveCompany={setActiveCompany} fetchPeriods={fetchPeriods} />
        )}
      </div>
      </div>
      <div className='flex gap-2'>
        <FaUser className="text-xl mr-2" />
        <span className="mr-4">{userName}</span>
      </div>
    </div>
  );
};

export default TopBar;

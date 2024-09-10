import { ReactNode, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import { Input } from '@/components/ui/input';


interface CompaniesInputProps {
  companies: string[];
}

export default function CompaniesInput({ companies }: CompaniesInputProps): ReactNode {
  const location = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeCompany = searchParams.get("query");


  const filteredCompanies = companies?.filter((company) =>
    company.toLowerCase().includes(activeCompany?.toLowerCase() || "")
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);


  if (location.pathname == '/user-info') return;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value) {
      setSearchParams({ query: value });
    } else {
      searchParams.delete('query');
      setSearchParams(searchParams);
    }
  };


  return (
    <div className="relative w-full max-w-xl">
      <Input
        type='search'
        ref={inputRef}
        className="w-full text-neutral-700 placeholder:text-neutral-400"
        onChange={handleInputChange}
        placeholder="Enter a Ticker"
        onClick={() => setIsOpen(true)}
      />
      {isOpen && filteredCompanies.length > 0 && (
        <ul className="absolute rounded z-10 bg-white text-primary border mt-1 w-full max-h-60 overflow-y-auto shadow-lg">
          {filteredCompanies?.map((company, index) => (
            <li
              className="py-2 px-3 hover:bg-gray-100 cursor-pointer"
              key={index}
              onClick={() => {
                searchParams.delete('query');
                setSearchParams({ ticker: company });
              }}
            >
              {company}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import { InputText } from 'primereact/inputtext';
import { Dispatch, SetStateAction, useState } from 'react';
interface CompaniesInputProps {
  companies: string[];
  activeCompany: string | null;
  setActiveCompany: Dispatch<SetStateAction<string | null>>;
  fetchPeriods: (company: string) => void;
}

export default function CompaniesInput({ companies, activeCompany, setActiveCompany, fetchPeriods }: CompaniesInputProps): JSX.Element {
  const [filteredCompanies, setFilteredCompanies] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setActiveCompany(inputValue);
    if (inputValue) {
      const matchingCompanies = companies.filter(company =>
        company.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredCompanies(matchingCompanies);
    } else {
      setFilteredCompanies([]);
      setActiveCompany(null);
    }
  };

  const handleSelectCompany = (company: string) => {
    setActiveCompany(company);
    setFilteredCompanies([]);
  };

  return (
    <div className="relative">
      <InputText
        className="bg-gray-200 text-black rounded py-2 px-3 w-[300px] focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        value={activeCompany ?? ''}
        onChange={handleInputChange}
        placeholder="Enter a Ticker"
      />
      {filteredCompanies.length > 0 && (
        <ul className="absolute rounded z-10 bg-white text-[#800080] border mt-1 w-[300px] max-h-60 overflow-y-auto shadow-lg">
          {filteredCompanies.map((company, index) => (
            <li
              className="py-2 px-3 hover:bg-gray-100 cursor-pointer"
              key={index}
              onClick={() => {
                handleSelectCompany(company);
                fetchPeriods(company);
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

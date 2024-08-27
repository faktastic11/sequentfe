import { FaUser } from 'react-icons/fa';
import CompaniesDropdown from '@/components/companies-dropdown';
import { useFetchCompanies } from '@/services/queries';


const TopBar: React.FC = () => {
  const username = localStorage.getItem('name');
  const {data:companies} = useFetchCompanies();

  return (
    <div className="w-full bg-primary text-white flex py-4 px-4 items-center justify-between">
      <div className='flex gap-4'>
        <h1 className="text-3xl font-medium">Sequent</h1>
        <div className="flex items-center">
            <CompaniesDropdown companies={companies} />
        </div>
      </div>
      <div className='flex gap-2'>
        <FaUser className="text-xl mr-2" />
        <span className="mr-4">{username}</span>
      </div>
    </div>
  );
};

export default TopBar;

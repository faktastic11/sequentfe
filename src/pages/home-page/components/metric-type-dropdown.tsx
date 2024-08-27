import { Dropdown } from 'primereact/dropdown';
import { useLocation, useNavigate } from 'react-router-dom';

const metricTypes = ["retrospective", "guidance"]

export default function MetricTypeDropdown({metricType}:{metricType: string}){
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);

    const updateSearchParams = (key: string, value: string) => {
        if (value) {
          searchParams.set(key, value);
        } else {
          searchParams.delete(key);
        }
      
        navigate({
          pathname: location.pathname,
          search: searchParams.toString(),
        });
      };

      
  return(
    <Dropdown
      value={searchParams.get('metricType') || metricType}
      onChange={(e) => updateSearchParams("metricType", e.target.value)}
      placeholder="Select a metric type"
      options={metricTypes}
      filter
      showClear
      className='capitalize'
    />
  );
}

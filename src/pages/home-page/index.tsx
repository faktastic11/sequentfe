import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import 'primeflex/primeflex.css'; // flex
import { useSearchParams } from 'react-router-dom';

import { TabView, TabPanel } from 'primereact/tabview';
import { ClipLoader } from 'react-spinners';

import CompanyGuidanceDataTable from '@/pages/home-page/components/guidance-datatable';
import CompanyGuidanceRevisionDataTable from '@/pages/home-page/components/guidance-revision-datatable';

import { useFetchTickerTranscriptPeriods } from '@/services/queries';
import { CompanyPeriod, CompanyYear, ProcessedPeriod, TranscriptPeriod } from '@/lib/types';


export default function GuidanceHome(): JSX.Element {
  const [searchParams] = useSearchParams();
  const activeCompany = searchParams.get('ticker');


  const { data, isLoading } = useFetchTickerTranscriptPeriods(activeCompany)
  const companyName = data?.companyName;

  const processedPeriods: ProcessedPeriod[] | undefined = data?.transcriptPeriods
    ?.map(({ year, quarter }: TranscriptPeriod) => ({
      year,
      quarter,
      label: quarter ? `${year} Q${quarter}` : `${year}`,
    }))
    ?.sort((a: ProcessedPeriod, b: ProcessedPeriod) => (a.year < b.year ? -1 : 1));

  const companyPeriods: CompanyPeriod[] | undefined = processedPeriods?.map(
    ({ year, quarter, label }) => ({
      label,
      value: { fiscalYear: year, fiscalQuarter: quarter },
    })
  );

  const companyYears: CompanyYear[] | undefined = [...new Set(processedPeriods?.map(({ year }) => year))].map(
    (year) => ({
      label: year,
      value: year,
    })
  );

  return (
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <ClipLoader size={50} color="#800080" loading={isLoading} />
        </div>
      ) : (
        <div className='mx-4 pb-4'>
          <div className='text-start my-4'>
            <h2 className="text-[24px] font-medium">{companyName ? companyName : 'Select Company'}</h2>
          </div>
          <TabView className=''>
            <TabPanel key="guidance" header="Guidance">
              {activeCompany ? (
                <CompanyGuidanceDataTable companyPeriods={companyPeriods} />
              ) : (
                <div className="text-center text-gray-600 mt-4">No data available for guidance revisions.</div>
              )}
            </TabPanel>

            <TabPanel key="revision" header="Guidance Revisions">
              {activeCompany ? (
                <CompanyGuidanceRevisionDataTable companyYears={companyYears} />
              ) : (
                <div className="text-center text-gray-600 mt-4">No data available for guidance revisions.</div>
              )}
            </TabPanel>
          </TabView>
        </div>
      )}
    </div>
  );
}
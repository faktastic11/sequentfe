import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import 'primeflex/primeflex.css'; // flex
import { useEffect, useState, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import CompanyGuidanceData from './CompanyGuidanceData';
import './GuidanceHome.scss';
import CompanyPeriodDropdown from './CompanyPeriodDropdown';
import { TabView, TabPanel } from 'primereact/tabview';
import TopBar from './Topbar';
import data from '../data.json';
import GuidanceBackend from '../services/guidanceBackend';
import { useCompanyContext } from '../layout/CompanyMainlayout';
import { ClipLoader } from 'react-spinners';

export default function GuidanceHome(): JSX.Element {

  const { activeCompany, setActiveCompany, searchCompany, setSearchCompany } = useCompanyContext();


  const [companyGuidancePeriod, setCompanyGuidancePeriod] = useState<{ fiscalYear: number | null; fiscalQuarter: number | null }>({
    fiscalYear: null,
    fiscalQuarter: null,
  });
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [guidanceRevisionsData, setGuidanceRevisionsData] = useState<any[]>([]);
  const [companyPeriods, setCompanyPeriods] = useState<{ label: string; value: { fiscalYear: number; fiscalQuarter: number | null } }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setGuidanceRevisionsData(data?.Sheet1);
  }, []);

  useEffect(() => {
    if (activeCompany === null) {
      setCompanyName(null);
      setCompanyGuidancePeriod({ fiscalYear: null, fiscalQuarter: null });
    }
  }, [activeCompany]);

  const fetchPeriods: any = useCallback(async (company: string) => {
    setLoading(true);
    try {
      const response = await GuidanceBackend.getTickerTranscriptPeriods(company);
      const periods = response.transcriptPeriods
        .map(({ year, quarter }) => ({
          label: quarter ? `${year} Q${quarter}` : `${year}`,
          value: { fiscalYear: year, fiscalQuarter: quarter },
        }))
        .sort((a, b) => (a.label < b.label ? -1 : 1));

      setCompanyPeriods(periods);
      setCompanyName(response?.companyName);
    } catch (error) {
      console.error('Failed to fetch periods', error);
    } finally {
      setLoading(false);
    }
  }, [activeCompany]);

  useEffect(() => {
    if (searchCompany) {
      setTimeout(() => {
        fetchPeriods(activeCompany);
        setSearchCompany(false);
      }, 500);
    }
  }, [searchCompany])


  return (
    <div>
      <div className="sticky top-0 z-[100]">
        <TopBar setLoading={setLoading} activeCompany={activeCompany} setActiveCompany={setActiveCompany} fetchPeriods={fetchPeriods} />
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <ClipLoader size={50} color="#800080" loading={loading} />
        </div>
      ) : (
        <div className='mx-4 pb-4'>
          <div className='text-start my-4'>
            <h2 className="text-[24px] font-medium">{companyName ? companyName : 'Select Company'}</h2>
          </div>
          <TabView>
            <TabPanel header="Guidance">
              <div className='my-2 flex items-center justify-end'>
                <div className='flex items-center justify-center gap-4'>
                  <h3 className='text-[#800080] font-medium'>Earnings Reports</h3>
                  {activeCompany && (
                    <CompanyPeriodDropdown
                      activeCompany={activeCompany}
                      companyGuidancePeriod={companyGuidancePeriod}
                      setCompanyGuidancePeriod={setCompanyGuidancePeriod}
                      setCompanyName={setCompanyName}
                      companyPeriods={companyPeriods}
                      loading={loading}
                    />
                  )}
                </div>
              </div>
              <div className='my-4 border border-[#800080] rounded'>
                {activeCompany && companyGuidancePeriod.fiscalYear && (
                  <CompanyGuidanceData companyGuidancePeriod={companyGuidancePeriod} activeCompany={activeCompany} />
                )}
              </div>
            </TabPanel>

            <TabPanel header="Guidance Revisions">
              {companyName === 'Microsoft' && guidanceRevisionsData.length > 0 && (
                <div>
                  <DataTable value={guidanceRevisionsData} responsiveLayout="scroll">
                    <Column field="LineItem" header="Line Item"></Column>
                    <Column field="Earnings Report" header="Earnings Report"></Column>
                    <Column field="Low" header="Low"></Column>
                    <Column field="High" header="High"></Column>
                    <Column field="Unit" header="Unit"></Column>
                    <Column field="Source" header="Source"></Column>
                    <Column field="Excerpt" header="Excerpt"></Column>
                  </DataTable>
                </div>
              )}
              {companyName !== 'Microsoft' && (
                <div className="text-center text-gray-600 mt-4">No data available for guidance revisions.</div>
              )}
            </TabPanel>
          </TabView>
        </div>
      )}
    </div>
  );
}
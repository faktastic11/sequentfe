import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import * as XLSX from 'xlsx';
import { useSearchParams } from 'react-router-dom';

import { useFetchCompanyGuidance } from '@/services/queries';
import { CompanyGuidanceAPIResponseT, CompanyPeriod, DataTableRowT } from '@/lib/types';
import { sourceParagraphTemplate, sourceSentenceTemplate, TableSkeleton } from '@/lib/ui-helpers';
import CompanyPeriodDropdown from './company-period-dropdown';
import MetricTypeDropdown from './metric-type-dropdown';


const mapGuidanceData = (
  guidanceData?: CompanyGuidanceAPIResponseT['guidance'] | undefined | null
): DataTableRowT[] | undefined => {
  if (!guidanceData) return;

  return guidanceData.map((transcript: any): DataTableRowT => {
    const {
      rawLineItem,
      rawLow,
      rawHigh,
      rawPeriod,
      rawTranscriptSourceSentence,
      rawTranscriptParagraph,
    } = transcript.stagingLineItems;

    return {
      lineItem: rawLineItem || '',
      period: rawPeriod || '',    
      low: rawLow || '0',         
      high: rawHigh || '0',       
      source: rawTranscriptSourceSentence || '',
      excerpt: rawTranscriptParagraph?.page_content || '',
    };
  });
};

export default function CompanyGuidanceDataTable({ companyPeriods }: { companyPeriods: CompanyPeriod[] | undefined }) {
  const [searchParams] = useSearchParams();
  const activeCompany = searchParams.get('ticker');

  const fiscalYear = Number(searchParams.get("fYear")) || null
  const fiscalQuarter = searchParams.get("fQuarter") || null

  const metricType = searchParams.get("metricType") || "guidance";

  const { data: companyGuidanceData, isLoading } = useFetchCompanyGuidance(activeCompany, fiscalYear, fiscalQuarter, metricType)

  if (isLoading) {
    return (
      <TableSkeleton />
    )
  }

  const mappedData = mapGuidanceData(companyGuidanceData?.guidance)

  const exportToCSV = (jsonData: any, fileName: string) => {
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const csvOutput = XLSX.utils.sheet_to_csv(worksheet);

    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadCSV = () => exportToCSV(companyGuidanceData?.guidance, 'exported_data');

  return (
    <>
      <div className='my-2 flex items-center justify-end gap-3'>
        <div>
          <label className='text-primary font-medium'>
            Select metric type:
          </label>
          <MetricTypeDropdown metricType={metricType} />
        </div>
        <div className='flex items-center justify-center gap-4'>
          <label className='text-primary font-medium'>Earnings Reports</label>
          <CompanyPeriodDropdown
            companyPeriods={companyPeriods}
          />
        </div>
      </div>
      <div className='my-4 border border-primary rounded'>
        <div className="flex justify-between p-4">
          <h3 className="font-bold text-[24px] text-[#4b5563]">Earnings Call Guidance</h3>
          <button
            className="text-[14px] border-primary border text-primary px-[14px] py-2 rounded-md hover:border-primary focus:outline-none focus:ring-2 focus:ring-[#b19cd9] focus:ring-opacity-50"
            onClick={handleDownloadCSV}
          >
            DOWNLOAD
          </button>
        </div>
        <DataTable stripedRows showGridlines value={mappedData} tableStyle={{ minWidth: '50rem', fontSize: '0.9rem' }} maxLength={250}>
          <Column field="lineItem" header="Line Item" bodyStyle={{ minWidth: '300px' }} />
          <Column field="period" header="Period" bodyStyle={{ minWidth: '100px' }} />
          <Column field="low" header="Low" />
          <Column field="high" header="High" />
          <Column field="source" header="Source" body={sourceSentenceTemplate} />
          <Column field="excerpt" header="Source Paragraph" body={sourceParagraphTemplate} />
        </DataTable>
      </div>
    </>
  );
}

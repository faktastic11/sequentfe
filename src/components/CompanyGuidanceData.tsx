import { useState, useEffect } from 'react';
import GuidanceBackend, { CompanyGuidanceAPIResponseT } from '../services/guidanceBackend';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import * as Humanize from 'humanize-plus';
import Highlighter from 'react-highlight-words';
import * as XLSX from 'xlsx';
import ClipLoader from 'react-spinners/ClipLoader';

interface DataTableRowT {
  lineItem: string;
  period: string;
  low: string;
  mid: string;
  high: string;
  source: string;
  sourceParagraph: string;
}

const formatValueWithUnit = (value: string, unit: string): string => {
  if (!value) return '';
  const unitMap: Record<string, string> = {
    percentage: '%',
    percent: '%',
    dollars: '$',
    dollar: '$',
    usd: '$',
  };
  unit = unit.toLowerCase();

  const isNumber = !isNaN(parseFloat(value));
  if (!isNumber) return value;

  const unitFormatted = unit in unitMap ? unitMap[unit] : unit;
  const valueFormatted = parseFloat(value) < 100 ? value : Humanize.compactInteger(parseFloat(value), 2);

  if (unitFormatted === '$') return `${unitFormatted}${valueFormatted}`;
  else return `${valueFormatted} ${unitFormatted}`;
};

const processValue = (value: CompanyGuidanceAPIResponseT['guidance'][0]['value']): { low: string; mid: string; high: string } => {
  const { low, mid, high, raw } = value;

  const formattedValues = { low: '', mid: '', high: '' };

  if (low) formattedValues.low = formatValueWithUnit(`${low.amt}`, low.unit!);
  else formattedValues.low = formatValueWithUnit(raw.low, raw.unit);

  if (mid) formattedValues.mid = formatValueWithUnit(`${mid.amt}`, mid.unit!);

  if (high) formattedValues.high = formatValueWithUnit(`${high.amt}`, high.unit!);
  else formattedValues.high = formatValueWithUnit(raw.high, raw.unit);

  return formattedValues;
};

const formatGuidancePeriod = (guidancePeriod: CompanyGuidanceAPIResponseT['guidance'][0]['guidancePeriod']): string => {
  const { fiscalYear, fiscalQuarter, raw } = guidancePeriod;
  if (!fiscalYear || !fiscalQuarter) return raw;
  if (fiscalQuarter !== null && fiscalQuarter !== undefined) return `${fiscalYear} Q${fiscalQuarter}`;

  return `${fiscalYear}`;
};

const mapGuidanceData = (guidanceData: CompanyGuidanceAPIResponseT['guidance']): DataTableRowT[] => {
  return guidanceData.map((guidance) => {
    const { lineItem, value, guidancePeriod, rawTranscriptSourceParagraph, rawTranscriptSourceSentence } = guidance;
    const { low, mid, high } = processValue(value);
    return {
      lineItem,
      period: formatGuidancePeriod(guidancePeriod),
      low,
      mid,
      high,
      source: rawTranscriptSourceSentence,
      sourceParagraph: rawTranscriptSourceParagraph,
    };
  });
};

interface CompanyGuidanceDataProps {
  companyGuidancePeriod: { fiscalYear: number | null; fiscalQuarter: number | null };
  activeCompany: string;
}

const MAX_HEIGHT_TEMPLATES = 200;
const sourceParagraphTemplate = (rowData: DataTableRowT) => {
  return (
    <div style={{ overflow: 'auto', maxHeight: MAX_HEIGHT_TEMPLATES, fontSize: '0.7rem' }}>
      <Highlighter
        highlightClassName="highlighted-source-paragraph"
        searchWords={[rowData.source]}
        autoEscape={true}
        textToHighlight={rowData.sourceParagraph}
      />
    </div>
  );
};
const sourceSentenceTemplate = (rowData: DataTableRowT) => {
  return <div style={{ overflow: 'auto', minWidth: '200px', maxHeight: MAX_HEIGHT_TEMPLATES, fontSize: '0.8rem' }}>{rowData.source}</div>;
};

export default function CompanyGuidanceData({ companyGuidancePeriod, activeCompany }: CompanyGuidanceDataProps) {
  const { fiscalYear, fiscalQuarter } = companyGuidancePeriod;
  const [loading, setLoading] = useState<boolean>(true);
  const [companyGuidanceData, setCompanyGuidanceData] = useState<DataTableRowT[]>([]);

  useEffect(() => {
    async function fetchCompanyGuidanceData() {
      const response = await GuidanceBackend.getCompanyGuidance(activeCompany, fiscalYear!, fiscalQuarter!);
      setCompanyGuidanceData(mapGuidanceData(response.guidance));
      setLoading(false);
    }
    void fetchCompanyGuidanceData();
  }, [activeCompany, fiscalYear, fiscalQuarter]);

  const exportToCSV = (jsonData: any[], fileName: string) => {
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

  const handleDownloadCSV = () => exportToCSV(companyGuidanceData, 'exported_data');

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader size={50} color="#6200ee" loading={loading} />
        </div>
      ) : (
        <div>
          <div className="flex justify-between p-4">
            <h3 className="font-bold text-[24px] text-[#4b5563]">Earnings Call Guidance</h3>
            <button
              className="text-[14px] border-[#6200ee] border text-[#6200ee] px-[14px] py-2 rounded-md hover:border-[#6200ee] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
              onClick={handleDownloadCSV}
            >
              DOWNLOAD
            </button>
          </div>
          <DataTable stripedRows showGridlines value={companyGuidanceData} tableStyle={{ minWidth: '50rem', fontSize: '0.9rem' }} maxLength={250}>
            <Column field="lineItem" header="Line Item" bodyStyle={{ minWidth: '300px' }} />
            <Column field="period" header="Period" bodyStyle={{ minWidth: '100px' }} />
            <Column field="low" header="Low" />
            <Column field="mid" header="Midpoint" />
            <Column field="high" header="High" />
            <Column field="source" header="Source" body={sourceSentenceTemplate} />
            <Column field="sourceParagraph" header="Source Paragraph" body={sourceParagraphTemplate} />
          </DataTable>
        </div>
      )}
    </div>
  );
}

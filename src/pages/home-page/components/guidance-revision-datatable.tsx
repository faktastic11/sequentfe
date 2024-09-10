import { useSearchParams } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { useFetchCompanyGuidanceRevision } from '@/services/queries';
import { GuidanceRevisionsAPIResponseT, CompanyYear } from '@/lib/types';
import { sourceParagraphTemplate, sourceSentenceTemplate, TableSkeleton } from '@/lib/ui-helpers';
import MetricTypeDropdown from './metric-type-dropdown';
import GuidanceYearDropdown from './years-dropdown';


interface FlattenedMetric {
  lineItem: string | null;
  earningsReport: string;
  low: string;
  high: string;
  unit: string;
  source: string;
  excerpt: string;
}

function flattenMetrics(data: GuidanceRevisionsAPIResponseT): FlattenedMetric[] {
  return data?.metrics.flatMap((lineItem) =>
    lineItem.metrics.map((metric, index) => ({
      lineItem: index === 0 ? lineItem.lineItem : null,
      earningsReport: metric.earningsReport,
      low: metric.low,
      high: metric.high,
      unit: metric.unit,
      source: metric.source,
      excerpt: metric.excerpt,
    }))
  );
}

export default function CompanyGuidanceRevisionDatatable({ companyYears }: { companyYears: CompanyYear[] }) {
  const [searchParams] = useSearchParams();
  const activeCompany = searchParams.get('ticker');
  const fiscalYear = Number(searchParams.get("fYear"));
  const metricType = searchParams.get("metricType") || "guidance";

  const { data, isLoading } = useFetchCompanyGuidanceRevision(activeCompany, fiscalYear,
    metricType
  )

  if (isLoading) {
    return (
      <TableSkeleton />
    )
  }

  const mappedData = flattenMetrics(data as GuidanceRevisionsAPIResponseT)

  return (
    <>
      <div className='flex justify-end gap-3 mb-2.5'>
        <div>
          <label className='text-primary font-medium'>
            Select metric type:
          </label>
          <MetricTypeDropdown metricType={metricType} />
        </div>
        <div>
          <label className='text-primary font-medium'>
            Select year:
          </label>
          <GuidanceYearDropdown fiscalYears={companyYears} />
        </div>
      </div>
      <div className='my-4 py-5 px-2 border border-primary rounded'>
        <DataTable stripedRows showGridlines value={mappedData} tableStyle={{ minWidth: '50rem', fontSize: '0.9rem' }} maxLength={250}>
          <Column field="lineItem" header="Line Item" bodyStyle={{ width: 'fit-content', maxWidth: '450px' }} className='align-top max-w-xs truncate'></Column>
          <Column field="earningsReport" header="Earnings Report"></Column>
          <Column field="low" header="Low"></Column>
          <Column field="high" header="High"></Column>
          <Column field="unit" header="Unit"></Column>
          <Column field="source" header="Source" body={sourceSentenceTemplate} />
          <Column field="excerpt" header="Excerpt" body={sourceParagraphTemplate} />
        </DataTable>
      </div>
    </>
  );
}

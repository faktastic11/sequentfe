/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { CompanyPeriod } from '@/lib/types';
import { Dropdown } from 'primereact/dropdown';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

interface CompanyGuidancePeriod {
  fiscalYear: number | null | undefined;
  fiscalQuarter: number | string | undefined | null;
}


export default function CompanyPeriodDropdown({
  companyPeriods
}: { companyPeriods: CompanyPeriod[] | undefined }): JSX.Element | undefined {
  const [searchParams, setSearchParams] = useSearchParams();
  const year = Number(searchParams.get("fYear")) || companyPeriods?.[0]?.value?.fiscalYear
  const quarter = searchParams.get("fQuarter") || companyPeriods?.[0]?.value?.fiscalQuarter
  const [companyGuidancePeriod, setCompanyGuidancePeriod] = useState<CompanyGuidancePeriod>({
    fiscalYear: year,
    fiscalQuarter: quarter,
  });

  return (
    <Dropdown
      value={companyGuidancePeriod}
      onChange={(e) => {
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set('fYear', e.value.fiscalYear)
        currentParams.set('fQuarter', e.value.fiscalQuarter)
        setSearchParams(currentParams)
        setCompanyGuidancePeriod({
          fiscalYear: e.value.fiscalYear,
          fiscalQuarter: e.value.fiscalQuarter
        })
      }}
      placeholder="Select an Earnings Call"
      options={companyPeriods}
      filter
      showClear
    />
  )
}

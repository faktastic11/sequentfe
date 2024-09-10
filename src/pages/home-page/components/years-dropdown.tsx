/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Dropdown } from 'primereact/dropdown';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CompanyYear } from '@/lib/types';


export default function GuidanceYearDropdown({ fiscalYears }: { fiscalYears: CompanyYear[] }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const year = Number(searchParams.get("fYear")) || fiscalYears[0]?.value
  const [guidanceYear, setGuidanceYear] = useState<number | null>(year);

  return (
    <Dropdown
      value={guidanceYear}
      onChange={(e) => {
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set('fYear', e.value)
        setSearchParams(currentParams)
        setGuidanceYear(e.value)
      }}
      placeholder="Select a year"
      options={fiscalYears}
      filter
      showClear
    />
  )
}

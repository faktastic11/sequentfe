/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Dropdown } from 'primereact/dropdown';
import { Dispatch, SetStateAction } from 'react';

interface CompaniesPeriodDropdownProps {
  companyGuidancePeriod: { fiscalYear: number | null; fiscalQuarter: number | null };
  activeCompany: string;
  setCompanyGuidancePeriod: Dispatch<SetStateAction<{ fiscalYear: number | null; fiscalQuarter: number | null }>>;
  setCompanyName: Dispatch<SetStateAction<string | null>>;
  companyPeriods: { label: string; value: { fiscalYear: number; fiscalQuarter: number | null } }[];
  loading: boolean;
}

export default function CompanyPeriodDropdown({
  companyGuidancePeriod,
  setCompanyGuidancePeriod,
  companyPeriods,
  loading,
}: CompaniesPeriodDropdownProps): JSX.Element | undefined {
  return !loading ? (
    <Dropdown
      value={companyGuidancePeriod}
      onChange={(e) => setCompanyGuidancePeriod({ fiscalYear: e.value.fiscalYear, fiscalQuarter: e.value.fiscalQuarter })}
      placeholder="Select an Earnings Call"
      options={companyPeriods}
      filter
      showClear
    />
  ) : undefined;
}

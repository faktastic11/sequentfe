/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Dropdown } from 'primereact/dropdown'
import { Dispatch, SetStateAction, useState, useEffect } from 'react'
import GuidanceBackend from '../services/guidanceBackend'

interface CompaniesPeriodDropdownProps {
  companyGuidancePeriod: { fiscalYear: number | null; fiscalQuarter: number | null }
  activeCompany: string
  setCompanyGuidancePeriod: Dispatch<
    SetStateAction<{
      fiscalYear: number | null
      fiscalQuarter: number | null
    }>
  >
}
export default function CompanyPeriodDropdown({
  companyGuidancePeriod,
  activeCompany,
  setCompanyGuidancePeriod,
}: CompaniesPeriodDropdownProps): JSX.Element | undefined {
  const [loading, setLoading] = useState<boolean>(true)
  const [companyPeriods, setCompanyPeriods] = useState<{ label: string; value: { fiscalYear: number; fiscalQuarter: number | null } }[]>([])

  useEffect(() => {
    async function fetchPeriods() {
      const response = await GuidanceBackend.getTickerTranscriptPeriods(activeCompany)
      setCompanyPeriods(
        response.transcriptPeriods
          .map(({ year, quarter }) => {
            if (quarter != 0 && quarter)
              return {
                label: `${year} Q${quarter}`,
                value: { fiscalYear: year, fiscalQuarter: quarter },
              }

            return { label: `${year}`, value: { fiscalYear: year, fiscalQuarter: quarter } }
          })
          .sort((a, b) => (a.label < b.label ? -1 : 1)),
      )
      setLoading(false)
    }
    void fetchPeriods()
  }, [activeCompany])

  return !loading ? (
    <Dropdown
      value={companyGuidancePeriod}
      onChange={(e) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        setCompanyGuidancePeriod({ fiscalYear: e.value.fiscalYear, fiscalQuarter: e.value.fiscalQuarter })
      }}
      placeholder='Select an Earnings Call'
      options={companyPeriods}
      filter
      showClear
    />
  ) : undefined
}

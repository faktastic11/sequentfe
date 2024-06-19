import 'primereact/resources/themes/lara-light-indigo/theme.css' //theme
import 'primereact/resources/primereact.min.css' //core css
import 'primeicons/primeicons.css' //icons
import 'primeflex/primeflex.css' // flex
import { useEffect, useState } from 'react'
import GuidanceBackend from '../services/guidanceBackend'
import CompaniesDropdown from './CompaniesDropdown'
import CompanyGuidanceData from './CompanyGuidanceData'

import './GuidanceHome.scss'
import CompanyPeriodDropdown from './CompanyPeriodDropdown'
import { Divider } from 'primereact/divider'

export default function GuidanceHome(): JSX.Element {
  const [companies, setCompanies] = useState<string[]>([])
  const [companiesLoading, setCompaniesLoading] = useState<boolean>(true)
  const [activeCompany, setActiveCompany] = useState<string | null>(null)
  const [companyGuidancePeriod, setCompanyGuidancePeriod] = useState<{ fiscalYear: number | null; fiscalQuarter: number | null }>({
    fiscalYear: null,
    fiscalQuarter: null,
  })

  useEffect(() => {
    async function fetchCompanies() {
      const response = await GuidanceBackend.getGuidanceCompanies()
      setCompanies(response.companies)
      setCompaniesLoading(false)
    }
    void fetchCompanies()
  }, [activeCompany])

  return (
    <div className={'main-body'}>
      <h2 className={'main-body-title-sequent'}>Sequent - Guidance Analysis</h2>

      <Divider />
      {!companiesLoading && companies.length && (
        <CompaniesDropdown companies={companies} activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
      )}
      {activeCompany && (
        <CompanyPeriodDropdown
          activeCompany={activeCompany}
          companyGuidancePeriod={companyGuidancePeriod}
          setCompanyGuidancePeriod={setCompanyGuidancePeriod}
        />
      )}

      {activeCompany && companyGuidancePeriod.fiscalYear && (
        <>
          <Divider />
          <CompanyGuidanceData companyGuidancePeriod={companyGuidancePeriod} activeCompany={activeCompany} />
        </>
      )}
    </div>
  )
}

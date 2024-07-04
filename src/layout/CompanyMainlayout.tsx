import React, { useState } from 'react'
import MainLayout from '../components/mainLayout'
import GuidanceHome from '../components/GuidanceHome'

type Props = {}

const CompanyMainlayout: React.FC<Props> = () => {
    const [activeCompany, setActiveCompany] = useState<string | null>(null);
    const [searchCompany, setSearchCompany] = useState<boolean>(false)
  return (
    <MainLayout
        setActiveCompany={setActiveCompany}
        setSearchCompany={setSearchCompany}
        searchCompany={searchCompany}
        activeCompany={activeCompany}
    >
        <GuidanceHome
        activeCompany={activeCompany}
        setActiveCompany={setActiveCompany}
        searchCompany={searchCompany}
        setSearchCompany={setSearchCompany}
        />
      </MainLayout>
  )
}

export default CompanyMainlayout
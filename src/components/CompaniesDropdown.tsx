import { Dropdown } from 'primereact/dropdown'
import { Dispatch, SetStateAction } from 'react'

interface CompaniesDropDownProps {
  companies: string[]
  activeCompany: string | null
  setActiveCompany: Dispatch<SetStateAction<string | null>>
}
export default function CompaniesDropdown({ companies, activeCompany, setActiveCompany }: CompaniesDropDownProps): JSX.Element {
  console.log(companies)
  return (
    <Dropdown
      value={activeCompany}
      onChange={(e) => setActiveCompany(e.value as string)}
      placeholder='Select a Ticker'
      options={companies}
      filter
      showClear
      style={{ margin: 20 }}
    />
  )
}

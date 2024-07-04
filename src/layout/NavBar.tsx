import { Menubar } from 'primereact/menubar'
import { MenuItem } from 'primereact/menuitem'

export default function TopNavBar(): JSX.Element {
  const items: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-home',
    },
    {
      label: 'Contact',
      icon: 'pi pi-envelope',
    },
  ]

  return (
    <div className='nav-card'>
      <Menubar model={items} />
    </div>
  )
}

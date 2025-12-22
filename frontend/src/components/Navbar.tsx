import { GiHamburgerMenu } from 'react-icons/gi'

const Navbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 flex items-center
     justify-between px-4 bg-white shadow z-50">
      <h2 className="text-2xl font-bold">Task Manager</h2>
      <button onClick={toggleSidebar}>
        <GiHamburgerMenu />
      </button>
    </header>
  )
}

export default Navbar

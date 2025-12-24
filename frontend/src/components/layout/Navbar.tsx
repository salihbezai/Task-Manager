import { GiHamburgerMenu } from 'react-icons/gi'
import { IoClose } from "react-icons/io5";

const Navbar = ({ toggleSidebar,isOpen }: { toggleSidebar: () => void, isOpen: boolean }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 flex items-center
     justify-between px-4 bg-white shadow-sm z-50">
      <h2 className="text-2xl font-bold">Task Manager</h2>

      <button className="md:hidden" onClick={toggleSidebar}>

        {isOpen ? (
        <IoClose className="text-2xl" />
        ) : (
        <GiHamburgerMenu className="text-2xl" />
        )}
        
      </button>
    </header>
  )
}

export default Navbar

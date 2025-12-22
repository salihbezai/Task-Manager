import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Admin/Sidebar'

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div>

      {/* header  */}
      <Navbar toggleSidebar={() => setIsOpen((prev)=> !prev)}  />

      {/* content  */}
      <div className='flex pt-16'>
        {/* sidebar */}
        <div className=''>
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        </div>

        {/* main content */}

        <div className={`w-full transition-all duration-300
           bg-red-400 ${isOpen ? "ml-64" : "ml-0"}`}>
          <h1>The Content</h1>
        </div>
      </div>
     
      
    </div>
  )
}

export default Dashboard

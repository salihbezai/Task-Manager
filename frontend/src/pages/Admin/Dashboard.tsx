import React, { useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div>

      {/* header  */}
      <Navbar toggleSidebar={() => setIsOpen((prev)=> !prev)} isOpen={isOpen}  />

      {/* content  */}
      <div className='flex pt-16'>
        {/* sidebar */}
        <div className=''>
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        </div>

        {/* main content */}

<div
  className={`w-full transition-all duration-300 bg-red-400
   
    md:ml-64
  `}
>
  <h1>The Content</h1>
</div>
      </div>
     
      
    </div>
  )
}

export default Dashboard

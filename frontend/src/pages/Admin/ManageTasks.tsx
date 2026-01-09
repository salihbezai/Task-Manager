import React from 'react'
import TaskItem from './TaskItem'

const ManageTasks = () => {
  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>My Tasks</h1>
        {/* Filter tasks on status */}
        <div>
          Pednding
        </div>
      </div>
    <div className='grid md:grid-cols-3'>

      {
        Array.from({ length: 1 }).map((_, index) => (<TaskItem/>))
      }
    
    </div>
    </div>

  )
}

export default ManageTasks

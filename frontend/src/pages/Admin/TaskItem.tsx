import React from 'react'
import { MdAttachment } from 'react-icons/md';


const TaskItem = () => {
 const task_todos =  [
  { text: "Design UI", done: true },
  { text: "Build API", done: false }
]
const totalTodos = task_todos.length;
const completedTodos = task_todos.filter(t => t.done).length;
const progressPercentage =
  totalTodos === 0 ? 0 : Math.round((completedTodos / totalTodos) * 100);




  return (
    <div className='bg-white px-3 py-3 rounded-sm'>
       <div className="py-2 flex gap-4">
            <span className={`px-2 py-1 rounded text-xs bg-green-300
                 text-green-900 font-bold`}>
                Pending
            </span>
            <span className={`px-2 py-1 rounded text-xs bg-green-300
                     text-green-900 font-bold`}>
                Pending
            </span>
       </div>
       {/* title task */}
       <h3 className="text-lg font-semibold">Task title</h3>
       {/* description */}
       <p className="text-sm text-gray-500">Task description</p>
       {/* task done progress */}
   <div className="mt-2">
            <p className="text-sm text-gray-500 mb-1">Task done: {completedTodos}/{totalTodos}</p>
        <div className="w-56 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-400 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}/>
        </div>
   </div>

   {/* start date  due date  */}

    <div className='flex flex-row justify-between'>

     <div className="mt-2">
       <p className="text-sm text-gray-500 ">Start Date</p>
       <p className="text-sm text-gray-500">1/1/2023</p>
    </div>

 

    <div className="mt-2">
       <p className="text-sm text-gray-500 ">Due Date</p>
       <p className="text-sm text-gray-500">1/1/2023</p>
    </div>

    </div>

    {/* assigned to and attachements */}
   
        <div className='flex flex-row justify-between mt-2'>
            <div>
                <p className="text-sm text-gray-500 ">Assigned To</p>
                <p className="text-sm text-gray-500">John Doe</p>
            </div>
            {/* <div>
                        {task.assignedTo.length > 0 ? (
          <div className="flex items-center">
                  {visibleUsers.map((user, index) => (
                
                     <img
                      key={user._id}
                      src={`http://localhost:5000/uploads/${user.profileImageUrl}`}
                      title={user.name}
                      alt={user.name}
                      className={`
                        w-12 h-12 rounded-full border-2 border-white cursor-pointer
                        ${index !== 0 ? "-ml-3" : ""}
                      `}
                    />
                  ))}
                    {
                      selectedUsers.length > MAX_VISIBLE_USERS && (
                                         <div
                      onClick={() => setShowAssignModal(true)}
                      className={`flex items-center justify-center
                        w-9 h-9 bg-gray-300 rounded-full border-2
                         border-white cursor-pointer -ml-3"
                      `}
                    >
                      {`+${extraCount}`}
                    </div>
                      )
                    }
                </div>
                ) : (
                  <button
                    type="button"
                    className="flex items-center gap-2 bg-gray-200 px-3 py-2 rounded cursor-pointer"
                  >
                  
                    Add Members
                  </button>
                )}
            </div> */}
            {/* attachments */}
            <div className='flex flex-row gap-1 items-center'>
                <MdAttachment size={25} />
                <span>2</span>
            </div>
        </div>
                

              
                  
    </div>
    
  )
}

export default TaskItem

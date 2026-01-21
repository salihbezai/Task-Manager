import React from 'react'

const MemberCard = ({ user}) => {
  return (
    // card for member with image avatar and name and email and the tasks assigned to them
    //  pending, in-progress, completed
    <div>
        <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
                <img
                  src={`http://localhost:5000/uploads/${user.profileImageUrl}`}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                    <h2 className="text-lg font-semibold">{user.name}</h2>
                    <p className="text-gray-600">{user.email}</p>
                </div>
            </div>
            <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex flex-col  flex-start 
                 bg-[#ededed] text-purple-900 font-bold px-2 py-1 rounded md:text-sm">
                    <span className="">Pending</span>
                    <span className="font-semibold md:text-sm">{user.pendingTaskCount}</span>
                </div>
                <div className="flex flex-col  flex-start bg-[#ededed]
                 text-cyan-900  font-bold px-2 py-1 rounded md:text-sm">
                    <span className="">In Progress</span>
                    <span className="font-semibold md:text-sm">{user.inProgressTaskCount}</span>
                </div>
                <div className="flex flex-col flex-start 
                bg-[#ededed] text-green-900 font-bold px-2 py-1 rounded md:text-sm">
                    <span className="">Completed</span>
                    <span className="font-semibold md:text-sm">{user.completedTaskCount}</span>
                </div>
            </div>
        </div>

    </div>
  )
}

export default MemberCard

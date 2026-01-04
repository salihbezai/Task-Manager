import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { MdAdd, MdAttachment, MdGroupAdd } from "react-icons/md";
import AssignUsersModal from "../../components/Modals/AssignUserModal";
import { fetchUsers } from "../../featuers/user/userActions";
// import { createTask } from "../../featuers/task/taskActions";

const CreateTask = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users } = useSelector((state: RootState) => state.user);

  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    dueDate: "",
    assignedTo: [],
    todos: [],
    attachments: []
  });


  const [showAssignModal, setShowAssignModal] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement 
    | HTMLTextAreaElement>) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // await dispatch(createTask(formData));
    console.log("the task right now is "+JSON.stringify(task))
  };

  // fetch the users
  useEffect(() => {
     dispatch(fetchUsers());
  }, [dispatch]);

  // function that filter the users as objects and not strings
  const selectedUsers = useMemo(() => users?.filter(user => task.assignedTo.includes(user._id)),
   [users, task.assignedTo]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Create New Task</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        
        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            name="title"
            value={task.title}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:outline-none"
            placeholder="Enter task title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            className="w-full p-2 border rounded h-24 focus:outline-none"
            placeholder="Task details..."
          ></textarea>
        </div>

        {/* Priority + Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Priority</label>
            <select
              name="priority"
              value={task.priority}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Status</label>
            <select
              name="status"
              value={task.status}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In-Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Due Date */}
        <div className="grid grid-cols-2 gap-4">
        <div className="">
          <label className="block font-medium mb-1">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={task.dueDate}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none"
          />
        </div>
        {/* Assigned To */}
        <div>
          <label className="block font-medium mb-1">Assign To</label>
          <div>
            {
              task?.assignedTo.length > 0 ?(
                <div className="flex items-center gap-2">
                  {selectedUsers?.map((user: any) => (
                    <img
                      key={user._id}
                      src={`http://localhost:5000/uploads/${user.profileImageUrl}`}
                      alt={user.name}
                      title={user.name}
                      className="w-8 h-8 rounded-full"
                       onClick={()=> setShowAssignModal(true)}
                    />
                  ))}
                </div>
              ):(
          <button 
          type="button"
          className="flex items-center py-2 px-2 rounded gap-2
           bg-gray-200 cursor-pointer"
           onClick={()=> setShowAssignModal(true)}
           >
            <MdGroupAdd size={20}/>
            Add Members
          </button>
            )
            }
          </div>
 
        </div>

        </div>

     

        {/* Todos */}
        <div>
        <label className="block font-medium mb-1">Todos Checklist</label>
        <div className="flex items-center ">
          <input
          type="text"
          name="todos"
          value={task.todos}
          onChange={handleChange}
          className="w-2/3 p-2 border rounded mr-3 focus:outline-none"
          placeholder="Enter task"
        />
          <button className="flex items-center py-2 px-2
           rounded gap-2 bg-gray-200 cursor-pointer">
          <MdAdd size={20}/>
          Add
        </button>
        </div>
        </div>

        {/* Attachments */}
      <div>
        <label className="block font-medium mb-1">Attachments</label>
        <div className="flex items-center ">
        <div className="w-2/3 flex items-center  px-2 border rounded mr-3">
          <MdAttachment color="grey" size={20}/>
        <input
          type="text"
          name="attachments"
          value={task.attachments}
          onChange={handleChange}
          placeholder="Add File Link"
          className="w-2/3 p-2 rounded focus:outline-none"
          />
        </div>
    
          <button className="flex items-center py-2 px-2
           rounded gap-2 bg-gray-200 cursor-pointer">
          <MdAdd size={20}/>
          Add
        </button>
        </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4
           py-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          Create Task
        </button>
      </form>
      {showAssignModal && (
  <AssignUsersModal
    users={users}
    selectedUsers={task.assignedTo}
    onClose={() => setShowAssignModal(false)}
    onDone={(ids) => {
       setTask({ ...task, assignedTo: ids });
       console.log("the task is "+JSON.stringify(task))
       setShowAssignModal(false);
    }}
  />
)}

    </div>
  );
};

export default CreateTask;

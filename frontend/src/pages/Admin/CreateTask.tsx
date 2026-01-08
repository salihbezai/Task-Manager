import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { MdAdd, MdAttachment, MdDelete, MdGroupAdd } from "react-icons/md";
import AssignUsersModal from "../../components/Modals/AssignUserModal";
import { fetchUsers } from "../../featuers/user/userActions";
import { createTask } from "../../featuers/task/taskActions";
import { toast } from "react-toastify";


const CreateTask = () => {
  
  const initialTask = {
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    dueDate: "",
    assignedTo: [] as string[],
    todos: [] as { text: string }[],
    attachments: [] as string[]
  }
  const dispatch = useDispatch<AppDispatch>();
  const { users } = useSelector((state: RootState) => state.user);
  const { createTaskLoading, createTaskError } = useSelector(
    (state: RootState) => state.task
  )

  const [task, setTask] = useState(initialTask);

  const [ titleError, setTitleError ] = useState('');

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [inputTodo, setInputTodo] = useState("");
  const [inputAttachment, setInputAttachment] = useState("");




  /* ================= BASIC HANDLERS ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if(!task.title.trim()){
      setTitleError('Title is required');
      return;
    }
      setTitleError('');

     try {
      await dispatch(createTask(task)).unwrap()
      toast.success('Task created successfully');
      setTask(initialTask);
     } catch (error: any) {
      toast.error("Failed to create task ❌");
     }
  };

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const selectedUsers = useMemo(
    () => users?.filter(user => task.assignedTo.includes(user._id)),
    [users, task.assignedTo]
  );

    const MAX_VISIBLE_USERS = 3;
    const visibleUsers = selectedUsers?.slice(0, MAX_VISIBLE_USERS);
    const extraCount = selectedUsers?.length - MAX_VISIBLE_USERS;
  /* ================= TODOS ================= */

  const handleAddTodo = () => {
    if (!inputTodo.trim()) return;

    setTask(prev => ({
      ...prev,
      todos: [...prev.todos, { text: inputTodo.trim() }]
    }));

    setInputTodo("");
  };

  const removeTodo = (index: number) => {
    setTask(prev => ({
      ...prev,
      todos: prev.todos.filter((_, i) => i !== index)
    }));
  };

  /* ================= ATTACHMENTS ================= */

  const handleAddAttachment = () => {
    if (!inputAttachment.trim()) return;

    setTask(prev => ({
      ...prev,
      attachments: [...prev.attachments, inputAttachment.trim()]
    }));

    setInputAttachment("");
  };

  const removeAttachment = (index: number) => {
    setTask(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  /* =============================================== */

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
            className={
              `w-full p-2 border rounded focus:outline-none ${titleError ? 'border-red-500' : ''}`
            }
            placeholder="Enter task title"
          />
          {titleError && <p className="text-red-500 text-sm mt-1">{titleError}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            className="w-full p-2 border rounded h-24 focus:outline-none"
          />
        </div>

        {/* Priority + Status */}
        <div className="grid grid-cols-2 gap-4">
          <select name="priority" value={task.priority} onChange={handleChange} className="p-2 border rounded">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select name="status" value={task.status} onChange={handleChange} className="p-2 border rounded">
            <option value="pending">Pending</option>
            <option value="in-progress">In-Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Due Date + Assign */}
        <div className="grid grid-cols-2 gap-4">
          <input type="date" name="dueDate" value={task.dueDate} onChange={handleChange} className="p-2 border rounded" />

          <div>
            {task.assignedTo.length > 0 ? (
      <div className="flex items-center">
              {visibleUsers.map((user, index) => (
            
                 <img
                  key={user._id}
                  src={`http://localhost:5000/uploads/${user.profileImageUrl}`}
                  title={user.name}
                  onClick={() => setShowAssignModal(true)}
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
                onClick={() => setShowAssignModal(true)}
                className="flex items-center gap-2 bg-gray-200 px-3 py-2 rounded cursor-pointer"
              >
                <MdGroupAdd size={20} />
                Add Members
              </button>
            )}
          </div>
        </div>

        {/* TODOS */}
        <div>
          <label className="font-medium mb-1 block">Todos</label>
          <div className="flex gap-3">
            <input
              value={inputTodo}
              onChange={e => setInputTodo(e.target.value)}
              className="w-2/3 p-2 border rounded focus:outline-none"
              placeholder="Enter todo"
            />
            <button type="button" onClick={handleAddTodo} 
            className="flex items-center py-2 px-2 rounded gap-2 bg-gray-200 cursor-pointer">
              <MdAdd /> Add
            </button>
          </div>

          <div className="w-2/3">
            <ul className="mt-3 space-y-2">
            {task.todos.map((todo, i) => (
              <li key={i} className="flex justify-between bg-gray-50 p-2 rounded border">
                <div className="flex flex-row gap-1">
                <span className="text-gray-600">{i+1}</span>
                <span>{todo.text}</span>
                </div>
                <button type="button" onClick={() => removeTodo(i)} 
                className="text-red-500 text-sm cursor-pointer">
                  <MdDelete size={20} />
                </button>
              </li>
            ))}
          </ul>
          </div>


        </div>

        {/* ATTACHMENTS */}
        <div>
          <label className="font-medium mb-1 block">Attachments</label>

          <div className="flex gap-3">
            <div className="flex items-center border rounded px-2 w-2/3">
              <MdAttachment size={20} />
              <input
                value={inputAttachment}
                onChange={e => setInputAttachment(e.target.value)}
                placeholder="Paste file URL"
                className="p-2 w-full focus:outline-none"
              />
            </div>

            <button type="button" onClick={handleAddAttachment} 
            className="flex items-center py-2 px-2 rounded gap-2 bg-gray-200 cursor-pointer">
              <MdAdd /> Add
            </button>
          </div>
            <div className="w-2/3">
          <ul className="mt-3 space-y-2">
            {task.attachments.map((att, i) => (
              <li key={i} className="flex justify-between bg-gray-50 p-2 rounded border">
                <div className="flex flex-row items-center justify-center">
                  <MdAttachment size={20} />
                  <a href={att} target="_blank" className="pl-2 text-blue-600 truncate">
                  {att}
                </a>
                </div>
                <button type="button" onClick={() => removeAttachment(i)} 
               className="text-red-500 text-sm cursor-pointer">
                  <MdDelete size={20} />
                </button>
              </li>
            ))}
          </ul>
            </div>

        </div>

        {/* Submit */}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
          
          {
            createTaskLoading ? "Creating Task ..." : (
              "Create Task"
            )
          }
        </button>
        {
          createTaskError && (
            <p className="text-red-500 mt-2">{createTaskError}</p>
          )
        }
      </form>

      {showAssignModal && (
        <AssignUsersModal
          users={users}
          selectedUsers={task.assignedTo}
          onClose={() => setShowAssignModal(false)}
          onDone={(ids) => {
            setTask(prev => ({ ...prev, assignedTo: ids }));
            setShowAssignModal(false);
          }}
        />
      )}
    </div>
  );
};

export default CreateTask;

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store/store";
import { MdAdd, MdAttachment, MdDelete, MdGroupAdd } from "react-icons/md";
import AssignUsersModal from "../../components/Modals/AssignUserModal";
import { fetchUsers } from "../../featuers/user/userActions";
import { deleteTask, fetchTaskById, updateTask } from "../../featuers/task/taskActions";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/Modals/ConfirmModal";

const UpdateTask = () => {
  const initialTask = {
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    dueDate: "",
    assignedTo: [] as string[],
    todos: [] as { text: string }[],
    attachments: [] as string[],
  };

  const { id } = useParams(); // task id from route
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { users } = useSelector((state: RootState) => state.user);
  const { selectedTask, updateTaskLoading } = useSelector(
    (state: RootState) => state.task,
  );

  const [open, setOpen] = useState(false);
  const [task, setTask] = useState(initialTask);
  const [titleError, setTitleError] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [inputTodo, setInputTodo] = useState("");
  const [inputAttachment, setInputAttachment] = useState("");

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    if (id) {
      dispatch(fetchTaskById(id));
    }
    dispatch(fetchUsers());
  }, [dispatch, id]);

  /* ================= PREFILL FORM ================= */

  useEffect(() => {
    if (selectedTask) {
      setTask(selectedTask);
    }
  }, [selectedTask]);


  /* ================= HANDLERS ================= */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!task.title.trim()) {
      setTitleError("Title is required");
      return;
    }

    try {
      await dispatch(updateTask(task)).unwrap();
      toast.success("Task updated successfully");
      navigate("/admin/tasks");
    } catch (error) {
      toast.error("Failed to update task ❌");
    }
  };

  /* ================= USERS ================= */

  const selectedUsers = useMemo(
    () => users?.filter((user) => task.assignedTo.includes(user._id)) ?? [],
    [users, task.assignedTo],
  );

  const MAX_VISIBLE_USERS = 3;
  const visibleUsers = selectedUsers.slice(0, MAX_VISIBLE_USERS);
  const extraCount = Math.max(selectedUsers.length - MAX_VISIBLE_USERS, 0);

  /* ================= TODOS ================= */

  const handleAddTodo = () => {
    if (!inputTodo.trim()) return;

    setTask((prev) => ({
      ...prev,
      todos: [...prev.todos, { text: inputTodo.trim() }],
    }));

    setInputTodo("");
  };

  const removeTodo = (index: number) => {
    setTask((prev) => ({
      ...prev,
      todos: prev.todos.filter((_, i) => i !== index),
    }));
  };

  /* ================= ATTACHMENTS ================= */

  const handleAddAttachment = () => {
    if (!inputAttachment.trim()) return;

    setTask((prev) => ({
      ...prev,
      attachments: [...prev.attachments, inputAttachment.trim()],
    }));

    setInputAttachment("");
  };

  const removeAttachment = (index: number) => {
    setTask((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  /* ================= DELETE TASK ================= */
  const deleteTaskHandler = async() => {
    try {
        await dispatch(deleteTask(task._id)).unwrap();
        toast.success("Task deleted successfully");
        navigate("/admin/tasks");
    }catch(error){
        toast.error("Failed to delete task ❌");
    }
    finally {
        setOpen(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="px-2 py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Update Task</h2>
        {/* delete button  */}
        <button
          className="flex items-center justify-center bg-red-500
             text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
          onClick={() => setOpen(true) }
        >
          <MdDelete className="inline-block mr-2" size={20} />
          Delete
        </button>
      </div>

            {/* Modal */}
      <ConfirmModal
        open={open}
        title="Delete Task"
        message="Are you sure you want to delete this task ?"
        confirmText="Delete"
        onClose={() => setOpen(false)}
        onConfirm={deleteTaskHandler}
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded shadow"
      >
        {/* TITLE */}
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            name="title"
            value={task.title}
            onChange={handleChange}
            className={`w-full p-2 border rounded focus:outline-none ${
              titleError ? "border-red-500" : ""
            }`}
          />
          {titleError && (
            <p className="text-red-500 text-sm mt-1">{titleError}</p>
          )}
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            className="w-full p-2 border rounded h-24 focus:outline-none"
          />
        </div>

        {/* PRIORITY + STATUS */}
        <div className="grid grid-cols-2 gap-4">
          <div className="">
            <label className="block font-medium mb-1">Priority</label>
            <select
              name="priority"
              value={task.priority}
              onChange={handleChange}
              className="p-2 border rounded w-full"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="">
            <label className="block font-medium mb-1">Status</label>
            <select
              name="status"
              value={task.status}
              onChange={handleChange}
              className="p-2 border rounded w-full"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* DUE DATE + ASSIGN USERS */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formatDateForInput(task.dueDate)}
              onChange={handleChange}
              className="p-2 border rounded w-full"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Assign to</label>
            {task.assignedTo.length > 0 ? (
              <div className="flex items-center">
                {visibleUsers?.map((user, index) => (
                  <img
                    key={user._id}
                    src={`http://localhost:5000/uploads/${user.profileImageUrl}`}
                    title={user.name}
                    onClick={() => setShowAssignModal(true)}
                    className={`w-12 h-12 rounded-full border-2 border-white cursor-pointer ${
                      index !== 0 ? "-ml-3" : ""
                    }`}
                  />
                ))}

                {selectedUsers.length > MAX_VISIBLE_USERS && (
                  <div
                    onClick={() => setShowAssignModal(true)}
                    className="flex items-center justify-center w-9 h-9 bg-gray-300 rounded-full border-2 border-white cursor-pointer -ml-3"
                  >
                    +{extraCount}
                  </div>
                )}
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

        {/* TODOS + ATTACHMENTS */}

        {/* TODOS */}
        <div>
          <label className="font-medium mb-1 block">Todos</label>
          <div className="flex gap-3">
            <input
              value={inputTodo}
              onChange={(e) => setInputTodo(e.target.value)}
              className="w-2/3 p-2 border rounded focus:outline-none"
              placeholder="Enter todo"
            />
            <button
              type="button"
              onClick={handleAddTodo}
              className="flex items-center py-2 px-2 rounded gap-2 bg-gray-200 cursor-pointer"
            >
              <MdAdd /> Add
            </button>
          </div>

          <div className="w-2/3">
            <ul className="mt-3 space-y-2">
              {task.todos.map((todo, i) => (
                <li
                  key={i}
                  className="flex justify-between bg-gray-50 p-2 rounded border"
                >
                  <div className="flex flex-row gap-1">
                    <span className="text-gray-600">{i + 1}</span>
                    <span>{todo.text}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTodo(i)}
                    className="text-red-500 text-sm cursor-pointer"
                  >
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
                onChange={(e) => setInputAttachment(e.target.value)}
                placeholder="Paste file URL"
                className="p-2 w-full focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleAddAttachment}
              className="flex items-center py-2 px-2 rounded gap-2 bg-gray-200 cursor-pointer"
            >
              <MdAdd /> Add
            </button>
          </div>
          <div className="w-2/3">
            <ul className="mt-3 space-y-2">
              {task.attachments.map((att, i) => (
                <li
                  key={i}
                  className="flex justify-between bg-gray-50 p-2 rounded border"
                >
                  <div className="flex flex-row items-center justify-center">
                    <MdAttachment size={20} />
                    <a
                      href={att}
                      target="_blank"
                      className="pl-2 text-blue-600 truncate"
                    >
                      {att}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttachment(i)}
                    className="text-red-500 text-sm cursor-pointer"
                  >
                    <MdDelete size={20} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          {updateTaskLoading ? "Updating..." : "Update Task"}
        </button>
      </form>

      {showAssignModal && (
        <AssignUsersModal
          users={users}
          selectedUsers={task.assignedTo}
          onClose={() => setShowAssignModal(false)}
          onDone={(ids) => {
            setTask((prev) => ({ ...prev, assignedTo: ids }));
            setShowAssignModal(false);
          }}
        />
      )}
    </div>
  );
};

export default UpdateTask;

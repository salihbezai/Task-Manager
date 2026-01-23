import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store/store";
import {  MdAttachment } from "react-icons/md";
import { fetchUsers } from "../../featuers/user/userActions";
import {
  fetchTaskById,
  updateTask,
} from "../../featuers/task/taskActions";
import { toast } from "react-toastify";
import type { UpdateTaskPayload } from "../../featuers/task/taskTypes";

const ViewTaskDetails = () => {
  const initialTask: UpdateTaskPayload = {
    _id: "",
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    dueDate: "",
    assignedTo: [] as string[],
    todos: [] as { text: string, completed: boolean }[],
    attachments: [] as string[],
  };

  const { id } = useParams(); // task id from route
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { users } = useSelector((state: RootState) => state.user);
  const { selectedTask } = useSelector(
    (state: RootState) => state.task,
  );

  const [task, setTask] = useState<UpdateTaskPayload>(initialTask);


 

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    if (id) {
      dispatch(fetchTaskById(id));
    }
    dispatch(fetchUsers());
  }, [dispatch, id]);

  /* ================= PREFILL FORM ================= */

  useEffect(() => {
    if (!selectedTask) return;

    setTask({
      _id: selectedTask._id,
      title: selectedTask.title,
      description: selectedTask.description,
      priority: selectedTask.priority,
      status: selectedTask.status,
      dueDate: selectedTask.dueDate
        ? new Date(selectedTask.dueDate).toISOString().split("T")[0]
        : "",
      assignedTo: selectedTask.assignedTo?.map((_id) => _id) ?? [],
      todos: selectedTask.todos?.map((t) => ({ text: t.text, completed: t.completed })) ?? [],
      attachments: selectedTask.attachments ?? [],
    });
  }, [selectedTask]);

 

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!task.title.trim()) {
  //     setTitleError("Title is required");
  //     return;
  //   }

  //   try {
  //     await dispatch(updateTask(task)).unwrap();
  //     toast.success("Task updated successfully");
  //     navigate("/admin/tasks");
  //   } catch (error: unknown) {
  //     toast.error("Failed to update task ❌");
  //   }
  // };

  /* ================= USERS ================= */

  const selectedUsers = useMemo(
    () => users?.filter((user) => task.assignedTo?.includes(user._id)) ?? [],
    [users, task.assignedTo],
  );

  const MAX_VISIBLE_USERS = 3;
  const visibleUsers = selectedUsers.slice(0, MAX_VISIBLE_USERS);
  const extraCount = Math.max(selectedUsers.length - MAX_VISIBLE_USERS, 0);
  console.log("the task "+JSON.stringify(task))

  return (
    <div className="px-2 py-4 bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{task.title}</h2>
        {/* task status */}
        <span
          className={`px-2 py-1 rounded text-xs
                      ${
                        task.status === "completed"
                          ? "bg-green-300 text-green-900 font-bold"
                          : task.status === "pending"
                            ? "bg-purple-300 text-purple-900 font-bold"
                            : "bg-cyan-300 text-cyan-900 font-bold"
                      }`}
        >
          {task.status}
        </span>
      </div>
      {/* Description  */}
      <div className="">
        <h3 className="text-lg font-semibold mb-2 text-gray-600">
          Description
        </h3>
        <p>{task.description || "No description provided."}</p>
      </div>
      {/* Priority , dueDate, assignedTo */}
      <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-600">Priority</h3>
          <p className="capitalize">{task.priority}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-600">Due Date</h3>
          <p>
            {task.dueDate
              ? new Date(task.dueDate).toLocaleDateString()
              : "No due date"}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-600">
            Assigned To
          </h3>
          {selectedUsers.length > 0 ? (
            <div className="flex items-center">
          {
            <div className="flex items-center">
              {visibleUsers.map((user, index) => (
                <img
                  key={user._id}
                  src={`http://localhost:5000/uploads/${user.profileImageUrl}`}
                  title={user.name}
                  alt={user.name}
                  className={`
        w-10 h-10 rounded-full border-2 border-white cursor-pointer
        ${index !== 0 ? "-ml-3" : ""}
      `}
                />
              ))}

              {extraCount > 0 && (
                <div
                  className="
        w-10 h-10 rounded-full bg-gray-300 text-gray-700
        flex items-center justify-center text-sm font-semibold
        -ml-3 border-2 border-white
      "
                >
                  +{extraCount}
                </div>
              )}
            </div>
          }
            </div>
          ) : (
            <p>No users assigned.</p>
          )}
        </div>
      </div>
      {/* todos checklist */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-600">Todos</h3>
        {task.todos?.map((todo, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="checkbox"
              className="mr-2"
              checked={todo.completed}
              onChange={() => {
                const updatedTodos = task.todos?.map((t, i) =>
                  i === index ? { ...t, completed: !t.completed } : t,
                );
                setTask((prev) => ({ ...prev, todos: updatedTodos }));
              }}
            />
            <span>{todo.text}</span>
          </div>
        ))}
      </div>
      {/* attachments */}

      <div className="w-2/3">
        <h3 className="text-lg font-semibold mb-2 text-gray-600">
          Attachments
        </h3>

        <ul className="mt-3 space-y-2">
          {task.attachments?.map((att, i) => (
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
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ViewTaskDetails;

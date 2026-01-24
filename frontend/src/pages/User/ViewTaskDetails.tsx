import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store/store";
import { MdAttachment } from "react-icons/md";
import { fetchUsers } from "../../featuers/user/userActions";
import {
  fetchTaskById,
  updateTaskStatus,
} from "../../featuers/task/taskActions";
import { BeatLoader } from "react-spinners";

const ViewTaskDetails = () => {
  const { id } = useParams(); // task id from route
  const dispatch = useDispatch<AppDispatch>();

  const { users } = useSelector((state: RootState) => state.user);
  const { selectedTask, selectedLoadingTask } = useSelector((state: RootState) => state.task);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    if (id) {
      dispatch(fetchTaskById(id));
    }
    dispatch(fetchUsers());
  }, [dispatch, id]);

  /* ================= PREFILL FORM ================= */

  const task = selectedTask

  const selectedUsers = useMemo(() => {
    if (!users || !task) return [];
    return users.filter((user) => task.assignedTo?.includes(user._id));
  }, [users, task]);

  const MAX_VISIBLE_USERS = 3;
  const visibleUsers = selectedUsers.slice(0, MAX_VISIBLE_USERS);
  const extraCount = Math.max(selectedUsers.length - MAX_VISIBLE_USERS, 0);

  type TaskStatus = "pending" | "in-progress" | "completed";

  const checkTodosCompletion = (
    todos: { text: string; completed: boolean }[],
  ): TaskStatus => {
    if (!todos || todos.length === 0) return "pending";

    const completedCount = todos.filter((t) => t.completed).length;

    if (completedCount === 0) return "pending";
    if (completedCount === todos.length) return "completed";
    return "in-progress";
  };

if(selectedLoadingTask) {
  return (
      <div className="w-full h-screen flex justify-center items-center">
        <BeatLoader size={15} color="#2563EB" />
      </div>
  );
}


if (!task) {
  return (
    <div className="p-4 text-gray-500">
      Task not found.
    </div>
  );
}
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
                const updatedTodos = task.todos!.map((t, i) =>
                  i === index ? { ...t, completed: !t.completed } : t,
                );

                const newStatus = checkTodosCompletion(updatedTodos);

                dispatch(
                  updateTaskStatus({
                    _id: task._id,
                    status: newStatus,
                    todos: updatedTodos,
                  }),
                );
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

import { MdAttachment } from "react-icons/md";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import type { Task } from "../../featuers/task/taskTypes";
import type { RootState } from "../../store/store";
import { useSelector } from "react-redux";

const TaskItem = ({ task }: { task: Task }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { users } = useSelector((state: RootState) => state.user);

  const totalTodos = task && task.todos.length;
  const completedTodos = task && task.todos.filter((t) => t.completed).length;
  const progressPercentage =
    totalTodos === 0 ? 0 : Math.round((completedTodos / totalTodos) * 100);

  // assigned users display logic
  const MAX_VISIBLE_USERS = 3;
  const assignedUsers = task?.assignedTo || [];
  const visibleUsers = users
    .filter((u) => task.assignedTo?.includes(u._id))
    .slice(0, MAX_VISIBLE_USERS);
  const extraCount = assignedUsers.length - visibleUsers.length;

  return (
    <div
      className="w-full bg-white px-3 py-3 rounded-sm shadow-lg 
      cursor-pointer hover:shadow-xl transition-shadow duration-300"
      onClick={() =>
        user?.role === "admin"
          ? navigate(`/admin/update-task/${task._id}`)
          : navigate(`/user/task-details/${task._id}`)
      }
    >
      <div className="py-2 flex gap-4">
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

        <span
          className={`px-2 py-1 rounded text-xs
                      ${
                        task.priority === "high"
                          ? "bg-red-300 text-red-900 font-bold"
                          : task.priority === "medium"
                            ? "bg-orange-300 text-orange-900 font-bold"
                            : "bg-green-300 text-green-900 font-bold"
                      }`}
        >
          {task.priority}
        </span>
      </div>
      {/* title task */}
      <h3 className="text-lg font-semibold">{task.title}</h3>
      {/* description  show a bit of it not all*/}
      <p className="text-sm text-gray-500">
        {task.description?.slice(0, 70)}...
      </p>
      {/* task done progress */}
      <div className="mt-2">
        <p className="text-sm text-gray-500 mb-1">
          Task done:{" "}
          <span className="font-bold">
            {completedTodos}/{totalTodos}
          </span>
        </p>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-400 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* start date  due date  */}

      <div className="flex flex-row justify-between">
        <div className="mt-2">
          <p className="text-sm text-gray-500 ">Start Date</p>
          <p className="text-sm text-gray-500 font-bold">
            {format(task.createdAt!, "dd MMM yyyy")}
          </p>
        </div>

        <div className="mt-2">
          <p className="text-sm text-gray-500 ">Due Date</p>
          <p className="text-sm text-gray-500 font-bold">
            {format(task.dueDate!, "dd MMM yyyy")}
          </p>
        </div>
      </div>

      {/* assigned to and attachements */}

      <div className="flex flex-row justify-between mt-2">
        <div>
          {
            <div className="flex items-center">
              {visibleUsers.map((user, index) => (
                <img
                  key={user._id}
                  src={`http://localhost:5000/uploads/${user.profileImageUrl}`}
                  title={user.name}
                  alt={user.name}
                  className={`
        w-8 h-8 rounded-full border-2 border-white cursor-pointer
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

        {/* attachments */}
        {(task.attachments?.length ?? 0) > 0 && (
          <div className="flex flex-row gap-1 items-center bg-[#EBF3FE] px-2 py-1 rounded">
            <MdAttachment size={25} />
            <span>{task.attachments?.length}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;

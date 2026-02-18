import TaskItem from "./TaskItem";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { useEffect, useState } from "react";
import {
  downloadTasksCSV,
  fetchAllTasks,
  getUserTasks,
} from "../../featuers/task/taskActions";
import { fetchUsers } from "../../featuers/user/userActions";
import { toast } from "react-toastify";
import type { Task } from "../../featuers/task/taskTypes";

type FilterButtonProps = {
  label: string;
  value: string;
  count: number;
  activeFilter: string;
  onClick: (value: string) => void;
};

const FilterButton = ({
  label,
  value,
  count,
  activeFilter,
  onClick,
}: FilterButtonProps) => {
  const isActive = activeFilter === value;

  return (
    <button
      onClick={() => onClick(value)}
      className={`
        px-3 py-2 mr-2 cursor-pointer font-medium
        ${
          isActive
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-500"
        }
        hover:text-blue-500
      `}
    >
      {label}
      <span className="ml-1 text-sm text-gray-400">({count})</span>
    </button>
  );
};

const ManageTasks = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks } = useSelector((state: RootState) => state.task);
  const { user } = useSelector((state: RootState) => state.auth);
  const { users } = useSelector((state: RootState) => state.user);

  const [activeFilter, setActiveFilter] = useState("all");

  // fetch tasks
  useEffect(() => {
    if (user?.role === "admin") {
      try {
        if (tasks.length === 0) {
          dispatch(fetchAllTasks());
        }
      } catch (error) {
        toast.error("Failed to fetch tasks. Please try again.");
      }
    } else {
      try {
        if (tasks.length === 0) {
          dispatch(getUserTasks());
        }
      } catch (error) {
        toast.error("Failed to fetch tasks. Please try again.");
      }
    }
  }, [dispatch, tasks.length, user?.role]);

  // fetch users
  useEffect(() => {
    try {
      if (users.length === 0) {
        dispatch(fetchUsers());
      }
    } catch (error) {
      toast.error("Failed to fetch users. Please try again.");
    }
  }, [dispatch, users.length]);

  const allCount = tasks.length;
  const completedCount = tasks.filter(
    (task: Task) => task.status === "completed",
  ).length;
  const inProgressCount = tasks.filter(
    (task: Task) => task.status === "in-progress",
  ).length;
  const pendingCount = tasks.filter(
    (task: Task) => task.status === "pending",
  ).length;

  const filteredTasks =
    activeFilter === "all"
      ? tasks
      : tasks.filter(
          (task) => task.status.toLowerCase() === activeFilter.toLowerCase(),
        );

  const handlDownloadReport = async () => {
    try {
      await dispatch(downloadTasksCSV()).unwrap();
    } catch (error) {
      toast.error("Failed to download report");
    }
  };

  return (
    <div>
   <div className="flex flex-col mb-4">
  {/* Header */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
    <h1 className="text-2xl font-bold">My Tasks</h1>

    {user?.role === "admin" && (
      <button
        onClick={handlDownloadReport}
        className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm w-full sm:w-auto"
      >
        Download Report
      </button>
    )}
  </div>

  {/* Filters */}
  <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
    <FilterButton
      label="All"
      value="all"
      count={allCount}
      activeFilter={activeFilter}
      onClick={setActiveFilter}
    />
    <FilterButton
      label="Completed"
      value="completed"
      count={completedCount}
      activeFilter={activeFilter}
      onClick={setActiveFilter}
    />
    <FilterButton
      label="In Progress"
      value="in-progress"
      count={inProgressCount}
      activeFilter={activeFilter}
      onClick={setActiveFilter}
    />
    <FilterButton
      label="Pending"
      value="pending"
      count={pendingCount}
      activeFilter={activeFilter}
      onClick={setActiveFilter}
    />
  </div>
</div>

      {filteredTasks.length === 0 && (
        <div
          className="flex  w-full  items-center justify-center text-center
             text-gray-500 font-medium py-10"
        >
          No tasks found.
        </div>
      )}
      <div className="w-full h-full grid md:grid-cols-3 gap-3">
        {filteredTasks &&
          filteredTasks.map((task) => <TaskItem key={task._id} task={task} />)}
      </div>
    </div>
  );
};

export default ManageTasks;

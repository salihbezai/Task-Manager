import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  fetchAllTasks,
  getDashboardData,
  getUserDashboardData,
  getUserTasks,
} from "../../featuers/task/taskActions";
import type { AppDispatch, RootState } from "../../store/store";
import type { Task } from "../../featuers/task/taskTypes";

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { totalTasks, completedTasks, pendingTasks, inProgressTasks, tasks } =
    useSelector((state: RootState) => state.task);

  // ⬅️ Pagination State
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(tasks?.length / pageSize) || 1;

  // fetch dashboard data
  useEffect(() => {
    if(user?.role==="admin"){
      dispatch(getDashboardData());
    }else{
      dispatch(getUserDashboardData());
    }
  }, [dispatch, user?.role]);

  // fetch all tasks
  useEffect(() => {
    if(user?.role==="admin"){
          dispatch(fetchAllTasks());
     
    }else{
        dispatch(getUserTasks());
    }
  }, [dispatch,user?.role, tasks.length]);

  const paginatedTasks = useMemo(() => {
    const start = (page - 1) * pageSize;
    return tasks?.slice(start, start + pageSize) || [];
  }, [tasks, page]);

  // Dashboard Stats
  const stats = [
    { label: "Total Tasks", value: totalTasks, color: "bg-blue-600" },
    { label: "Pending", value: pendingTasks, color: "bg-purple-600" },
    { label: "In Progress", value: inProgressTasks, color: "bg-cyan-600" },
    { label: "Completed", value: completedTasks, color: "bg-green-600" },
  ];

  // Pie - Status Distribution
  const distributionData = [
    { name: "Pending", value: pendingTasks },
    { name: "In Progress", value: inProgressTasks },
    { name: "Completed", value: completedTasks },
  ];
  const COLORS = ["#9810FA", "#0092B8", "#00A63E"];

  // 🎯 Priority Chart (Calculated from tasks using useMemo)
  const priorityData = useMemo(() => {
    const low = tasks?.filter((t: Task) => t.priority === "low").length || 0;
    const medium =
      tasks?.filter((t: Task) => t.priority === "medium").length || 0;
    const high = tasks?.filter((t: Task) => t.priority === "high").length || 0;

    return [
      { name: "Low", value: low },
      { name: "Medium", value: medium },
      { name: "High", value: high },
    ];
  }, [tasks]);

  const Task_Priority_Colors = ["#01B170", "#FD8F00", "#FD1C4D"];

  return (
    <div className="px-2 py-4 space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold">
          Hello Mr, <span className="text-blue-600">{user?.name}</span> 👋
        </h1>
        <p className="text-gray-500 text-sm">{new Date().toDateString()}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className="p-4 rounded-xl shadow-md bg-white flex flex-col gap-2"
          >
            <span className="text-gray-500 text-sm">{s.label}</span>
            <span className="text-3xl font-bold">{s.value}</span>
            <div className={`h-2 rounded-full ${s.color}`} />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        {/* Task Distribution */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="font-semibold mb-3">Tasks Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={distributionData}
                  dataKey="value"
                  outerRadius={90}
                  label
                >
                  {distributionData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Levels */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="font-semibold mb-3">Priority Levels</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={priorityData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />

                <Bar dataKey="value">
                  {priorityData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={
                        Task_Priority_Colors[
                          index % Task_Priority_Colors.length
                        ]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Tasks Table */}
      <div className="bg-white shadow-md rounded-xl p-4">
        <h2 className="font-semibold mb-3">Recent Tasks</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2">Task</th>
                {/* <th>Assigned To</th> */}
                {/* <th>CreatedBy</th> */}
                <th>Status</th>
                <th>Priority</th>
                <th>Created On</th>
              </tr>
            </thead>

            <tbody>
              {paginatedTasks.map((t: Task, i: number) => (
                <tr
                  key={i}
                  className="border-b last:border-none hover:bg-gray-50"
                >
                  <td className="py-2">{t.title}</td>
                  {/* <td className="flex py-2 flex-row items-center justify-center space-between gap-1">
                    {
                      t.assignedTo?.map((a: any, i: number) => (
                        <div key={i} className="flex flex-row items-center cursor-pointer">
                          <img src={`http://localhost:5000/uploads/${a.profileImageUrl}`}
                           alt={a.name} className="w-8 h-8 rounded-full cursor-pointer" />
                        </div>
                      ))
                    }
                  </td> */}
                  {/* <td className="py-2">{t.createdBy?.name}</td> */}
                  <td className="py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs
                      ${
                        t.status === "completed"
                          ? "bg-green-300 text-green-900 font-bold"
                          : t.status === "pending"
                            ? "bg-purple-300 text-purple-900 font-bold"
                            : "bg-cyan-300 text-cyan-900 font-bold"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>

                  <td className="py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs
                      ${
                        t.priority === "high"
                          ? "bg-red-300 text-red-900 font-bold"
                          : t.priority === "medium"
                            ? "bg-orange-300 text-orange-900 font-bold"
                            : "bg-green-300 text-green-900 font-bold"
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-2">
                    {t.createdAt ? new Date(t.createdAt).toDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-4 py-1 border rounded cursor-pointer  disabled:opacity-50"
          >
            Prev
          </button>

          <span>
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-1 border rounded cursor-pointer disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

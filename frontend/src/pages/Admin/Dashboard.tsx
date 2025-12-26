import React from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {

  const { user } = useSelector((state: any) => state.auth);
  // -------- Dummy Data (Replace Later) ----------
  const stats = [
    { label: "Total Tasks", value: 120, color: "bg-blue-600" },
    { label: "Pending", value: 45, color: "bg-yellow-500" },
    { label: "In Progress", value: 30, color: "bg-purple-600" },
    { label: "Completed", value: 45, color: "bg-green-600" },
  ];

  const taskStatus = [
    { label: "Pending", value: 45 },
    { label: "In Progress", value: 30 },
    { label: "Completed", value: 45 },
  ];

  const priorityLevels = [
    { label: "Low", value: 25 },
    { label: "Medium", value: 55 },
    { label: "High", value: 40 },
  ];

  const recentTasks = [
    {
      title: "Fix authentication bug",
      assignedTo: "Ahmed",
      status: "In Progress",
      priority: "High",
      dueDate: "2025-01-05",
    },
    {
      title: "Create dashboard UI",
      assignedTo: "Fatima",
      status: "Completed",
      priority: "Medium",
      dueDate: "2025-01-02",
    },
    {
      title: "Setup MongoDB indexes",
      assignedTo: "Ali",
      status: "Pending",
      priority: "High",
      dueDate: "2025-01-10",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold">
          Good Morning, <span className="text-blue-600">{user?.name}</span> 👋
        </h1>
        <p className="text-gray-500 text-sm">
          {new Date().toDateString()}
        </p>
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

      {/* Distribution Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Task Status */}
        <div className="bg-white shadow-md p-4 rounded-xl">
          <h2 className="font-semibold mb-2">Tasks Distribution</h2>

          {taskStatus.map((t, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between text-sm">
                <span>{t.label}</span>
                <span>{t.value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 bg-blue-600 rounded-full"
                  style={{ width: `${t.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Priority */}
        <div className="bg-white shadow-md p-4 rounded-xl">
          <h2 className="font-semibold mb-2">Priority Level</h2>

          {priorityLevels.map((p, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between text-sm">
                <span>{p.label}</span>
                <span>{p.value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    p.label === "High"
                      ? "bg-red-600"
                      : p.label === "Medium"
                      ? "bg-yellow-500"
                      : "bg-green-600"
                  }`}
                  style={{ width: `${p.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white shadow-md rounded-xl p-4">
        <h2 className="font-semibold mb-3">Recent Tasks</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2">Task</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due</th>
              </tr>
            </thead>
            <tbody>
              {recentTasks.map((t, i) => (
                <tr
                  key={i}
                  className="border-b last:border-none hover:bg-gray-50"
                >
                  <td className="py-2">{t.title}</td>
                  <td>{t.assignedTo}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-white text-xs ${
                        t.status === "Completed"
                          ? "bg-green-600"
                          : t.status === "Pending"
                          ? "bg-yellow-500"
                          : "bg-blue-600"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-white text-xs ${
                        t.priority === "High"
                          ? "bg-red-600"
                          : t.priority === "Medium"
                          ? "bg-yellow-500"
                          : "bg-green-600"
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td>{t.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

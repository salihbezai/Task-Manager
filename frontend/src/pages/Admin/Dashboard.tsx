import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Legend
} from "recharts";
import { getDashboardData } from "../../featuers/task/taskActions";
import type { AppDispatch } from "../../store/store";
const Dashboard = () => {
  const dispatch =useDispatch<AppDispatch>(); 
  const { user } = useSelector((state: any) => state.auth);
  const { totalTasks, completedTasks, pendingTasks, inProgressTasks } = useSelector((state: any) => state.task);


  // fetch dashboard data
  useEffect(() => {
    console.log("rn ?")
    dispatch(getDashboardData());
  },[dispatch]);

  const stats = [
    { label: "Total Tasks", value:totalTasks , color: "bg-blue-600" },
    { label: "Pending", value: pendingTasks, color: "bg-purple-600" },
    { label: "In Progress", value: inProgressTasks, color: "bg-cyan-600" },
    { label: "Completed", value: completedTasks, color: "bg-green-600" },
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
      priority: "Low",
      dueDate: "2025-01-10",
    },
  ];

    const distributionData = [
    { name: "Pending", value: pendingTasks },
    { name: "In Progress", value: inProgressTasks },
    { name: "Completed", value: completedTasks },
  ];

  const priorityData = [
    { name: "Low", value: 25 },
    { name: "Medium", value: 55 },
    { name: "High", value: 40 },
  ];

    const COLORS = ["#9810FA", "#0092B8", "#00A63E"];
    const Task_Priority_Colors = ["#01B170", "#FD8F00", "#FD1C4D"];
  

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
    

<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">

            {/* Task Distribution */}
            <div className="bg-white p-4 shadow rounded-lg">
              <h3 className="font-semibold mb-3">Tasks Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer>
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

            {/* Priority */}
            <div className="bg-white p-4 shadow rounded-lg">
              <h3 className="font-semibold mb-3">Priority Levels</h3>
              <div className="h-64">
                <ResponsiveContainer>
                  <BarChart data={priorityData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                        <Bar dataKey="value">
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={Task_Priority_Colors[index % Task_Priority_Colors.length]} />
                      ))}
                      </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
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
                      className={`px-2 py-1 rounded  text-xs ${
                        t.status === "Completed"
                          ? "bg-green-300 text-green-900 font-bold"
                          : t.status === "Pending"
                          ? "bg-purple-300 text-purple-900 font-bold"
                          : "bg-cyan-300 text-cyan-900 font-bold"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        t.priority === "High"
                          ? "bg-red-300 text-red-900 font-bold"
                          : t.priority === "Medium"
                          ?  "bg-orange-300 text-orange-900 font-bold"
                          :  "bg-green-300 text-green-900 font-bold"
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

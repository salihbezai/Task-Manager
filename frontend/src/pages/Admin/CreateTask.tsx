import React, { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
// import { createTask } from "../../featuers/task/taskActions";

const CreateTask = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    dueDate: "",
  });

  const [attachments, setAttachments] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setAttachments([...e.target.files]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", task.title);
    formData.append("description", task.description);
    formData.append("priority", task.priority);
    formData.append("status", task.status);
    formData.append("dueDate", task.dueDate);

    attachments.forEach((file) => formData.append("attachments", file));

    // await dispatch(createTask(formData));
  };

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
            className="w-full p-2 border rounded"
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
            className="w-full p-2 border rounded h-24"
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
              className="w-full p-2 border rounded"
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
              className="w-full p-2 border rounded"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In-Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label className="block font-medium mb-1">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={task.dueDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Attachments */}
        <div>
          <label className="block font-medium mb-1">Attachments</label>
          <input type="file" multiple onChange={handleFileChange} />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Task
        </button>
      </form>
    </div>
  );
};

export default CreateTask;

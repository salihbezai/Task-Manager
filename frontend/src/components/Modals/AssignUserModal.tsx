import React, { useState } from "react";

interface IUser {
  _id: string;
  name: string;
  email: string;
  profileImageUrl: string;
}

interface Props {
  users: IUser[];
  selectedUsers: string[];
  onClose: () => void;
  onDone: (ids: string[]) => void;
}

const AssignUsersModal: React.FC<Props> = ({
  users,
  selectedUsers,
  onClose,
  onDone,
}) => {
  const [selected, setSelected] = useState<string[]>(selectedUsers);

  const toggleUser = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id],
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-100 rounded-lg p-4 shadow-lg">
        <h3 className="text-lg font-semibold mb-3">Assign Users</h3>

        <div className="max-h-60 overflow-y-auto space-y-2">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => toggleUser(user._id)}
              className={`flex items-center gap-3 p-2 border rounded cursor-pointer
                ${selected.includes(user._id) ? "bg-blue-100 border-blue-400" : ""}`}
            >
              <img
                src={`http://localhost:5000/uploads/${user.profileImageUrl}`}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <span>{user.name}</span>
                <p className="text-xs text-gray-700">{user.email}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-3 py-1 rounded bg-gray-200">
            Cancel
          </button>

          <button
            onClick={() => onDone(selected)}
            className="px-3 py-1 rounded bg-blue-600 text-white"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignUsersModal;

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import MemberCard from "./MemberCard";
import { useEffect } from "react";
import { downloadUsersCSV, fetchUsers } from "../../featuers/user/userActions";
import { toast } from "react-toastify";

const ManageUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users } = useSelector(
    (state: RootState) => state.user
  );

  // fetch users on component mount
  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length]);

  const handlDownloadReport = async () => {
    try {
      await dispatch(downloadUsersCSV()).unwrap();
    } catch (error: unknown) {
      toast.error("Failed to download report");
    }
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        {/* Filter tasks on status nav  */}
        <div className="flex">
          {/* download report button */}
          <div className="ml-4">
            <button
              onClick={handlDownloadReport}
              className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
            >
              Download Report
            </button>
          </div>
        </div>
      </div>

      <div className="w-full h-full grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <MemberCard key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;

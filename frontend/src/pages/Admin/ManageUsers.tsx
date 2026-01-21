import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import MemberCard from "./MemberCard";
import { useEffect } from "react";
import { fetchUsers } from "../../featuers/user/userActions";

const ManageUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const  { users, loading, error } = useSelector((state: RootState) => state.user);



// fetch users on component mount
  useEffect(() => {
    if(users.length === 0){
     dispatch(fetchUsers());
    }
  }, [dispatch, users.length]);


  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
      <div className="w-full h-full grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <MemberCard key={user._id} user={user} />
        ))}
      </div>

    </div>
  )
}

export default ManageUsers

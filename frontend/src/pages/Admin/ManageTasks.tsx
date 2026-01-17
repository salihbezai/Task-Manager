import TaskItem from './TaskItem'
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from "../../store/store";
import { useEffect } from 'react';
import { fetchAllTasks } from '../../featuers/task/taskActions';
import { fetchUsers } from '../../featuers/user/userActions';

const ManageTasks = () => {
  
  const dispatch = useDispatch<AppDispatch>();
  const  { tasks, loading, error } = useSelector((state: any) => state.task);
  const  { users } = useSelector((state: any) => state.user);

  // fetch tasks 
  useEffect(() => {
    if(tasks.length === 0){
     dispatch(fetchAllTasks());
    }
  }, [dispatch,tasks.length]); 

  // fetch users
  useEffect(() => {
    if(users.length === 0){
     dispatch(fetchUsers());
    }
  }, [dispatch,users.length]);


  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>My Tasks</h1>
        {/* Filter tasks on status nav  */}
        <div className='flex'>
          <button className='text-gray px-4 py-2 rounded mr-2 cursor-pointer'>All</button>
          <button className='text-gray px-4 py-2 rounded mr-2 cursor-pointer'>Completed</button>
          <button className='text-gray px-4 py-2 rounded mr-2 cursor-pointer'>In Progress</button>
          <button className='text-gray px-4 py-2 rounded mr-2 cursor-pointer'>Pending</button>
          {/* download report button */}
          <div className='ml-4'>
          <button className='bg-blue-500 text-white px-4 py-2 rounded cursor-pointer'>Download Report</button>
          </div>
        </div>
  
      </div>
    <div className='w-full grid md:grid-cols-3 gap-2 bg-gray-100'>

      {
        tasks && tasks.map((task) => (<TaskItem task={task} users={users}/>))
      }
    
    </div>
    </div>

  )
}

export default ManageTasks

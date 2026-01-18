import TaskItem from './TaskItem'
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from "../../store/store";
import { useEffect, useState } from 'react';
import { fetchAllTasks } from '../../featuers/task/taskActions';
import { fetchUsers } from '../../featuers/user/userActions';



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
  const  { tasks, loading, error } = useSelector((state: any) => state.task);
  const  { users } = useSelector((state: any) => state.user);

  const [ activeFilter, setActiveFilter ] = useState('all');

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

  const allCount = tasks.length;
  const completedCount = tasks.filter((task: any) => task.status === 'completed').length;
  const inProgressCount = tasks.filter((task: any) => task.status === 'in-progress').length;
  const pendingCount = tasks.filter((task: any) => task.status === 'pending').length;

  const filteredTasks =  activeFilter === 'all' ? tasks :
  tasks.filter(task=>task.status.toLowerCase() === activeFilter.toLowerCase());



  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>My Tasks</h1>
        {/* Filter tasks on status nav  */}
        <div className='flex'>
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
          {/* download report button */}
          <div className='ml-4'>
          <button className='bg-blue-500 text-white px-4 py-2 rounded cursor-pointer'>Download Report</button>
          </div>
        </div>
  
      </div>
       {
          filteredTasks.length === 0 && (
            <div className='flex  w-full  items-center justify-center text-center
             text-gray-500 font-medium py-10'>
              No tasks found.
            </div>
          )
        }
      <div className='w-full h-full grid md:grid-cols-3 gap-3'>

        {
          filteredTasks && filteredTasks.map((task) => (<TaskItem key={task._id} task={task} users={users}/>))
        }
      
      </div>
    </div>

  )
}

export default ManageTasks

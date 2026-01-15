import TaskItem from './TaskItem'
import { useSelector } from 'react-redux';
import type { AppDispatch } from "../../store/store";

const ManageTasks = () => {
  
  const  { tasks, loading, error } = useSelector((state: any) => state.task);
  console.log("ttasks is "+tasks)
  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>My Tasks</h1>
        {/* Filter tasks on status */}
        <div>
          Pednding
        </div>
      </div>
    <div className='w-full grid md:grid-cols-3 gap-2'>

      {
        tasks && tasks.map((task) => (<TaskItem task={task}/>))
      }
    
    </div>
    </div>

  )
}

export default ManageTasks

import { useSelector } from 'react-redux';

import { Navigate, Outlet } from 'react-router-dom'
import type { RootState } from '../store/store';

interface PrivatRouteProps {
  allowedRoles: string[];
}
const PrivateRoute = ({ allowedRoles }: PrivatRouteProps) => {
  const { user, loading } = useSelector((state: RootState)=> state.auth);
  
  if(loading){
    return <div>Loading...</div>
  }

  // if(!user || !allowedRoles.includes(user.role)){
  //   return <Navigate to='/login' />
  // }

 return <Outlet />
}

export default PrivateRoute

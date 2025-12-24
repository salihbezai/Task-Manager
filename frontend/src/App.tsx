import React, { useEffect } from 'react'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import PrivateRoute from './routes/PrivateRoute'

import Dashboard from './pages/Admin/Dashboard'
import ManageTasks from './pages/Admin/ManageTasks'
import CreateTask from './pages/Admin/CreateTask'
import ManageUsers from './pages/Admin/ManageUsers'


import UserDashboard from './pages/User/UserDashboard'
import MyTasks from './pages/User/MyTasks'
import ViewTaskDetails from './pages/User/ViewTaskDetails'
import { useDispatch } from 'react-redux'
import { fetchCurrentUser } from './featuers/auth/authActions'
import type { AppDispatch } from './store/store'
import AdminLayout from './components/layout/AdminLayout'
import UserLayout from './components/layout/UserLayout'


const App=()=> {
  const dispatch = useDispatch<AppDispatch>(); 

  useEffect(()=> {
    dispatch(fetchCurrentUser());
  },[dispatch])

  return (
  <div>
    <Router>
      <Routes>
      <Route path='/login' element={<Login />}  />
      <Route path='/signup' element={<Signup />}  />

      {/* Admin Routes */}
      {/* <Route element={<PrivateRoute allowedRoles={['admin']} />}>
          <Route path='/admin/dashboard' element={<Dashboard />}  />
          <Route path='/admin/tasks' element={<ManageTasks />}  />
          <Route path='/admin/create-task' element={<CreateTask />}  />
          <Route path='/admin/users' element={<ManageUsers />}  />
      </Route> */}


<Route element={<PrivateRoute allowedRoles={['admin']} />}>
  
  <Route path="/admin" element={<AdminLayout />}>

      <Route path="dashboard" element={<Dashboard />} />
      <Route path="tasks" element={<ManageTasks />} />
      <Route path="create-task" element={<CreateTask />} />
      <Route path="users" element={<ManageUsers />} />

  </Route>

</Route>



<Route element={<PrivateRoute allowedRoles={['member']} />}>
  
  <Route path="/user" element={<UserLayout />}>
      <Route path="dashboard" element={<UserDashboard />} />
      <Route path="my-tasks" element={<MyTasks />} />
      <Route path="task-details/:id" element={<ViewTaskDetails />} />
  </Route>

</Route>



           {/* user Routes */}
      {/* <Route element={<PrivateRoute allowedRoles={['member']} />}>
          <Route path='/user/dashboard' element={<UserDashboard />}  />
          <Route path='/user/my-tasks' element={<MyTasks />}  />
          <Route path='/user/task-details/:id' element={<ViewTaskDetails />}  />

      </Route> */}


      </Routes>

    </Router>
  </div>
  )
}

export default App

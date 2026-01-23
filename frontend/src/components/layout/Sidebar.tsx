import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdTask,
  MdGroup,
  MdAddTask,
  MdLogout,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { logoutUser } from "../../featuers/auth/authActions";
import { toast } from "react-toastify";

const Sidebar = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const adminMenu = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: <MdDashboard size={20} />,
    },
    { label: "Manage Tasks", path: "/admin/tasks", icon: <MdTask size={20} /> },
    {
      label: "Create Task",
      path: "/admin/create-task",
      icon: <MdAddTask size={20} />,
    },
    {
      label: "Team Members",
      path: "/admin/users",
      icon: <MdGroup size={20} />,
    },
  ];

  const userMenu = [
    {
      label: "Dashboard",
      path: "/user/dashboard",
      icon: <MdDashboard size={20} />,
    },
    { label: "My Tasks", path: "/user/my-tasks", icon: <MdTask size={20} /> },
  ];

  const menu = user?.role === "admin" ? adminMenu : userMenu;

  const handlLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged out successfully.");
      navigate("/login");
    } catch (error) {
      toast.error("Error logging out. Please try again.");
    }
  };

  return (
    <>
      <aside
        className={`
          fixed top-16 left-0 h-screen shadow-sm
          transition-all duration-300 z-50
          w-64 bg-white
          md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
           border-t  border-r border-gray-200
          
        `}
      >
        <div className="p-4">
          {/* USER SECTION */}
          <div className="flex flex-col items-center">
            <img
              src={`http://localhost:5000/uploads/${user?.profileImageUrl}`}
              className="w-18 h-18 rounded-full"
            />

            <div
              className="inline-flex items-center justify-center mt-1 
              px-2 py-1 text-xs font-medium 
              bg-blue-600 text-white rounded-md"
            >
              {user?.role}
            </div>

            <div className="mt-2 flex flex-col items-center">
              <h1 className="text-lg font-semibold text-gray-900">
                {" "}
                {user?.name}
              </h1>
              <p className="text-sm text-gray-500"> {user?.email}</p>
            </div>
          </div>

          {/* MENU */}
          <nav className="mt-6 space-y-2">
            {menu.map((item) => {
              const isActive = location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-2 rounded-md
                    transition 
                    ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-800 hover:bg-gray-300 hover:text-gray-900"
                    }
                  `}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}

            {/* Logout */}
            <button
              type="button"
              className="w-full text-left flex items-center gap-3 px-4 py-2 rounded-md
              text-gray-800 hover:bg-red-600 hover:text-white transition cursor-pointer"
              onClick={handlLogout}
            >
              <MdLogout size={20} />
              Logout
            </button>
          </nav>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;

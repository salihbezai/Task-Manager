import { Link, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdTask,
  MdGroup,
  MdAddTask,
  MdLogout,
} from "react-icons/md";

const Sidebar = ({
  isOpen,
  setIsOpen,
  role = "Admin",
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  role?: "Admin" | "Member";
}) => {
  const location = useLocation();

  const adminMenu = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <MdDashboard size={20} /> },
    { label: "Manage Tasks", path: "/admin/tasks", icon: <MdTask size={20} /> },
    { label: "Create Task", path: "/admin/create-task", icon: <MdAddTask size={20} /> },
    { label: "Team Members", path: "/admin/users", icon: <MdGroup size={20} /> },
  ];

  const userMenu = [
    { label: "My Tasks", path: "/tasks", icon: <MdTask size={20} /> },
    { label: "Create Task", path: "/tasks/create", icon: <MdAddTask size={20} /> },
    { label: "Profile", path: "/profile", icon: <MdGroup size={20} /> },
  ];

  const menu = role === "Admin" ? adminMenu : userMenu;

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
              src="https://i.pravatar.cc/150?img=1"
              className="w-18 h-18 rounded-full"
            />

            <div className="inline-flex items-center justify-center mt-1 
              px-2 py-1 text-xs font-medium 
              bg-blue-600 text-white rounded-md"
            >
              {role === "Admin" ? "Admin" : "Member"}
            </div>

            <div className="mt-2 flex flex-col items-center">
              <h1 className="text-lg font-semibold text-gray-900">Salih</h1>
              <p className="text-sm text-gray-500">salih@gmail.com</p>
            </div>
          </div>

          {/* MENU */}
          <nav className="mt-6 space-y-2">
            {menu.map((item, index) => {
              const isActive = location.pathname.startsWith(item.path);

              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-2 rounded-md
                    transition
                    ${isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-800 hover:bg-gray-300 hover:text-gray-900"}
                  `}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}

            {/* Logout */}
            <Link
              to="/logout"
              className="flex items-center gap-3 px-4 py-2 rounded-md
              text-gray-800 hover:bg-red-600 hover:text-white transition"
            >
              <MdLogout size={20} />
              Logout
            </Link>
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

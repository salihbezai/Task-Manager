import { Outlet, useNavigate } from "react-router-dom";

import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../ErrorFallback";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <Navbar
        toggleSidebar={() => setIsOpen((prev) => !prev)}
        isOpen={isOpen}
      />

      <div className="flex pt-16">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        <main
          className={`w-full h-full min-h-screen px-2 py-4 transition-all duration-300 bg-gray-100
            md:ml-64`}
        >
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
              navigate("/admin/dashboard");
              navigate(0); 
            }}
            onError={(error,info)=>{
              console.error("UI Crash: ",error,info)
            }}
          >
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;

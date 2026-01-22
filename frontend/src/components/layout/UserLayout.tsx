import { Outlet } from "react-router-dom";

import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const UserLayout = () => {
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
          className={`w-full transition-all duration-300 bg-red-400
            md:ml-64`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;

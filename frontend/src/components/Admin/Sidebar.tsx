const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <aside className={
      `fixed top-16 left-0 h-screen shadow-lg
     transition-all duration-300  bg-red-500 ${isOpen ? "w-64" : "w-0 overflow-hidden"}`
    }>
      <h1>sidebar content</h1>
    </aside>
  );
};

export default Sidebar;

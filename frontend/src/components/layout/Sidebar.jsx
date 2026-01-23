import { useState } from "react";
import "./styles/Sidebar.css";

const Sidebar = ({ user, setActiveView }) => {
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved === "true";
  });

  const toggleSidebar = () => {
    setCollapsed(prev => {
      localStorage.setItem("sidebar-collapsed", !prev);
      return !prev;
    });
  };


  if (!user) return null;

  return (
    <>
      {/* Sidebar */}
      <div className={`sidebar ${collapsed ? "closed" : ""}`}>
        <div className="sidebar-content">
          <button
            title={collapsed ? "Przepisy" : undefined}
            onClick={() => setActiveView("recipes")}
          >
            🍽 <span className="label">Przepisy</span>
          </button>

          <button
            title={collapsed ? "Harmonogram" : undefined}
            onClick={() => setActiveView("schedule")}
          >
            📅 <span className="label">Harmonogram</span>
          </button>
        </div>

        {/* Desktop collapse */}
        <button
          className="collapse-btn desktop"
          onClick={toggleSidebar}
        >
          {collapsed ? ">" : "<"}
        </button>
      </div>

      {/* Mobile hamburger */}
      <button
        className="collapse-btn mobile"
        onClick={() => setCollapsed(!collapsed)}
      >
        ☰
      </button>
    </>
  );
};

export default Sidebar;
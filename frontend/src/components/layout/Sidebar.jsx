import { useState } from "react";
import "./styles/Sidebar.css";

const Sidebar = ({ user, setActiveView }) => {
  const [collapsed, setCollapsed] = useState(false);

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
          onClick={() => setCollapsed(!collapsed)}
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
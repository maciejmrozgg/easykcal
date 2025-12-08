import { useState } from "react";
import "./styles/Sidebar.css";

const Sidebar = ({ user, setActiveView }) => {
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  return (
    <div className={`sidebar ${collapsed ? "closed" : ""}`}>

      {!collapsed && (
        <div className="sidebar-content">
          <button onClick={() => setActiveView("recipes")}>
            🍽 Przepisy
          </button>

          <button onClick={() => setActiveView("schedule")}>
            📅 Harmonogram
          </button>
        </div>
      )}

      <button
        className="collapse-btn"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? ">" : "<"}
      </button>

    </div>
  );
};

export default Sidebar;

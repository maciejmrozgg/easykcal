import { useState, useEffect } from "react";
import "./styles/Sidebar.css";
import useMediaQuery from "../../hooks/useMediaQuery";
import UserSettingsModal from "./modals/UserSettingsModal";

const Sidebar = ({ user, setActiveView, collapsed, setCollapsed }) => {

  const [settingsOpen, setSettingsOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");

  // State initialization
  useEffect(() => {
    if (isMobile) {
      // mobile always starts collapsed
      setCollapsed(true);
    } else {
      // desktop read saved state
      const saved = localStorage.getItem("sidebar-collapsed");
      if (saved !== null) {
        setCollapsed(saved === "true");
      }
    }
  }, [isMobile]);

  // Toggle
  const toggleSidebar = () => {
    setCollapsed(prev => {
      if (!isMobile) {
        // save only for desktop
        localStorage.setItem("sidebar-collapsed", String(!prev));
      }
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

          <button
            title={collapsed ? "Produkty" : undefined}
            onClick={() => setActiveView("products")}
          >
            📦 <span className="label">Produkty</span>
          </button>

          <button
            title={collapsed ? "Ustawienia użytkownika" : undefined}
            onClick={() => setSettingsOpen(true)}
          >
            ⚙️ <span className="label">Ustawienia użytkownika</span>
          </button>
        </div>

        {/* Desktop collapse */}
        {!isMobile && (
          <button
            className="collapse-btn desktop"
            onClick={toggleSidebar}
          >
            {collapsed ? ">" : "<"}
          </button>
        )}
      </div>

      {/* Mobile hamburger */}
      {isMobile && (
        <button
          className="collapse-btn mobile"
          onClick={toggleSidebar}
        >
          ☰
        </button>
      )}
      
      {/* User settings modal */}
      <UserSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
};

export default Sidebar;
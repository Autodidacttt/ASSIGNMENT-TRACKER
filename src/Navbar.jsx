import React from "react";

const PAGES = [
  { key: "tracker",   label: "Tracker",   icon: "📋" },
  { key: "dashboard", label: "Dashboard", icon: "📊" },
  { key: "calendar",  label: "Calendar",  icon: "📅" },
  { key: "subjects",  label: "Subjects",  icon: "📚" },
  { key: "profile",   label: "Profile",   icon: "👤" },
];

function Navbar({ activePage, setActivePage }) {
  return (
    <nav className="navbar">
      {PAGES.map((p) => (
        <button
          key={p.key}
          className={`nav-btn ${activePage === p.key ? "active" : ""}`}
          onClick={() => setActivePage(p.key)}
        >
          <span className="nav-icon">{p.icon}</span>
          <span className="nav-label">{p.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default Navbar;

import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import { homeFor } from "../auth/roles";
import { useSchoolConfig } from "../auth/SchoolConfigContext";
import "../portal.css";

const ROLE_BADGES = {
  admin: { label: "Administrator", bg: "#fef3c7", color: "#92400e", border: "#fde68a" },
  teacher: { label: "Faculty / Teacher", bg: "#e0e7ff", color: "#3730a3", border: "#c7d2fe" },
  student: { label: "Student", bg: "#dcfce7", color: "#166534", border: "#bbf7d0" },
};

export default function PortalLayout() {
  const { user, logout } = useAuth();
  const { config } = useSchoolConfig();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const roleMeta = ROLE_BADGES[user?.role] || {
    label: user?.role || "User",
    bg: "#f1f5f9",
    color: "#334155",
    border: "#e2e8f0",
  };

  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") || user?.username || "Account";
  const userInitials = (displayName || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const brandInitial = (config.short_name || config.name || "S").charAt(0).toUpperCase();

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: "#f8fafc" }}>
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark portal-navbar sticky-top">
        <div className="container-fluid px-3 px-lg-4">
          {/* Brand Logo & Name */}
          <Link
            className="navbar-brand d-flex align-items-center gap-2 text-decoration-none me-3"
            to={homeFor(user.role) ?? "/"}
          >
            {config.logo ? (
              <img
                src={config.logo}
                alt={`${config.name} logo`}
                className="portal-brand-logo"
              />
            ) : (
              <div className="portal-brand-avatar">{brandInitial}</div>
            )}
            <div className="d-flex flex-column">
              <span className="portal-school-title">
                {config.short_name || config.name}
              </span>
              <span className="badge bg-white-subtle text-white-50 p-0 text-start" style={{ fontSize: "0.68rem", letterSpacing: "0.08em" }}>
                MANAGEMENT PORTAL
              </span>
            </div>
          </Link>

          {/* Mobile Toggler */}
          <button
            className="navbar-toggler border-0 p-1"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="navbar-toggler-icon" />
          </button>

          {/* Navigation Items & User Controls */}
          <div className={`collapse navbar-collapse${open ? " show" : ""} mt-2 mt-lg-0`}>
            {/* Left Nav Links */}
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-1">
              <li className="nav-item">
                <NavLink
                  to={homeFor(user.role) ?? "/"}
                  end
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `nav-link px-3 py-2 rounded-2 fw-semibold ${
                      isActive ? "active text-white bg-white-subtle" : "text-white-50"
                    }`
                  }
                >
                  📊 Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <Link
                  className="btn-portal-website nav-link d-inline-flex align-items-center gap-1 my-1 my-lg-0"
                  to="/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>🌐</span> School Website
                </Link>
              </li>
            </ul>

            {/* Right User Bar */}
            <div className="d-flex flex-wrap align-items-center gap-2 pt-2 pt-lg-0 border-top border-lg-0 border-secondary">
              {/* User Chip */}
              <div className="portal-user-chip">
                <div className="portal-avatar-circle">{userInitials}</div>
                <div className="d-flex flex-column">
                  <span className="text-white fw-bold" style={{ fontSize: "0.85rem", lineHeight: 1.2 }}>
                    {displayName}
                  </span>
                  <div className="d-flex align-items-center gap-1">
                    <span
                      className="portal-badge-pill"
                      style={{
                        backgroundColor: roleMeta.bg,
                        color: roleMeta.color,
                        border: `1px solid ${roleMeta.border}`,
                      }}
                    >
                      {roleMeta.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Password Setting Link */}
              <NavLink
                to="/change-password"
                onClick={() => setOpen(false)}
                className="btn btn-sm text-white-50 hover-text-white d-inline-flex align-items-center gap-1 text-decoration-none px-2 py-1"
                title="Change account password"
              >
                <span>🔑</span>
                <span className="small">Password</span>
              </NavLink>

              {/* High-Visibility Logout Button */}
              <button
                type="button"
                className="btn-portal-logout"
                onClick={handleLogout}
                title="Sign out of your account"
              >
                <span>🚪</span>
                <span>Log out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Viewport */}
      <main className="container-fluid px-3 px-lg-4 py-4 flex-grow-1" style={{ maxWidth: "1400px" }}>
        <Outlet />
      </main>

      {/* Subtle Footer */}
      <footer className="border-top py-3 text-center text-muted small bg-white mt-auto">
        <div className="container">
          <span>{config.name}</span> &copy; {new Date().getFullYear()} — Secure Management Portal
        </div>
      </footer>
    </div>
  );
}

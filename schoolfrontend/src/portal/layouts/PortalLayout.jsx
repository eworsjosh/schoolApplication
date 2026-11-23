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
      {/* Top Permanent Navbar (Always Visible, Never Collapses Away) */}
      <nav className="portal-navbar sticky-top">
        <div className="container-fluid px-3 px-lg-4 d-flex align-items-center justify-content-between flex-wrap gap-2">
          
          {/* Left: Brand Logo, School Title, and Quick Navigation Links */}
          <div className="d-flex align-items-center gap-3">
            <Link
              className="d-flex align-items-center gap-2 text-decoration-none"
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
                  PORTAL
                </span>
              </div>
            </Link>

            {/* Quick Links on Left */}
            <div className="d-none d-md-flex align-items-center gap-2 ms-2 ps-3 border-start border-secondary">
              <NavLink
                to={homeFor(user.role) ?? "/"}
                end
                className={({ isActive }) =>
                  `px-2 py-1 rounded text-decoration-none small fw-semibold ${
                    isActive ? "text-white bg-white-subtle" : "text-white-50 hover-text-white"
                  }`
                }
              >
                📊 Dashboard
              </NavLink>
              <Link
                className="btn-portal-website"
                to="/"
                target="_blank"
                rel="noreferrer"
                title="View public school website"
              >
                🌐 School Website
              </Link>
            </div>
          </div>

          {/* Right: User Information and Prominent Logout Button (Always Visible!) */}
          <div className="d-flex align-items-center gap-2 ms-auto">
            {/* User Chip */}
            <div className="portal-user-chip d-none d-sm-flex">
              <div className="portal-avatar-circle">{userInitials}</div>
              <div className="d-flex flex-column">
                <span className="text-white fw-bold" style={{ fontSize: "0.82rem", lineHeight: 1.2 }}>
                  {displayName}
                </span>
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

            {/* Change Password Link */}
            <NavLink
              to="/change-password"
              className="btn btn-sm text-white-50 hover-text-white d-none d-sm-inline-flex align-items-center gap-1 text-decoration-none px-2 py-1"
              title="Change your account password"
            >
              <span>🔑</span>
              <span className="small">Password</span>
            </NavLink>

            {/* Prominent High-Visibility Log Out Button (Always visible on all screens!) */}
            <button
              type="button"
              className="btn-portal-logout"
              onClick={handleLogout}
              title="Sign out of the school portal"
            >
              <span>🚪</span>
              <span>Log out</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Row for Quick Links on very small screens */}
        <div className="d-flex d-md-none justify-content-between align-items-center px-3 pt-2 mt-1 border-top border-secondary">
          <NavLink
            to={homeFor(user.role) ?? "/"}
            end
            className={({ isActive }) =>
              `text-decoration-none small fw-semibold ${
                isActive ? "text-white" : "text-white-50"
              }`
            }
          >
            📊 Dashboard
          </NavLink>
          <NavLink
            to="/change-password"
            className="text-decoration-none small text-white-50"
          >
            🔑 Password
          </NavLink>
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="text-decoration-none small text-white-50"
          >
            🌐 Website
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="container-fluid px-3 px-lg-4 py-4 flex-grow-1" style={{ maxWidth: "1400px" }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-top py-3 text-center text-muted small bg-white mt-auto">
        <div className="container">
          <span>{config.name}</span> &copy; {new Date().getFullYear()} — Secure School Management Portal
        </div>
      </footer>
    </div>
  );
}

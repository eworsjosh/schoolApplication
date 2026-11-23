import { Link } from "react-router";
import { useAuth } from "../portal/auth/AuthContext";
import { homeFor } from "../portal/auth/roles";
import { useSchoolConfig } from "../portal/auth/SchoolConfigContext";

function Header() {
  const { user } = useAuth();
  const { config } = useSchoolConfig();
  const portalTo = (user && homeFor(user.role)) || "/login";
  const portalLabel = user ? `My Portal (${user.role})` : "Portal Login";
  const initial = (config.short_name || config.name || "S").charAt(0).toUpperCase();

  return (
    <header className="bg-blue-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 py-4 first:pt-0 last:pb-0">
            {config.logo ? (
              <img
                src={config.logo}
                alt={`${config.name} logo`}
                className="w-16 h-16 rounded-full object-cover bg-white p-1"
              />
            ) : (
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-900 font-bold text-xl">{initial}</span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{config.name}</h1>
              <p className="text-blue-200 text-sm">{config.tagline || "Excellence in Education"}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex space-x-6 text-decoration-line: none;">
              <a href="#home" className="text-white hover:text-yellow-600 transition-colors text-decoration-line: none">Home</a>
              <a href="#about" className="hover:text-yellow-300 transition-colors text-white">About</a>
              <a href="#programs" className="hover:text-yellow-300 transition-colors text-white">Programs</a>
              <a href="#admissions" className="hover:text-yellow-300 transition-colors text-white">Admissions</a>
              <a href="#contact" className="hover:text-yellow-300 transition-colors text-white">Contact</a>
            </nav>
            <Link to={portalTo} className="btn btn-warning fw-semibold">
              {portalLabel}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header

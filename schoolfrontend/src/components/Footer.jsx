import { Link } from "react-router";
import { useSchoolConfig } from "../portal/auth/SchoolConfigContext";

function Footer() {
  const { config } = useSchoolConfig();
  const initial = (config.short_name || config.name || "S").charAt(0).toUpperCase();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              {config.logo ? (
                <img
                  src={config.logo}
                  alt={`${config.name} logo`}
                  className="w-12 h-12 rounded-full object-cover bg-white p-1"
                />
              ) : (
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-900 font-bold text-lg">{initial}</span>
                </div>
              )}
              <h3 className="font-bold text-lg">{config.name}</h3>
            </div>
            <p className="text-gray-400 text-sm">
              {config.tagline || "Dedicated to providing quality education and nurturing the next generation of leaders."}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-yellow-300">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {[["#home","Home"],["#about","About Us"],["#programs","Programs"],["#admissions","Admissions"]].map(([href, label]) => (
                <li key={href}><a href={href} className="hover:text-white transition-colors">{label}</a></li>
              ))}
              <li><Link to="/login" className="text-yellow-400 hover:text-white font-medium transition-colors">School Portal Login →</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-yellow-300">Programs</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Elementary School</li><li>Middle School</li><li>High School</li><li>Summer Programs</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-yellow-300">Contact Info</h4>
            <div className="space-y-2 text-sm text-gray-400">
              {config.address && <p>📍 {config.address}</p>}
              {config.phone && <p>📞 {config.phone}</p>}
              {config.email && <p>✉️ {config.email}</p>}
              {!config.address && !config.phone && !config.email && (
                <p className="text-muted">Contact details available upon request.</p>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">© {currentYear} {config.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
export default Footer
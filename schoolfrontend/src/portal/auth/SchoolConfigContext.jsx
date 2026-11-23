import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { API_URL } from "../config";

const DEFAULT_CONFIG = {
  name: import.meta.env.VITE_SCHOOL_NAME || "School Management Portal",
  short_name: "",
  tagline: "Excellence in Education",
  logo: null,
  logo_url: "",
  address: "",
  phone: "",
  email: "",
  office_hours: "Mon–Fri: 8:00 AM – 4:00 PM",
  primary_color: "#1e3a8a",
  secondary_color: "#fbbf24",
  currency_code: "NGN",
  currency_symbol: "₦",
};

const SchoolConfigContext = createContext({
  config: DEFAULT_CONFIG,
  loading: true,
  refreshConfig: () => Promise.resolve(),
});

export function SchoolConfigProvider({ children }) {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/school-config/`);
      if (res.ok) {
        const data = await res.json();
        setConfig((prev) => ({ ...prev, ...data }));
        if (data.name) {
          document.title = data.name;
        }
      }
    } catch (err) {
      console.warn("Could not load school configuration from server, using defaults.", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return (
    <SchoolConfigContext.Provider value={{ config, loading, refreshConfig: fetchConfig }}>
      {children}
    </SchoolConfigContext.Provider>
  );
}

export function useSchoolConfig() {
  const context = useContext(SchoolConfigContext);
  if (!context) {
    throw new Error("useSchoolConfig must be used within a SchoolConfigProvider");
  }
  return context;
}

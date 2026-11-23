import { useState, useEffect } from "react";
import { api, errorMessages } from "../../api/client";
import { useSchoolConfig } from "../../auth/SchoolConfigContext";

export default function SchoolSettingsSection() {
  const { config, refreshConfig } = useSchoolConfig();
  const [formData, setFormData] = useState({
    name: "",
    short_name: "",
    tagline: "",
    logo_url: "",
    address: "",
    phone: "",
    email: "",
    office_hours: "",
    primary_color: "#1e3a8a",
    secondary_color: "#fbbf24",
    currency_code: "NGN",
    currency_symbol: "₦",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (config) {
      setFormData({
        name: config.name || "",
        short_name: config.short_name || "",
        tagline: config.tagline || "",
        logo_url: config.logo_url || "",
        address: config.address || "",
        phone: config.phone || "",
        email: config.email || "",
        office_hours: config.office_hours || "Mon–Fri: 8:00 AM – 4:00 PM",
        primary_color: config.primary_color || "#1e3a8a",
        secondary_color: config.secondary_color || "#fbbf24",
        currency_code: config.currency_code || "NGN",
        currency_symbol: config.currency_symbol || "₦",
      });
    }
  }, [config]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setErrors([]);
    try {
      await api("/api/school-config/", {
        method: "PATCH",
        body: formData,
      });
      await refreshConfig();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setErrors(errorMessages(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
        <div>
          <h5 className="fw-bold mb-1">🏫 School Identity & Customization</h5>
          <p className="text-muted small mb-0">
            Customize your school name, logo, contact details, and portal appearance.
          </p>
        </div>
      </div>
      <div className="card-body p-4">
        {success && (
          <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
            <span>✓ School branding and configuration updated successfully!</span>
          </div>
        )}

        {errors.length > 0 && (
          <div className="alert alert-danger py-2 mb-4" role="alert">
            <ul className="mb-0 ps-3">
              {errors.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* School Name */}
            <div className="col-md-8">
              <label className="form-label fw-semibold">School Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Greenfield International Academy"
                required
              />
            </div>

            {/* Short Name / Acronym */}
            <div className="col-md-4">
              <label className="form-label fw-semibold">Short Name / Acronym</label>
              <input
                type="text"
                name="short_name"
                className="form-control"
                value={formData.short_name}
                onChange={handleChange}
                placeholder="e.g. GIA"
              />
            </div>

            {/* Tagline / Motto */}
            <div className="col-md-12">
              <label className="form-label fw-semibold">Motto / Tagline</label>
              <input
                type="text"
                name="tagline"
                className="form-control"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="e.g. Nurturing Future Leaders"
              />
            </div>

            {/* Logo URL */}
            <div className="col-md-12">
              <label className="form-label fw-semibold">Logo Image URL</label>
              <input
                type="url"
                name="logo_url"
                className="form-control"
                value={formData.logo_url}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
              />
              <div className="form-text">
                Provide a hosted image link (e.g., from Cloudinary, Imgur, or your website assets).
              </div>
            </div>

            {/* Contact Details */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Official Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                placeholder="info@school.edu"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Official Phone Number</label>
              <input
                type="text"
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+234 800 000 0000"
              />
            </div>

            <div className="col-md-8">
              <label className="form-label fw-semibold">Physical Address</label>
              <textarea
                name="address"
                rows={2}
                className="form-control"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Education Boulevard, City, State"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Office Hours</label>
              <input
                type="text"
                name="office_hours"
                className="form-control"
                value={formData.office_hours}
                onChange={handleChange}
                placeholder="Mon–Fri: 8:00 AM – 4:00 PM"
              />
            </div>

            {/* Currency settings */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Currency Code</label>
              <input
                type="text"
                name="currency_code"
                className="form-control"
                value={formData.currency_code}
                onChange={handleChange}
                placeholder="NGN, USD, GBP, GHS"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Currency Symbol</label>
              <input
                type="text"
                name="currency_symbol"
                className="form-control"
                value={formData.currency_symbol}
                onChange={handleChange}
                placeholder="₦, $, £, ₵"
              />
            </div>
          </div>

          <hr className="my-4" />

          <div className="d-flex justify-content-end gap-2">
            <button type="submit" className="btn btn-primary px-4" disabled={saving}>
              {saving ? "Saving Changes…" : "Save Customization"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

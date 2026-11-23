import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import StudentProfileTab from "./student/StudentProfileTab";
import StudentAttendanceTab from "./student/StudentAttendanceTab";
import StudentGradesTab from "./student/StudentGradesTab";
import StudentFeesTab from "./student/StudentFeesTab";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const displayName = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || user?.username;

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="portal-page-header d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h1 className="h3 fw-bold text-dark mb-0">Student Portal</h1>
            <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
              Student Access
            </span>
          </div>
          <p className="text-muted small mb-0">
            Welcome, <strong>{displayName}</strong>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="d-flex flex-wrap gap-2 py-1">
        <button
          className={`portal-tab-pill ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          🎓 Profile & Subjects
        </button>
        <button
          className={`portal-tab-pill ${activeTab === "attendance" ? "active" : ""}`}
          onClick={() => setActiveTab("attendance")}
        >
          📋 Attendance History
        </button>
        <button
          className={`portal-tab-pill ${activeTab === "grades" ? "active" : ""}`}
          onClick={() => setActiveTab("grades")}
        >
          📝 Grades & Report Card
        </button>
        <button
          className={`portal-tab-pill ${activeTab === "fees" ? "active" : ""}`}
          onClick={() => setActiveTab("fees")}
        >
          💳 School Fees & Payment
        </button>
      </div>

      {activeTab === "profile" && <StudentProfileTab />}
      {activeTab === "attendance" && <StudentAttendanceTab />}
      {activeTab === "grades" && <StudentGradesTab />}
      {activeTab === "fees" && <StudentFeesTab />}
    </div>
  );
}

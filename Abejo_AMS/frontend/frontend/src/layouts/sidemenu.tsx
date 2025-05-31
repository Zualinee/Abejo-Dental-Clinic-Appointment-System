"use client"

import { useState, useEffect } from "react"
import logo from "../assets/logo.png"
import { Link, useLocation } from "react-router-dom"

function Sidemenu() {
  const location = useLocation()

  // State for managing dropdown visibility
  const [dropdowns, setDropdowns] = useState({
    appointments: false,
    patients: false,
    inventory: false,
    reports: false,
  })

  // Toggle dropdown function
  const toggleDropdown = (dropdown: keyof typeof dropdowns) => {
    setDropdowns((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }))
  }

  // Check if current path matches
  const isActive = (path: string) => location.pathname === path

  // Check if any submenu item is active to keep parent dropdown open
  const isParentActive = (parentKey: string) => {
    switch (parentKey) {
      case "appointments":
        return ["/appointments", "/pending_list", "/schedule"].some((path) => isActive(path))
      case "patients":
        return ["/patients", "/patient_history"].some((path) => isActive(path))
      case "inventory":
        return isActive("/Inventory")
      case "reports":
        return ["/Reports/appointmentreport", "/Reports/patientreport", "/Reports/inventoryreport"].some((path) =>
          isActive(path),
        )
      default:
        return false
    }
  }

  // Auto-open dropdown if any child is active
  useEffect(() => {
    setDropdowns({
      appointments: isParentActive("appointments"),
      patients: isParentActive("patients"),
      inventory: isParentActive("inventory"),
      reports: isParentActive("reports"),
    })
  }, [location.pathname])

  return (
    <aside className="app-sidebar fixed left-0 top-0 h-full w-64 shadow-lg z-50" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="h-full overflow-y-auto">
        {/* Logo Section - Moved down a bit */}
        <div className="pt-8 pb-6 px-6 border-b border-amber-300">
          <div className="flex justify-center">
            <img
              src={logo || "/placeholder.svg"}
              alt="Abejo Dental Clinic Logo"
              className="h-35 w-35 object-contain rounded-full shadow-md mt-10"
            />
          </div>
         
        </div>

        <nav className="p-4">
          {/* Main Section */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-3 px-3">Main</h3>

            <Link
              to="/dashboard"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive("/dashboard")
                  ? "bg-amber-300 text-amber-900 shadow-sm font-semibold"
                  : "text-amber-800 hover:bg-amber-200"
              }`}
            >
              <i className="bi bi-house-door text-lg w-5"></i>
              <span className="font-medium">Dashboard</span>
            </Link>
          </div>

          {/* Management Section */}
          <div>
            <h3 className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-3 px-3">Management</h3>

            {/* Manage Appointments */}
            <div className="mb-2">
              <button
                onClick={() => toggleDropdown("appointments")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                  isParentActive("appointments")
                    ? "bg-amber-300 text-amber-900 font-semibold"
                    : "text-amber-800 hover:bg-amber-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <i className="bi bi-calendar-check text-lg w-5"></i>
                  <span className="font-medium">Manage Appointments</span>
                </div>
                <i
                  className={`bi bi-chevron-down text-sm transition-transform duration-200 ${
                    dropdowns.appointments ? "rotate-180" : ""
                  }`}
                ></i>
              </button>

              {dropdowns.appointments && (
                <div className="mt-1 ml-8 space-y-1">
                  {[
                    { path: "/appointments", label: "View Appointments", icon: "bi-list-check" },
                    { path: "/pending_list", label: "Pending Appointments", icon: "bi-clock" },
                    { path: "/schedule", label: "Calendar View", icon: "bi-calendar3" },
                  ].map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-all duration-200 ${
                        isActive(item.path)
                          ? "bg-amber-400 text-amber-900 font-semibold shadow-sm"
                          : "text-amber-700 hover:bg-amber-100 hover:text-amber-800"
                      }`}
                    >
                      <i className={`${item.icon} w-4`}></i>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* View Patients */}
            <div className="mb-2">
              <button
                onClick={() => toggleDropdown("patients")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                  isParentActive("patients")
                    ? "bg-amber-300 text-amber-900 font-semibold"
                    : "text-amber-800 hover:bg-amber-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <i className="bi bi-people text-lg w-5"></i>
                  <span className="font-medium">View Patients</span>
                </div>
                <i
                  className={`bi bi-chevron-down text-sm transition-transform duration-200 ${
                    dropdowns.patients ? "rotate-180" : ""
                  }`}
                ></i>
              </button>

              {dropdowns.patients && (
                <div className="mt-1 ml-8 space-y-1">
                  {[
                    { path: "/patients", label: "Patient Records", icon: "bi-person-lines-fill" },
                    { path: "/patient_history", label: "Patient History", icon: "bi-clock-history" },
                  ].map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-all duration-200 ${
                        isActive(item.path)
                          ? "bg-amber-400 text-amber-900 font-semibold shadow-sm"
                          : "text-amber-700 hover:bg-amber-100 hover:text-amber-800"
                      }`}
                    >
                      <i className={`${item.icon} w-4`}></i>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Manage Inventory */}
            <div className="mb-2">
              <button
                onClick={() => toggleDropdown("inventory")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                  isParentActive("inventory")
                    ? "bg-amber-300 text-amber-900 font-semibold"
                    : "text-amber-800 hover:bg-amber-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <i className="bi bi-box-seam text-lg w-5"></i>
                  <span className="font-medium">Manage Inventory</span>
                </div>
                <i
                  className={`bi bi-chevron-down text-sm transition-transform duration-200 ${
                    dropdowns.inventory ? "rotate-180" : ""
                  }`}
                ></i>
              </button>

              {dropdowns.inventory && (
                <div className="mt-1 ml-8 space-y-1">
                  <Link
                    to="/Inventory"
                    className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-all duration-200 ${
                      isActive("/Inventory")
                        ? "bg-amber-400 text-amber-900 font-semibold shadow-sm"
                        : "text-amber-700 hover:bg-amber-100 hover:text-amber-800"
                    }`}
                  >
                    <i className="bi bi-boxes w-4"></i>
                    <span>Inventory Status</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Reports */}
            <div className="mb-2">
              <button
                onClick={() => toggleDropdown("reports")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                  isParentActive("reports")
                    ? "bg-amber-300 text-amber-900 font-semibold"
                    : "text-amber-800 hover:bg-amber-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <i className="bi bi-bar-chart text-lg w-5"></i>
                  <span className="font-medium">Reports</span>
                </div>
                <i
                  className={`bi bi-chevron-down text-sm transition-transform duration-200 ${
                    dropdowns.reports ? "rotate-180" : ""
                  }`}
                ></i>
              </button>

              {dropdowns.reports && (
                <div className="mt-1 ml-8 space-y-1">
                  {[
                    { path: "/Reports/appointmentreport", label: "Appointment Report", icon: "bi-calendar-check" },
                    { path: "/Reports/patientreport", label: "Patient Report", icon: "bi-person-check" },
                    { path: "/Reports/inventoryreport", label: "Inventory Report", icon: "bi-box" },
                  ].map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-all duration-200 ${
                        isActive(item.path)
                          ? "bg-amber-400 text-amber-900 font-semibold shadow-sm"
                          : "text-amber-700 hover:bg-amber-100 hover:text-amber-800"
                      }`}
                    >
                      <i className={`${item.icon} w-4`}></i>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-amber-300 bg-amber-100">
          <div className="text-center text-xs text-amber-700">
            <p>© 2025 Abejo Dental Clinic</p>
            <p>Appointment System</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidemenu

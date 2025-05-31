import React, { useState, useRef, useEffect } from "react";

function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const notifications = ["New Appointment", "Reminder: Tooth Cleaning"];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="app-header sticky" id="header">
        <div className="main-header-container container-fluid">
          <div className="header-content-left">
            <div className="header-element">
              <div className="horizontal-logo">
                <a href="index.html" className="header-logo">
                  <img
                    src="/assets/images/brand-logos/desktop-logo.png"
                    alt="logo"
                    className="desktop-logo"
                  />
                </a>
              </div>
            </div>
          </div>

          <div className="header-content-right flex items-center gap-6">
            {/* Notification Bell */}
           

            {/* Admin Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <i className="bi bi-person-circle text-xl"></i>
                <span className=" md:inline">Admin</span>
                <i className="bi bi-caret-down-fill text-sm"></i>
              </button>

              {showProfileDropdown && (
  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
  
    <a
      href="/logout"
      className="block px-4 py-2 text-sm text-red-600 hover:bg-red-100"
    >
      <i className="bi bi-box-arrow-right mr-2"></i> Logout
    </a>
  </div>
)}

            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;

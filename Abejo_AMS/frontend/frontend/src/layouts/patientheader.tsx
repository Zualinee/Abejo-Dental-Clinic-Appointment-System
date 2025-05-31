import React, { useState, useRef, useEffect } from "react";

function PatientHeader() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const notifications = ["New Appointment", "Reminder: Tooth Cleaning"];

  const notificationRef = useRef(null);
  const accountDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target)
      ) {
        setShowAccountDropdown(false);
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
                <a href="/patient-dashboard" className="header-logo">
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
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative focus:outline-none"
              >
                <i className="bi bi-bell-fill text-xl"></i>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-white"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-[200px] bg-white rounded-md shadow-lg z-40">
                  <div className="p-3 border-b font-semibold text-gray-700">
                    Notifications
                  </div>
                  <ul className="max-h-60 overflow-auto">
                    {notifications.map((note, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                      >
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Account Dropdown */}
            <div className="relative header-element" ref={accountDropdownRef}>
              <button
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                className="flex items-center gap-2 text-black-600 hover:text-blue-600 focus:outline-none"
              >
                <i className="bi bi-person-circle text-xl"></i>
                <span>Account</span>
                <i className="bi bi-caret-down-fill text-sm"></i>
              </button>

              {showAccountDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <a
                    href="/patient-profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    My Profile
                  </a>
                  <a
                    href="/logout"
                    className="block px-4 py-2 text-red-600 hover:bg-red-100"
                  >
                    Logout
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

export default PatientHeader;

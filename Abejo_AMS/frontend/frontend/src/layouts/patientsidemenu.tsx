import logo from '../assets/secondlogo.png';
import { Link } from 'react-router-dom';

function PatientSidemenu() {
  return (
    <aside className="app-sidebar" id="sidebar" style={{ backgroundColor: '#f1ebcd' }}>
      {/* Sidebar Header */}
      <div className="main-sidebar-header" style={{ backgroundColor: '#f1ebcd' }}>
        <a href="/" className="header-logo"></a>
      </div>

      {/* Sidebar Body */}
      <div className="main-sidebar" id="sidebar-scroll" style={{ backgroundColor: '#f1ebcd' }}>
        <nav className="main-menu-container nav nav-pills flex-col sub-open">
          <div className="slide-left" id="slide-left"></div>
          <ul className="main-menu">

            {/* Logo */}
            <li className="pt-4 px-2">
              <div className="flex justify-center">
                <img
                  src={logo}
                  alt="Abejo Dental Clinic Logo"
                  className="rounded-md"
                  style={{ maxHeight: '400px', objectFit: 'contain' }}
                />
              </div>
            </li>

            <br />
          <li className="slide__category">
                <span className="category-name" style={{ color: 'black' }}>Main</span>
              </li>
            {/* Dashboard */}
            <li className="slide">
              <Link to="/patientdashboard" className="side-menu__item flex items-center gap-2">
                <i className=" bi bi-house-door text-black text-lg ml-auto transition-transform duration-300 group-hover:rotate-180"></i>
                <span className="category-name" style={{ color: 'black' }}><h6 className="text-black">Dashboard</h6></span>
              </Link>
            </li>
        
            <br />
           <li className="slide__category">
                <span className="category-name" style={{ color: 'black' }}>Management</span>
              </li>

            {/* My Profile (Hoverable) */}
            <li className="slide group relative">
              <div className="side-menu__item flex items-center justify-between text-black p-2 rounded-lg transition duration-200 cursor-pointer">
                <div className="flex items-center gap-3">
                  <i className="bi bi-person text-black text-lg ml-auto transition-transform duration-300 group-hover:rotate-180"></i>
                  <span className="category-name" style={{ color: 'black' }}><h6 className="text-black">My Profile</h6></span>
                </div>
                <i className="bi bi-chevron-down text-black text-lg ml-auto transition-transform duration-300 group-hover:rotate-180"></i>
              </div>

              <div className="submenu-container bg-white shadow-lg rounded-lg p-3 mt-2 hidden group-hover:block">
                <ul className="submenu pl-2">
                  {[
                    { path: "/patient_information", label: "Input Information", icon: "bi-person" },
                    { path: "/patient_profile", label: "View Profile", icon: "bi-person" },
                    { path: "/medical_history", label: "Medical History", icon: "bi-clock-history" },
                  ].map((item, index) => (
                    <li key={index} className="slide">
                      <Link
                        to={item.path}
                        className="side-menu__item flex items-center gap-3 text-black font-semibold p-2 rounded-lg transition duration-200 hover:bg-yellow-200"
                      >
                        <i className={`bi ${item.icon} text-lg`}></i>
                        <span className="side-menu__label">{item.label}</span>
                      </Link>
                      <hr className="mt-3" />
                    </li>
                  ))}
                </ul>
              </div>
            </li>

           

            <br />

            {/* My Appointments (Hoverable) */}
            <li className="slide group relative">
              <div className="side-menu__item flex items-center justify-between text-black p-2 rounded-lg transition duration-200 cursor-pointer">
              <div className="flex items-center gap-3">
                <i className="bi bi-calendar-check text-black text-lg ml-auto transition-transform duration-300 group-hover:rotate-180"></i>
                <span className="category-name" style={{ color: 'black' }}><h6 className="text-black">My Appointment</h6></span>
              </div>
              <i className="bi bi-chevron-down  text-black"></i>
            </div>


              <div className="submenu-container bg-white shadow-lg rounded-lg p-3 mt-2 hidden group-hover:block">
                <ul className="submenu pl-2">
                  {[
                    { path: "/patient_appointment", label: "Book Appointment", icon: "bi-calendar-check" },
                    { path: "/patient_schedule", label: "Upcoming Schedule", icon: "bi-calendar" },
                    { path: "/view_appointment", label: "View Appointment", icon: "bi-eye" },
                  ].map((item, index) => (
                    <li key={index} className="slide">
                      <Link
                        to={item.path}
                        className="side-menu__item flex items-center gap-3 text-black font-semibold p-2 rounded-lg transition duration-200 hover:bg-yellow-200"
                      >
                        <i className={`bi ${item.icon} text-lg`}></i>
                        <span className="side-menu__label">{item.label}</span>
                      </Link>
                      <hr className="mt-3" />
                    </li>
                  ))}
                </ul>
              </div>
            </li>

          </ul>
        </nav>
      </div>
    </aside>
  );
}

export default PatientSidemenu;

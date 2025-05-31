import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import './assets/css/style.css'
import Login from './pages/Login.tsx';
import Signup from "./pages/Signup";
import Logout from './pages/logout.tsx';
import Dashboard from './pages/dashboard.tsx';

import PatientDashboard from './pages/PatientDashboard.tsx';
import PatientSidemenu from './layouts/patientsidemenu.tsx';
import PatientHeader from './layouts/patientheader.tsx';
import PatientAppointments from './pages/patient_appointment/patient_appointment.tsx';
import ViewAppointment from './pages/patient_appointment/view_appointment.tsx';

import PatientSchedule from './pages/patient_appointment/patient_schedule.tsx';
import PatientProfile from './pages/patient_profile/patient_profile.tsx';
import Patient_Information from './pages/patient_profile/patient_information.tsx';
import MedicalHistory from './pages/patient_profile/medical_history.tsx';


import Customer_Registration from './pages/customer/register.tsx';
import Customer_List from './pages/customer/list.tsx';

import Patient_Registration from './pages/patient/patient_register.tsx';
import Patient_List from './pages/patient/patient_list.tsx';
import Patient_History from './pages/patient/patient_history.tsx';

import Appointment_Registration from './pages/Appointment/register.tsx';
import Appointment_List from './pages/Appointment/list.tsx';
import Pending_List from './pages/pending_appointment/pending_list.tsx'

import Schedule from './pages/schedule/view_schedule.tsx';

import Inventory from './pages/Inventory/add_inventory.tsx';

import AppointmentReport from './pages/Reports/appointmentreport.tsx';
import PatientReport from './pages/Reports/patientreport.tsx';
import InventoryReport from './pages/Reports/inventoryreport.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/PatientDashboard" element={<PatientDashboard />} />
        <Route path="/PatientSidemenu" element={<PatientSidemenu />} />
        <Route path="/PatientHeader" element={<PatientHeader />} />
        <Route path="/patient_appointment" element={<PatientAppointments />} />
        <Route path="/view_appointment" element={<ViewAppointment />} />

        <Route path="/patient_schedule" element={<PatientSchedule />} />
        <Route path="/patient_profile" element={<PatientProfile />} />
        <Route path="/patient_information" element={<Patient_Information />} />
        <Route path="/medical_history" element={<MedicalHistory />} />

        <Route path="/customers" element={<Customer_List />} />
        <Route path="/customer/create" element={<Customer_Registration />} />

        <Route path="/patients" element={<Patient_List />} />
        <Route path="/patient/create" element={<Patient_Registration />} />
        <Route path="/patient_history" element={<Patient_History />} />

        <Route path="/appointments" element={<Appointment_List />} />
        <Route path="/appointment/create" element={<Appointment_Registration />} />
        <Route path="/pending_list" element={<Pending_List />} />

        <Route path="/schedule" element={<Schedule />} />

        <Route path="/inventory" element={<Inventory />} />

        <Route path="/reports/appointmentreport" element={<AppointmentReport />} />
        <Route path="/reports/patientreport" element={<PatientReport />} />
        <Route path="/reports/inventoryreport" element={<InventoryReport />} />

      </Routes>
    </BrowserRouter>
  </StrictMode>,
)








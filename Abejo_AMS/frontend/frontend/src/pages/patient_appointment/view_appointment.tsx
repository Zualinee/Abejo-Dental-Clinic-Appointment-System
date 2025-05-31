
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/patientbreadcrums";
import PatientHeader from "../../layouts/patientheader";
import PatientSidemenu from "../../layouts/patientsidemenu";

interface Appointment {
    id: number;
    date: string;
    time: string;
    doctor: string;
    status: string;
}

function ViewAppointment() {
    const navigate = useNavigate();
    
    
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    
    useEffect(() => {
        const isAuthenticated = localStorage.getItem("isAuthenticated");
        if (!isAuthenticated) {
            navigate("/");
        } else {
           
            setAppointments([
                { id: 1, date: "15-Mar-2025", time: "10:00 AM", doctor: "Dr. Smith", status: "Confirmed" },
                { id: 2, date: "22-Mar-2025", time: "02:30 PM", doctor: "Dr. Jane", status: "Pending" },
                { id: 3, date: "01-Apr-2025", time: "09:00 AM", doctor: "Dr. Robert", status: "Completed" },
            ]);
        }
    }, [navigate]);

    return (
        <>
            <PatientHeader />
            <PatientSidemenu />
            <div className="main-content app-content">
                <div className="container-fluid">
                    <Breadcrumb  
                                title="My Appointments"
                                links={[{ text: "My Appointments", link: "/patient_appointment" }]}
                                active="View Appointment"
                              />

                    
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">My Appointments</h2>
                       
                    </div>

                  
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="w-full table-auto">
                            <thead className="bg-gray-100 text-gray-600">
                                <tr>
                                    <th className="py-3 px-6 text-left">Date</th>
                                    <th className="py-3 px-6 text-left">Time</th>
                                    <th className="py-3 px-6 text-left">Doctor</th>
                                    <th className="py-3 px-6 text-left">Status</th>
                                    <th className="py-3 px-6 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((appointment) => (
                                    <tr key={appointment.id} className="border-b">
                                        <td className="py-3 px-6">{appointment.date}</td>
                                        <td className="py-3 px-6">{appointment.time}</td>
                                        <td className="py-3 px-6">{appointment.doctor}</td>
                                        <td className="py-3 px-6">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm ${
                                                    appointment.status === "Confirmed"
                                                        ? "bg-green-200 text-green-700"
                                                        : appointment.status === "Pending"
                                                        ? "bg-yellow-200 text-yellow-700"
                                                        : "bg-gray-200 text-gray-700"
                                                }`}
                                            >
                                                {appointment.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            <button className="text-blue-500 hover:underline">
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </>
    );
}

export default ViewAppointment;
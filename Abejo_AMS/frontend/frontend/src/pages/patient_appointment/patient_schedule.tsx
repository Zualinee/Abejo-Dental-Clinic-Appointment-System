import { useState } from "react";
import PatientHeader from "../../layouts/patientheader";
import PatientSidemenu from "../../layouts/patientsidemenu";
import { FaCheckCircle } from "react-icons/fa";
import Breadcrumb from "../../components/breadcrums";
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Sample Appointments Data
const appointments = [
    { date: "2025-03-12", type: "Checkup", color: "bg-pink-300" },
    { date: "2025-03-19", type: "Dental Cleaning", color: "bg-blue-300" },
    { date: "2025-03-11", type: "Follow-up", color: "bg-green-300" },
    { date: "2025-03-04", type: "Consultation", color: "bg-yellow-300" },
    { date: "2025-04-16", type: "Checkup", color: "bg-pink-300" },
    { date: "2025-04-18", type: "Dental Cleaning", color: "bg-blue-300" },
    { date: "2025-04-10", type: "Follow-up", color: "bg-green-300" },
    { date: "2025-04-03", type: "Consultation", color: "bg-yellow-300" },
];

const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
];

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const PatientSchedule = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const navigate = useNavigate(); // Initialize navigation

    // Function to navigate months
    const handleMonthChange = (direction: "prev" | "next") => {
        setCurrentMonth(prev => {
            let newMonth = direction === "prev" ? prev - 1 : prev + 1;
            if (newMonth < 0) {
                setCurrentYear(year => year - 1);
                return 11;
            }
            if (newMonth > 11) {
                setCurrentYear(year => year + 1);
                return 0;
            }
            return newMonth;
        });
    };

    return (
        <>
            <PatientHeader  />
            <PatientSidemenu />
            <div className="main-content app-content bg-blue-50 min-h-screen p-20"> {/* Light Blue Background */}
                <div className="container mx-auto bg-white shadow-lg rounded-lg p-6">
                    <Breadcrumb title="Upcoming Appointments"
                        links={[{ text: "My appointments", link: "/patient_schedule" }]}
                        active="Monthly View"/>

                    <div className="flex justify-between items-center">
                        <button 
                            onClick={() => handleMonthChange("prev")} 
                            className="px-4 py-2 bg-blue-300 rounded-md hover:bg-gray-400"
                        >← Prev</button>
                        <h2 className="text-3xl font-bold text-black-600">
                            {monthNames[currentMonth]} {currentYear}
                        </h2>
                        <button 
                            onClick={() => handleMonthChange("next")} 
                            className="px-4 py-2 bg-blue-300 rounded-md hover:bg-gray-400"
                        >Next →</button>
                    </div>

                    {/* Weekday Headers */}
                    <div className="mt-6 grid grid-cols-7 gap-1 bg-blue-200 p-2 rounded-lg">
                        {weekDays.map((day, index) => (
                            <div key={index} className="text-center font-bold text-gray-700 p-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1 bg-white shadow-lg p-4 rounded-lg">
                        {Array.from({ length: 31 }).map((_, index) => {
                            const dayNumber = index + 1;
                            const appointment = appointments.find(a =>
                                new Date(a.date).getDate() === dayNumber &&
                                new Date(a.date).getMonth() === currentMonth &&
                                new Date(a.date).getFullYear() === currentYear
                            );
                                    {/* Back Button Moved to the Left Side Below the Calendar */}
                                    <div className="flex justify-start mt-4">
                                    <button 
                                        onClick={() => navigate("/dashboard")} 
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600"
                                    >
                                        <i className="ri-arrow-left-line"></i> Back to Dashboard
                                    </button>
                                    </div>
                            return (
                                <div key={index} className="border p-4 text-center bg-black-50 rounded-md shadow-sm relative">
                                    <span className="font-bold">{dayNumber}</span>
                                    {appointment && (
                                        <div className={`mt-2 p-1 text-xs font-semibold rounded ${appointment.color}`}>
                                            {appointment.type}
                                            <FaCheckCircle className="text-green-600 absolute -top-2 -right-2 text-lg" />
                                        </div>
                                    )}
                                </div>
                            );
                            
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PatientSchedule;


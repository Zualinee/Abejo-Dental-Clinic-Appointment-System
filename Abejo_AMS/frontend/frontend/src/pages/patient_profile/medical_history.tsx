import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/patientbreadcrums";
import PatientHeader from "../../layouts/patientheader";
import PatientSidemenu from "../../layouts/patientsidemenu";

interface MedicalRecord {
    id: number;
    date: string;
    service: string;
    dentist: string;
    remarks: string;
}

function MedicalHistory() {
    const navigate = useNavigate();
    const [records, setRecords] = useState<MedicalRecord[]>([]);

    useEffect(() => {
        const isAuthenticated = localStorage.getItem("isAuthenticated");
        if (!isAuthenticated) {
            navigate("/");
        } else {
            setRecords([
                { id: 1, date: "10-Mar-2025", service: "Tooth Extraction", dentist: "Dr. Abejo", remarks: "Healing well" },
                { id: 2, date: "12-Mar-2025", service: "Dental Cleaning", dentist: "Dr. Cruz", remarks: "Next cleaning in 6 months" },
                { id: 3, date: "15-Mar-2025", service: "Tooth Filling", dentist: "Dr. Abejo", remarks: "Check-up needed after 3 months" },
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
                        title="Medical History"
                        links={[{ text: "Medical History", link: "/medical_history" }]}
                        active="View History"
                    />

                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Medical History</h2>
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
                            onClick={() => window.print()}
                        >
                            Print
                        </button>
                    </div>

                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="w-full table-auto">
                            <thead className="bg-blue-200 text-blue-300">
                                <tr>
                                    <th className="py-3 px-6 text-left">Date</th>
                                    <th className="py-3 px-6 text-left">Service</th>
                                    <th className="py-3 px-6 text-left">Dentist</th>
                                    <th className="py-3 px-6 text-left">Remarks</th>
                                    <th className="py-3 px-6 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((record) => (
                                    <tr key={record.id} className="border-b">
                                        <td className="py-3 px-6">{record.date}</td>
                                        <td className="py-3 px-6">{record.service}</td>
                                        <td className="py-3 px-6">{record.dentist}</td>
                                        <td className="py-3 px-6">{record.remarks}</td>
                                        <td className="py-3 px-6 text-center">
                                            <button className="text-blue-500 hover:underline">
                                                Request Follow-up
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

export default MedicalHistory;
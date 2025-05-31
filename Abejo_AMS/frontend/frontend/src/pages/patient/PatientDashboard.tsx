import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../components/breadcrums";
import PatientHeader from "../layouts/patientheader";
import PatientSidemenu from "../layouts/patientsidemenu";

function PatientDashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = localStorage.getItem("isAuthenticated");
        if (!isAuthenticated) {
            navigate("/");
        }
    }, [navigate]);

    return (
        <>
            <PatientHeader />
            <PatientSidemenu />
            <div className="main-content app-content">
                <div className="container-fluid">
                    <Breadcrumb />
                    <div className="grid grid-cols-12 gap-4">

                  
                        <div className="xxl:col-span-4 col-span-12">
                            <div className="box overflow-hidden main-content-card bg-blue-500 text-white shadow-md rounded-lg">
                                <div className="box-body text-center p-5">
                                    <i className="bi bi-calendar2-check text-5xl"></i>
                                    <p className="mt-4 text-lg font-semibold">Upcoming Appointments</p>
                                    <p className="text-sm">2 Appointments Scheduled</p>
                                </div>
                            </div>
                        </div>

                   
                        <div className="xxl:col-span-4 col-span-12">
                            <div className="box overflow-hidden main-content-card bg-green-500 text-white shadow-md rounded-lg">
                                <div className="box-body text-center p-5">
                                    <i className="bi bi-file-medical text-5xl"></i>
                                    <p className="mt-4 text-lg font-semibold">Medical Records</p>
                                    <p className="text-sm">5 Records Available</p>
                                </div>
                            </div>
                        </div>

                      
                        <div className="xxl:col-span-4 col-span-12">
                            <div className="box overflow-hidden main-content-card bg-purple-500 text-white shadow-md rounded-lg">
                                <div className="box-body text-center p-5">
                                    <i className="bi bi-credit-card text-5xl"></i>
                                    <p className="mt-4 text-lg font-semibold">Billing</p>
                                    <p className="text-sm">1 Pending Payment</p>
                                </div>
                            </div>
                        </div>

                    </div>

                
                    <div className="grid grid-cols-12 gap-4 mt-5">
                        <div className="col-span-6">
                            <button className="w-full bg-blue-500 text-white py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-200">
                                View Appointments
                            </button>
                        </div>
                        <div className="col-span-6">
                            <button className="w-full bg-green-500 text-white py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-200">
                                View Medical History
                            </button>
                        </div>
                    </div>

       
                   
                </div>
            </div>
        </>
    );
}

export default PatientDashboard;

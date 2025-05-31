import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../components/patientbreadcrums";
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
                            <div className="box overflow-hidden main-content-card">
                                <div className="box-body text-center p-5" style={{ backgroundColor: '#f1ebcd'  }}>
                                    <i className="bi bi-calendar2-check text-5xl"></i>
                                    <p className="mt-4 text-lg font-semibold">Upcoming Appointments</p>
                                    <p className="text-sm">2 Appointments Scheduled</p>
                                </div>
                            </div>
                        </div>

                   
                        <div className="xxl:col-span-4 col-span-12">
                            <div className="box overflow-hidden main-content-card bg-green-500 text-white shadow-md rounded-lg">
                                <div className="box-body text-center p-5"style={{ backgroundColor: '#f1ebcd'  }}>
                                    <i className="bi bi-file-medical text-5xl"></i>
                                    <p className="mt-4 text-lg font-semibold">Medical Records</p>
                                    <p className="text-sm">5 Records Available</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default PatientDashboard;




import { useState, useEffect } from "react";
import PatientSidemenu from "../../layouts/patientsidemenu";
import PatientHeader from "../../layouts/patientheader";

const PatientProfile = () => {
    // Static patient info (Replace with dynamic values later)
    const staticPatientData = {
        fullName: "Juan Dela Cruz",
        dob: "2000-05-15",
        gender: "Male",
        contact: "09123456789",
        email: "juan.delacruz@example.com",
        address: "123 Main St, Tagoloan, Misamis Oriental",
        medicalHistory: "No known allergies or conditions",
        emergencyContactName: "Maria Dela Cruz",
        emergencyContactNumber: "09987654321",
        emergencyContactRelation: "Mother",
    };

    const [fullName, setFullName] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [contact, setContact] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [medicalHistory, setMedicalHistory] = useState("");
    const [emergencyContactName, setEmergencyContactName] = useState("");
    const [emergencyContactNumber, setEmergencyContactNumber] = useState("");
    const [emergencyContactRelation, setEmergencyContactRelation] = useState("");

    // Load static patient data when the component mounts
    useEffect(() => {

        setFullName(staticPatientData.fullName);
        setDob(staticPatientData.dob);
        setGender(staticPatientData.gender);
        setContact(staticPatientData.contact);
        setEmail(staticPatientData.email);
        setAddress(staticPatientData.address);
        setMedicalHistory(staticPatientData.medicalHistory);
        setEmergencyContactName(staticPatientData.emergencyContactName);
        setEmergencyContactNumber(staticPatientData.emergencyContactNumber);
        setEmergencyContactRelation(staticPatientData.emergencyContactRelation);
    }, []);

    return (
        <>
            <PatientHeader />
            <PatientSidemenu />
            <div className="main-content app-content bg-blue-100 min-h-screen p-10">
                <div className="p-6 max-w-4xl mx-auto border border-blue-300 rounded-full shadow-md">
                    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-center text-black mb-4">My Profile</h2>
                        <form className="space-y-4">
                            
                            {/* Full Name */}
                            <div>
                                <label className="block font-semibold">Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    className="w-full p-2 border rounded-md bg-gray-200"
                                
                                />
                            </div>

                            {/* Date of Birth */}
                            <div>
                                <label className="block font-semibold">Date of Birth</label>
                                <input
                                    type="date"
                                    value={dob}
                                    className="w-full p-2 border rounded-md bg-gray-200"
                                    readOnly
                                />
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block font-semibold">Gender</label>
                                <input
                                    type="text"
                                    value={gender}
                                    className="w-full p-2 border rounded-md bg-gray-200"
                                    
                                />
                            </div>

                            {/* Contact Number */}
                            <div>
                                <label className="block font-semibold">Contact Number</label>
                                <input
                                    type="text"
                                    value={contact}
                                    className="w-full p-2 border rounded-md bg-gray-200"
                                    readOnly
                                />
                            </div>

                            {/* Email Address */}
                            <div>
                                <label className="block font-semibold">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    className="w-full p-2 border rounded-md bg-gray-200"
                                    
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block font-semibold">Address</label>
                                <textarea
                                    value={address}
                                    className="w-full p-2 border rounded-md bg-gray-200"
                       
                                ></textarea>
                            </div>

                            

                            {/* Medical History */}
                            <div>
                                <label className="block font-semibold">Medical History</label>
                                <textarea
                                    value={medicalHistory}
                                    className="w-full p-2 border rounded-md bg-gray-200"
                               
                                ></textarea>
                            </div>

                             {/* Emergency Contact Name */}
                             <div>
                                <label className="block font-semibold">Emergency Contact Name</label>
                                <input type="text" value={emergencyContactName} className="w-full p-2 border rounded-md bg-gray-200" />
                            </div>

                            {/* Emergency Contact Number */}
                            <div>
                                <label className="block font-semibold">Emergency Contact Number</label>
                                <input type="text" value={emergencyContactNumber} className="w-full p-2 border rounded-md bg-gray-200" />
                            </div>

                            {/* Relationship to Patient */}
                            <div>
                                <label className="block font-semibold">Relationship to Patient</label>
                                <input type="text" value={emergencyContactRelation} className="w-full p-2 border rounded-md bg-gray-200" />
                            </div>
                            
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PatientProfile;
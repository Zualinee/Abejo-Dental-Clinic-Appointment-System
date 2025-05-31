import PatientBreadcrumb from "../../components/patientbreadcrums";
import PatientHeader from "../../layouts/patientheader";
import PatientSidemenu from "../../layouts/patientsidemenu";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface FormData {
  first_name: string;
  middle_name?: string;
  last_name: string;
  suffix?: string;
  gender: string;
  date_of_birth: string;
  email?: string;
  contact_no: string;

  region: string;
  province: string;
  city: string;
  barangay: string;
  postalCode: string;
}

const initialFormData: FormData = {

  first_name: "",
  middle_name: "",
  last_name: "",
  suffix: "",
  gender: "",
  date_of_birth: "",
  email: "",
  contact_no: "",
  region: "",
  province: "",
  city: "",
  barangay: "",
  postalCode: "",
};

function Patient_Information() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [address, setAddress] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fullAddress = `${formData.region}, ${formData.province}, ${formData.city}, ${formData.barangay}, ${formData.postalCode}`;
    setAddress(fullAddress);
  }, [formData.region, formData.province, formData.city, formData.barangay, formData.postalCode]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Validation check 
      if (
        !formData.first_name.trim() ||
        !formData.last_name.trim() ||
        !formData.gender ||
        !formData.date_of_birth ||
        !formData.contact_no.trim() ||
        !formData.region.trim() ||
        !formData.province.trim() ||
        !formData.city.trim() ||
        !formData.barangay.trim() ||
        !formData.postalCode.trim()
      ) {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: "Please fill in all required fields.",
        });
        return; 
      }
  
      const response = await axios.post(
        "http://localhost/Abejo_AMS/backend/index.php/patient/save",
        { ...formData, address },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      // Check if the response is successful
      if (response.data.status) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data.message || "Patient information saved successfully!",
        });
        setFormData(initialFormData);
        setAddress("");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message || "Failed to save patient information.",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Error connecting to server. Please check your internet or try again later.",
      });
    }
  };

  return (
    <>
      <PatientHeader />
      <PatientSidemenu />
      <div className="main-content app-content">
        <div className="container-fluid">
          <PatientBreadcrumb
            title="Patient Information"
            links={[{ text: "Dashboard", link: "/patient_information" }]}
            active="Input Your Information"
          />
          <div className="grid grid-cols-6 gap-x-6">
            <div className="sm:col-span-6 col-span-6">
              <div className="flex justify-center">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <div className="box relative overflow-hidden main-content-card" style={{ width: "800px" }}>
                  <div className="box-body p-5">
                    <form onSubmit={handleSubmit} noValidate>
                      <h2 className="font-bold text-lg mb-4">Patient's Information</h2>
                      <hr className="mt-3 mb-4" />

                      {/* First Name */}
                      <div className="relative mb-4">
                        <label className="block font-medium mb-1" htmlFor="first_name">First Name</label>
                        <div className="relative">
                          <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className="ti-form-input rounded-sm ps-11 focus:z-10"
                            placeholder="Enter First Name"
                            autoComplete="given-name"
                            required
                            aria-required="true"
                          />
                          <i className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4 bi bi-person" aria-hidden="true"></i>
                        </div>
                      </div>

                      {/* Middle Name */}
                      <div className="relative mb-4">
                        <label className="block font-medium mb-1" htmlFor="middle_name">Middle Name (Optional)</label>
                        <div className="relative">
                          <input
                            type="text"
                            id="middle_name"
                            name="middle_name"
                            value={formData.middle_name || ""}
                            onChange={handleChange}
                            className="ti-form-input rounded-sm ps-11 focus:z-10"
                            placeholder="Enter Middle Name"
                            autoComplete="additional-name"
                            aria-required="false"
                          />
                          <i className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4 bi bi-person" aria-hidden="true"></i>
                        </div>
                      </div>

                      {/* Last Name */}
                      <div className="relative mb-4">
                        <label className="block font-medium mb-1" htmlFor="last_name">Last Name</label>
                        <div className="relative">
                          <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            className="ti-form-input rounded-sm ps-11 focus:z-10"
                            placeholder="Enter Last Name"
                            autoComplete="family-name"
                            required
                            aria-required="true"
                          />
                          <i className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4 bi bi-person" aria-hidden="true"></i>
                        </div>
                      </div>

                      {/* Suffix */}
                      <div className="relative mb-4">
                        <label className="block font-medium mb-1" htmlFor="suffix">Suffix (Optional)</label>
                        <div className="relative">
                          <input
                            type="text"
                            id="suffix"
                            name="suffix"
                            value={formData.suffix || ""}
                            onChange={handleChange}
                            className="ti-form-input rounded-sm ps-11 focus:z-10"
                            placeholder="Enter Suffix"
                            autoComplete="suffix"
                            aria-required="false"
                          />
                          <i className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4 bi bi-person-badge" aria-hidden="true"></i>
                        </div>
                      </div>

                      {/* Contact Number */}
                      <div className="relative mb-4">
                        <label className="block font-medium mb-1" htmlFor="contact_no">Contact Number</label>
                        <div className="relative">
                          <input
                            type="tel"
                            id="contact_no"
                            name="contact_no"
                            value={formData.contact_no}
                            onChange={handleChange}
                            className="ti-form-input rounded-sm ps-11 focus:z-10"
                            placeholder="Enter Contact Number"
                            autoComplete="tel"
                            required
                            aria-required="true"
                          />
                          <i className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4 bi bi-telephone" aria-hidden="true"></i>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="relative mb-4">
                        <label className="block font-medium mb-1" htmlFor="email">Email (Optional)</label>
                        <div className="relative">
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email || ""}
                            onChange={handleChange}
                            className="ti-form-input rounded-sm ps-11 focus:z-10"
                            placeholder="Enter Email"
                            autoComplete="email"
                            aria-required="false"
                          />
                          <i className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4 bi bi-envelope" aria-hidden="true"></i>
                        </div>
                      </div>

                      {/* Gender */}
                      <div className="relative mb-4">
                        <label className="block font-medium mb-1" htmlFor="gender">Gender</label>
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="ti-form-input rounded-sm focus:z-10"
                          autoComplete="sex"
                          required
                          aria-required="true"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* Date of Birth */}
                      <div className="relative mb-4">
                        <label className="block font-medium mb-1" htmlFor="date_of_birth">Date of Birth</label>
                        <input
                          type="date"
                          id="date_of_birth"
                          name="date_of_birth"
                          value={formData.date_of_birth}
                          onChange={handleChange}
                          className="ti-form-input rounded-sm focus:z-10"
                          autoComplete="bday"
                          required
                          aria-required="true"
                        />
                      </div>

                      {/* Region */}
                      {/* Region Input */}
                      <div className="relative mb-4">
                        <label htmlFor="region" className="block font-medium mb-1">Region</label>
                        <div className="relative">
                          <input
                            type="text"
                            id="region"
                            name="region"
                            value={formData.region}
                            onChange={handleChange}
                            className="ti-form-input rounded-sm pl-10 focus:z-10"
                            placeholder="Enter Region"
                            autoComplete="region"
                            required
                            aria-required="true"
                          />
                          <i className="bi bi-geo-alt absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Province Input */}
                      <div className="relative mb-4">
                        <label htmlFor="province" className="block font-medium mb-1">Province</label>
                        <div className="relative">
                          <input
                            type="text"
                            id="province"
                            name="province"
                            value={formData.province}
                            onChange={handleChange}
                            className="ti-form-input rounded-sm pl-10 focus:z-10"
                            placeholder="Enter Province"
                            autoComplete="address-level1"
                            required
                            aria-required="true"
                          />
                          <i className="bi bi-geo-alt absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* City/Municipality Input */}
                      <div className="relative mb-4">
                        <label htmlFor="city" className="block font-medium mb-1">City / Municipality</label>
                        <div className="relative">
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="ti-form-input rounded-sm pl-10 focus:z-10"
                            placeholder="Enter City / Municipality"
                            autoComplete="address-level2"
                            required
                            aria-required="true"
                          />
                          <i className="bi bi-geo-alt absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Barangay Input */}
                      <div className="relative mb-4">
                        <label htmlFor="barangay" className="block font-medium mb-1">Barangay</label>
                        <div className="relative">
                          <input
                            type="text"
                            id="barangay"
                            name="barangay"
                            value={formData.barangay}
                            onChange={handleChange}
                            className="ti-form-input rounded-sm pl-10 focus:z-10"
                            placeholder="Enter Barangay"
                            autoComplete="address-line1"
                            required
                            aria-required="true"
                          />
                          <i className="bi bi-geo-alt absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Postal Code Input */}
                      <div className="relative mb-4">
                        <label htmlFor="postalCode" className="block font-medium mb-1">Postal Code</label>
                        <div className="relative">
                          <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            className="ti-form-input rounded-sm pl-10 focus:z-10"
                            placeholder="Enter Postal Code"
                            autoComplete="postal-code"
                            required
                            aria-required="true"
                          />
                          <i className="bi bi-geo-alt absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end gap-4">
                        <button
                          type="reset"
                          className="bg-blue-400 text-white px-4 py-2 rounded-full"
                          onClick={() => {
                            setFormData(initialFormData);
                            setAddress("");
                          }}
                        >
                          Reset
                        </button>
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-full">
                          <i className="bi bi-save"></i>
                          <span className="px-3">Submit Information</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
// Export the component

export default Patient_Information;

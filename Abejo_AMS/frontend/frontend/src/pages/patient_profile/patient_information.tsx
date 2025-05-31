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
  postal_code: string;
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
  postal_code: "",
};

function Patient_Information() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [address, setAddress] = useState("");
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch patient profile from backend session-auth
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost/Abejo_AMS/backend/index.php/patient/get_by_user"
        );
        if (response.data.status && response.data.patient) {
          setFormData(response.data.patient);
          setHasProfile(true);  // means profile exists - disable form submission
        }
      } catch (error) {
        console.error("Error fetching patient profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    setAddress(
      `${formData.region}, ${formData.province}, ${formData.city}, ${formData.barangay}, ${formData.postal_code}`
    );
  }, [formData]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (hasProfile) return; // disable changes if profile exists (optional)
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value } as FormData));
  };

  const handleReset = () => {
    if (hasProfile) return; // disable reset if profile exists
    setFormData(initialFormData);
    setAddress("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (hasProfile) {
      Swal.fire("Info", "You have already submitted your information.", "info");
      return;
    }

    const required = [
      "first_name",
      "last_name",
      "gender",
      "date_of_birth",
      "contact_no",
      "region",
      "province",
      "city",
      "barangay",
      "postal_code",
    ];
    for (const field of required) {
      if (!(formData as any)[field]?.trim()) {
        Swal.fire("Validation Error", "Please fill in all required fields.", "error");
        return;
      }
    }

    const payload = { ...formData, address };
    const url = "http://localhost/Abejo_AMS/backend/index.php/patient/save";  // Only save, no update

    try {
      const response = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data.status) {
        Swal.fire("Success", response.data.message, "success");
        setHasProfile(true); // after save, disable form
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Server Error",
        "Error connecting to server. Please try again later.",
        "error"
      );
    }
  };

  if (loading) return <p>Loading patient information...</p>;


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
                <div
                  className="box relative overflow-hidden main-content-card"
                  style={{ width: "800px" }}
                >
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
                           className="ti-form-input rounded-sm ps-11 focus:z-10"
                            placeholder="Enter Region"
                            autoComplete="region"
                            required
                            aria-required="true"
                          />
                         <i className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4 bi bi-geo-alt" aria-hidden="true"></i>
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
                           className="ti-form-input rounded-sm ps-11 focus:z-10"
                            placeholder="Enter Province"
                            autoComplete="address-level1"
                            required
                            aria-required="true"
                          />
                        <i className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4 bi bi-geo-alt" aria-hidden="true"></i>
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
                             className="ti-form-input rounded-sm ps-11 focus:z-10"
                            placeholder="Enter City / Municipality"
                            autoComplete="address-level2"
                            required
                            aria-required="true"
                          />
                          <i className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4 bi bi-geo-alt" aria-hidden="true"></i>
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
                              className="ti-form-input rounded-sm ps-11 focus:z-10"
                            placeholder="Enter Barangay"
                            autoComplete="address-line1"
                            required
                            aria-required="true"
                          />
                           <i className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4 bi bi-geo-alt" aria-hidden="true"></i>
                        </div>
                      </div>

                     {/* Postal Code */}
                          <div className="relative mb-4">
                            <label className="block font-medium mb-1" htmlFor="postal_code">Postal Code</label>
                            <div className="relative">
                              <input
                                type="text"
                                id="postal_code"
                                name="postal_code"
                                value={formData.postal_code}
                                onChange={handleChange}
                                className="ti-form-input rounded-sm ps-11 focus:z-10"
                                placeholder="Enter Postal Code"
                                autoComplete="postal-code"
                                required
                                aria-required="true"
                              />
                              <i className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4 bi bi-geo-alt" aria-hidden="true"></i>
                            </div>
                          </div>
                        
                      {/* Submit and Reset Buttons */}

                    <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="submit"
                   className="bg-green-500 text-white px-4 py-2 rounded-full"
                  >
                    {hasProfile ? "Update Information" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                   className="bg-blue-400 text-white px-4 py-2 rounded-full"
                  >
                    Reset
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

export default Patient_Information;

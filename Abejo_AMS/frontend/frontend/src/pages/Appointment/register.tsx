import Breadcrumb from "../../components/breadcrums";
import Header from "../../layouts/header";
import Sidemenu from "../../layouts/sidemenu";
import { useState, ChangeEvent, FormEvent } from "react";
import ProfileImage from "../../assets/avatar.png";


interface FormData {
    firstName: string;
    middleName?: string;
    lastName: string;
    suffix?: string;
    contactNumber: string;
    email: string;
    date: string;
    time: string;
    dentistId: string;
    treatmentId: string;
    notes?: string;    
    region: string;
    province: string;
    city: string;
    barangay: string;
    postalCode: string;
    insuranceProvider?: string;
    insuranceId: string;
    emergencyContactName: string;
    emergencyContactNumber: string;
    relationshipToPatient: string;
    photo?: File | null;
}

const initialFormData: FormData = {
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    contactNumber: "",
    email: "",
    date: "",
    time: "",
    dentistId: "",
    treatmentId: "",
    notes: "",    
    region: "",
    province: "",
    city: "",
    barangay: "",
    postalCode: "",
    insuranceProvider: "",
    insuranceId: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    relationshipToPatient: "",
    photo: null,
};

function Appointment_Registration() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [imagePreview, setImagePreview] = useState<string>(ProfileImage);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
      setFormData({ ...formData, photo: file });
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(ProfileImage);
    setFormData({ ...formData, photo: null });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted", formData);
  };

  return (
    <>
      <Header />
      <Sidemenu />
      <div className="main-content app-content">
        <div className="container-fluid">
          <Breadcrumb
            title="Handling Appointment"
            links={[
              { text: "Appointments", link: "/appointments" },
            ]}
            active="Appointment"
          />
          <div className="grid grid-cols-12 gap-x-6">
            <div className="xxl:col-span-12 col-span-12">
              <div className="box overflow-hidden main-content-card">
                <div className="box-body p-5">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4 flex items-start gap-4">
                      <span className="avatar avatar-xxl">
                        <img src={imagePreview} alt="Profile" id="profile-img" />
                      </span>
                      <div>
                        <label className="block font-medium mb-2">Profile Picture</label>
                        <div className="flex gap-2">
                          <label className="bg-green-300 text-dark px-4 py-2 rounded-full cursor-pointer">
                            <i className="bi bi-upload"></i>
                            <span className="px-2">Upload</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                          </label>
                          <button type="button" className="bg-red-300 px-4 py-2 rounded-full" onClick={handleRemoveImage}>
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    <hr className="mt-3 mb-4" />
                    <h2 className="font-bold text-lg mb-4">Patient's Information</h2>
                    <hr className="mt-3 mb-4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                       ["First Name", "firstName", "bi bi-person"],
                       ["Middle Name (Optional)", "middleName", "bi bi-person"],
                       ["Last Name", "lastName", "bi bi-person"],
                       ["Suffix (Optional)", "suffix", "bi bi-person-badge"],
                       ["Contact Number", "contactNumber", "bi bi-telephone"],
                       ["Email (Optional)", "email", "bi bi-envelope"],                   
                      ].map(([label, name, icon]) => (
                        <div key={name} className="relative">
                          <label className="block font-medium mb-1" htmlFor={name}>{label}</label>
                          <div className="relative">
                            <input
                              type={name === "email" ? "email" : "text"}
                              id={name}
                              name={name}
                              onChange={handleChange}
                              className="ti-form-input rounded-sm ps-11 focus:z-10"
                              placeholder={`Enter ${label}`}
                            />
                            <i className={`absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4 ${icon}`}></i>
                          </div>
                        </div>
                      ))}
                    </div>

                    <hr className="mt-3 mb-4" />
                    <h2 className="font-bold text-lg mb-4">Appointment Details</h2>
                    <hr className="mt-3 mb-4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        ["Preferred Date", "date", "bi bi-calendar"],
                        ["Preferred Time", "time", "bi bi-clock"],
                        ["Selected Dentist", "dentistId", "bi bi-person-badge"],
                        ["Payment Method", "treatmentId", "bi bi-credit-card"],
                      
                    ].map(([label, name, icon]) => (
                        <div key={name} className="relative">
                          <label className="block font-medium mb-1" htmlFor={name}>{label}</label>
                          <div className="relative">
                            <input
                              type={name === "email" ? "email" : "text"}
                              id={name}
                              name={name}
                              onChange={handleChange}
                              className="ti-form-input rounded-sm ps-11 focus:z-10"
                              placeholder={`Enter ${label}`}
                            />
                            <i className={`absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4 ${icon}`}></i>
                          </div>
                        </div>
                      ))}
                    </div>

                    

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
  {[
    ["Selected Treatment", "treatmentId", 
      [
        "Oral Prophylaxis",
        "Restoration",
        "Dentures",
        "Root Canal Treatment",
        "Extraction",
        "Jacket Crown/Fixed Bridge",
        "Braces",
        "Veneers",
        "Whitening",
        "Retainers"
      ]
    ]
  ].map(([label, name, options]) => (
    <div key={String(name)}>
      <label className="block font-medium mb-1">{label}</label>
      <select 
        id={String(name)} 
        name={String(name)} 
        onChange={handleChange} 
        className="ti-form-input rounded-sm focus:z-10"
      >
        <option value="">Select {label}</option>
        {(options as string[]).map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </select>
    </div>
  ))}
</div>



                    <div className="mt-4 flex justify-end gap-4">
                      <button type="reset" className="bg-blue-400 text-white px-4 py-2 rounded-full" onClick={() => setFormData(initialFormData)}>
                        Reset
                      </button>
                      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-full">
                        <i className="bi bi-save"></i>
                        <span className="px-3">Submit Appointment</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Appointment_Registration;

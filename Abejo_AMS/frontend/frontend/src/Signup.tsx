import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import background from "../assets/background.jpg";
import axios from "axios";
import swal from "sweetalert";

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "",
    gender: "Male",
    date_of_birth: "",
    email: "",
    contact_no: "",
    region: "",
    province: "",
    city: "",
    barangay: "",
    postal_code: ""
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      swal("Oops!", "Passwords do not match. Please try again.", "error");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/Abejo_AMS/backend/index.php/auth/signup",
        {
          username: formData.username,
          password: formData.password,
          first_name: formData.first_name,
          middle_name: formData.middle_name,
          last_name: formData.last_name,
          suffix: formData.suffix,
          gender: formData.gender,
          date_of_birth: formData.date_of_birth,
          email: formData.email,
          contact_no: formData.contact_no,
          region: formData.region,
          province: formData.province,
          city: formData.city,
          barangay: formData.barangay,
          postal_code: formData.postal_code
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.status === "success") {
        swal("Success!", response.data.message, "success").then(() => {
          navigate("/");
        });
      } else {
        swal("Error", response.data.message || "Signup failed.", "error");
      }
    } catch (error) {
      console.error("Signup error:", error);
      swal("Error", "There was a problem connecting to the server.", "error");
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen px-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="bg-white shadow-lg rounded-xl px-10 py-8 w-full max-w-3xl overflow-y-auto max-h-screen">
        <img src={logo} alt="Clinic Logo" className="mx-auto h-24 mb-6" />

        <h1 className="text-lg font-bold text-center mb-4">Sign Up</h1>
        <form onSubmit={handleSignup} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
          <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
          <input type="text" name="middle_name" placeholder="Middle Name" value={formData.middle_name} onChange={handleChange} />
          <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
          <input type="text" name="suffix" placeholder="Suffix (e.g. Jr., III)" value={formData.suffix} onChange={handleChange} />
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
          <input type="text" name="contact_no" placeholder="Contact Number" value={formData.contact_no} onChange={handleChange} required />
          <input type="text" name="region" placeholder="Region" value={formData.region} onChange={handleChange} />
          <input type="text" name="province" placeholder="Province" value={formData.province} onChange={handleChange} />
          <input type="text" name="city" placeholder="City/Municipality" value={formData.city} onChange={handleChange} />
          <input type="text" name="barangay" placeholder="Barangay" value={formData.barangay} onChange={handleChange} />
          <input type="text" name="postal_code" placeholder="Postal Code" value={formData.postal_code} onChange={handleChange} />

          <div className="md:col-span-2">
            <button type="submit" className="w-full h-11 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition">
              Sign Up
            </button>
          </div>

          <div className="md:col-span-2 text-center">
            <p className="text-sm mt-2">
              Already have an account?{" "}
              <a href="/" className="text-blue-600 hover:underline">
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;

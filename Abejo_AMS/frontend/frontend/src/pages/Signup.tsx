import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import background from "../assets/background.jpg";
import axios from "axios";
import swal from "sweetalert";

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
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
    postal_code: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      swal("Oops!", "Passwords do not match. Please try again.", "error");
      return;
    }

    const {
      confirmPassword,
      ...payload // exclude confirmPassword from data sent to backend
    } = formData;

    try {
      const response = await axios.post(
        "http://localhost/Abejo_AMS/backend/index.php/auth/signup",
        payload,
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
      <div className="bg-white shadow-lg rounded-xl px-10 py-8 w-full max-w-lg h-[300px]">
        <img src={logo} alt="Clinic Logo" className="mx-auto h-45 mb-8 drop-shadow-lg" />
        <h1 className="text-base font-bold text-center mb-4">Sign Up</h1>

        <form onSubmit={handleSignup} className="space-y-3">
          {[
            { name: "username", type: "text", placeholder: "Username" },
            { name: "password", type: "password", placeholder: "Password" },
            { name: "confirmPassword", type: "password", placeholder: "Confirm Password" },
            { name: "first_name", type: "text", placeholder: "First Name" },
            { name: "middle_name", type: "text", placeholder: "Middle Name" },
            { name: "last_name", type: "text", placeholder: "Last Name" },
            { name: "suffix", type: "text", placeholder: "Suffix (optional)" },
            { name: "email", type: "email", placeholder: "Email" },
            { name: "contact_no", type: "text", placeholder: "Contact Number" },
            { name: "date_of_birth", type: "date", placeholder: "" },
            { name: "region", type: "text", placeholder: "Region" },
            { name: "province", type: "text", placeholder: "Province" },
            { name: "city", type: "text", placeholder: "City/Municipality" },
            { name: "barangay", type: "text", placeholder: "Barangay" },
            { name: "postal_code", type: "text", placeholder: "Postal Code" }
          ].map((field) => (
            <input
              key={field.name}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={(formData as any)[field.name]}
              onChange={handleChange}
              className="w-full h-11 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              required={field.name !== "suffix"}
            />
          ))}

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full h-11 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <button
            type="submit"
            className="w-full h-11 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition"
          >
            Sign Up
          </button>

          <p className="text-sm text-center mt-3">
            Already have an Account?{" "}
            <a href="/" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;

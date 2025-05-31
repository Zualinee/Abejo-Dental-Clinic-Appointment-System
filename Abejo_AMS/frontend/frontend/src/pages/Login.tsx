import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import background from "../assets/background.jpg";
import axios from "axios";
import swal from "sweetalert";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      swal("Oops!", "Please enter both username and password.", "warning");
      return;
    }

    // Check if admin hardcoded login
    if (username === "admin" && password === "12345") {
      // Set admin auth locally without API call
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userType", "admin");

      swal("Success!", "Admin login successful!", "success").then(() => {
        navigate("/dashboard");
      });
      return;
    }

    // For patients, call backend API login
    try {
      const response = await axios.post(
        "http://localhost/Abejo_AMS/backend/index.php/auth/login",
        { username, password }
      );

      if (response.data.status === "success") {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userType", "patient");

        swal("Success!", "Login Successful!", "success").then(() => {
          navigate("/patientdashboard");
        });
      } else {
        swal("Oops!", response.data.message || "Login failed.", "error");
      }
    } catch (error) {
      console.error("Login error:", error);
      swal("Error", "Unable to connect to the server.", "error");
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen px-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="bg-white shadow-lg rounded-xl px-10 py-8 w-full max-w-lg h-[500px]">
        <img
          src={logo}
          alt="Clinic Logo"
          className="mx-auto h-43 mb-8 drop-shadow-lg"
        />

        <h1 className="text-base font-bold text-center mb-4">
          Welcome to Abejo Dental Clinic
        </h1>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-11 px-4 border border-gray-300 rounded-full text-left focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-4 border border-gray-300 rounded-full text-left focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex justify-between space-x-2">
            <button
              type="submit"
              className="w-full h-11 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition"
            >
              Login
            </button>
          </div>

          <p className="text-sm text-center mt-3">
            New patient?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </a>
          </p>
          <br></br>
        </form>
      </div>
    </div>
  );
};

export default Login;

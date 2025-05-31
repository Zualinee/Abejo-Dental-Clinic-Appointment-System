import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import background from "../assets/background.jpg";
import AuthForm from "../components/Authform";

const Signup: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    // Save user credentials in localStorage for now (you should use a backend)
    localStorage.setItem("user", JSON.stringify({ username, password }));

    alert("Signup successful! You can now log in.");
    navigate("/");
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen px-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="bg-white rounded-xl px-10 py-8 w-full max-w-lg">

      
      <AuthForm
        title="Sign Up"
        onSubmit={handleSignup}
        linkText="Login"
        linkHref="/"
        linkMessage="Already have an account?"


      >
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
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-4 border border-gray-300 rounded-full text-left focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
             <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-11 px-4 border border-gray-300 rounded-full text-left focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
      </AuthForm>
    </div>
    </div>

  );
};

export default Signup;

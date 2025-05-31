import React from "react";
import logo from "../assets/logo.png";

interface AuthFormProps {
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  linkText: string;
  linkHref: string;
  linkMessage: string;
}

const AuthForm: React.FC<AuthFormProps> = ({
  title,
  children,
  onSubmit,
  linkText,
  linkHref,
  linkMessage,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
      <img src={logo} alt="Clinic Logo" className="mx-auto h-30 mb-4" />
      <h1 className="text-lg font-bold mb-5">{title}</h1>

      <form onSubmit={onSubmit} className="space-y-6">
        {children}
        <button
          type="submit"
          className="w-48 h-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-500 text-white hover:bg-blue-700 transition"
        >
          {title}
        </button>
      </form>

      <p className="mt-4 text-sm">
        {linkMessage}{" "}
        <a href={linkHref} className="text-blue-600 hover:underline">
          {linkText}
        </a>
      </p>
    </div>
  );
};

export default AuthForm;

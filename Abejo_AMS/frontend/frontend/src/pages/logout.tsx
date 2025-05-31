import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert"; // ✅ Use SweetAlert for logout notification

const Logout = () => {
    const navigate = useNavigate();
    const hasAlerted = useRef(false); 

    useEffect(() => {
        if (!hasAlerted.current) {
            hasAlerted.current = true;
            
            // Clear stored user data
            localStorage.removeItem("user");
            sessionStorage.removeItem("user");

            // Show SweetAlert instead of alert
            swal("Success!", "Successfully Logged Out!", "success").then(() => {
                navigate("/"); // Redirect to the homepage after logout
            });
        }
    }, [navigate]);

    return null; 
};

export default Logout;

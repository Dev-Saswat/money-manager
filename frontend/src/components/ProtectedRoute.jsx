import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useRef } from "react";

function ProtectedRoute({ children }) {

  const token = localStorage.getItem("token");
  const shown = useRef(false);

  if (!token) {

    if (!shown.current) {
      toast.error("Please login to continue");
      shown.current = true;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;

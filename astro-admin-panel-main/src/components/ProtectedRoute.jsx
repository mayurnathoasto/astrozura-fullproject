import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function ProtectedRoute({ children }) {
  const { adminUser, loading } = useAppContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
        Checking admin session...
      </div>
    );
  }

  if (!adminUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

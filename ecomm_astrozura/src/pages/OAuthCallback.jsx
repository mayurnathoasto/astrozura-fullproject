import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthFromOAuth } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");

    const processLogin = async () => {
      if (!token) {
        navigate("/login?error=no_token", { replace: true });
        return;
      }

      const success = await setAuthFromOAuth(token);
      if (success) {
        navigate("/", { replace: true });
      } else {
        navigate("/login?error=auth_failed", { replace: true });
      }
    };

    void processLogin();
  }, [navigate, searchParams, setAuthFromOAuth]);

  return (
    <div className="h-screen flex items-center justify-center bg-[#0f1b2d] text-white">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
        <span className="text-sm font-semibold tracking-wide">Authenticating...</span>
      </div>
    </div>
  );
}

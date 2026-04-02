import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "./AuthCard";
import axios from "../../services/api.js";

export default function AuthPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("/auth/check", { withCredentials: true });
        // If check passes, redirect the user to home
        navigate("/");
      } catch (err) {
        // If not authenticated, do nothing (user stays on auth page)
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-slate-700 bg-cover bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://www.dreamworks.com/storage/movies/penguins-of-madagascar/gallery/penguins-of-madagascar-gallery-3.jpg')",
      }}
    >
      {/* dark overlay to fade the penguin */}
      <div className="absolute inset-0 bg-gray-900 opacity-70"></div>

      {/* animated banner */}
      <div className="absolute top-8 text-white text-2xl font-bold animate-slide-in z-10">
        🎉 Pingwish – Never Miss a Birthday! 🎂
      </div>

      {/* auth card */}
      <div className="relative z-10">
        <AuthCard />
      </div>
    </div>
  );
}

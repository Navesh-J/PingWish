import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext.jsx";

import api from "../../services/api.js";

export default function AuthCard() {
  const [flipped, setFlipped] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [error, setError] = useState("");

  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email: loginEmail,
        password: loginPassword,
      });

      setUser(res.data.user); // Update context
      navigate("/"); // Redirect to home
      console.log("Logged in", res.data);
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/register", {
        name: regName,
        email: regEmail,
        password: regPassword,
      });

      setUser(res.data.user);
      navigate("/");
      console.log("Registered", res.data);
    } catch (err) {
      const message = err.response?.data?.message || "Register failed";
      setError(message);
    }
  };

  return (
    <div className="relative w-96 h-[28rem] perspective">
      <div
        className={`w-full h-full transform duration-700 transform-preserve ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* LOGIN */}
        <div className="absolute inset-0 p-8 bg-white bg-opacity-90 rounded-xl backface-hidden flex flex-col neon-blue">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Welcome Back
          </h2>
          <input
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            placeholder="Email"
            className="mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            placeholder="Password"
            className="mb-6 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            required
            minLength={8}
          />
          <button
            type="submit"
            onClick={handleLogin}
            className="cursor-pointer mt-auto py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg"
          >
            Sign In
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setFlipped(true);
                setError("");
              }}
              className="text-indigo-600 hover:underline cursor-pointer"
            >
              Register
            </button>
          </p>
        </div>

        {/* REGISTER */}
        <div className="absolute inset-0 p-8 bg-white bg-opacity-90 rounded-xl backface-hidden rotate-y-180 flex flex-col neon-green">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Create Account
          </h2>
          <input
            value={regName}
            onChange={(e) => setRegName(e.target.value)}
            placeholder="Name"
            className="mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            value={regEmail}
            onChange={(e) => setRegEmail(e.target.value)}
            placeholder="Email"
            className="mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            type="password"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
            placeholder="Password"
            className="mb-6 p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
            required
          />
          <button
            type="submit"
            onClick={handleRegister}
            className="mt-auto py-3 bg-gradient-to-r from-green-500 cursor-pointer to-emerald-500 text-white rounded-lg"
          >
            Sign Up
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <p className="mt-4 text-center text-gray-600">
            Already have one?{" "}
            <button
              type="button"
              onClick={() => {
                setFlipped(false);
                setError("");
              }}
              className="text-teal-600 hover:underline cursor-pointer"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

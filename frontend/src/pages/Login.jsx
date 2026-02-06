import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  try {
    setLoading(true);

    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);

    toast.success("Welcome back 👋");
    navigate("/app/dashboard");

  } catch {
    toast.error("Invalid email or password");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gradient-to-br from-slate-950 via-slate-900 to-black">

      {/* Glow Blob */}
      <div className="absolute w-96 h-96 bg-blue-600/20 blur-3xl rounded-full -top-10 -left-10"></div>
      <div className="absolute w-96 h-96 bg-purple-600/20 blur-3xl rounded-full bottom-0 right-0"></div>

      {/* Card */}
      <div
        className="relative w-96 p-8 rounded-2xl
                   bg-slate-950/80 backdrop-blur-xl
                   border border-slate-800 shadow-2xl"
      >

        {/* Logo */}
        <h1 className="text-center text-3xl font-bold text-white mb-1">
          Money Manager
        </h1>

        <p className="text-center text-gray-400 mb-6">
          Smart finance starts here
        </p>

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm text-gray-400">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full mt-1 p-3 rounded-lg
                       bg-slate-900 border border-slate-700
                       text-white placeholder-gray-500
                       focus:outline-none focus:ring-2
                       focus:ring-blue-600"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-sm text-gray-400">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full mt-1 p-3 rounded-lg
                       bg-slate-900 border border-slate-700
                       text-white placeholder-gray-500
                       focus:outline-none focus:ring-2
                       focus:ring-blue-600"
          />
        </div>

        {/* Button */}
        <button
  onClick={handleLogin}
  disabled={loading}
  className="w-full py-3 rounded-lg font-semibold
             bg-gradient-to-r from-blue-600 to-purple-600
             hover:opacity-90 transition
             text-white shadow-lg
             disabled:opacity-50"
>
  {loading ? "Logging in..." : "Login"}
</button>


        {/* Footer */}
        <p className="text-center text-gray-400 mt-6">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-blue-400 hover:underline font-medium"
          >
            Register
          </a>
        </p>

      </div>

    </div>
  );
}

export default Login;

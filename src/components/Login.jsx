import axios from "axios";
import { useState } from "react";
import { addUser } from "../utils/userSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("mayur@gmail.com");
  const [password, setPassword] = useState("J)w8h$AG");
  const [showPassword, setShowPassword] = useState(false);

  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ---------------- TOAST HANDLER ---------------- */
  const showToast = (message, type = "error") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    if (!emailId.trim()) {
      showToast("Email is required");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailId)) {
      showToast("Please enter a valid email address");
      return false;
    }

    if (!password.trim()) {
      showToast("Password is required");
      return false;
    }

    return true;
  };

  /* ---------------- LOGIN ---------------- */
  const handleLogin = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      setToast(null);

      const res = await axios.post(
        `${BASE_URL}/login`,
        { emailId, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      dispatch(addUser(res.data));
      showToast("Login successful 🎉", "success");

      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      showToast(
        err?.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-toast">
          <div
            className={`alert shadow-2xl rounded-xl px-6 py-4 flex gap-3 items-center
              ${
                toast.type === "success"
                  ? "alert-success"
                  : toast.type === "warning"
                  ? "alert-warning"
                  : "alert-error"
              }
              bg-[#6366F1] text-white border border-[#6366F1]
            `}
          >
            {/* Icon */}
            <span className="text-xl">
              {toast.type === "success" && "✅"}
              {toast.type === "warning" && "⚠️"}
              {toast.type === "error" && "❌"}
            </span>

            {/* Message */}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body gap-4">

            {/* Header */}
            <div className="text-center">
              <h2 className="text-2xl font-bold">Welcome Back</h2>
              <p className="text-sm text-gray-500">
                Please login to your account
              </p>
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
                <a href="#" className="label-text-alt link link-hover">
                  Forgot password?
                </a>
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="input input-bordered w-full pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {/* Eye Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-2">
                <input type="checkbox" className="checkbox checkbox-primary" />
                <span className="label-text">Remember me</span>
              </label>
            </div>

            {/* Button */}
            <button
              className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Footer */}
            <p className="text-center text-sm">
              Don’t have an account?
              <Link to="/signup" className="link link-primary ml-1">
                Sign up
              </Link>
            </p>

          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

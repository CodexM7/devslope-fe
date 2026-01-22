import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emailId: "",
    firstName: "",
    lastName: "",
    password: "",
    age: "",
    gender: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      await axios.post(
        `${BASE_URL}/signup`,
        {
          ...formData,
          age: Number(formData.age),
        },
        { withCredentials: true }
      );

      navigate("/login"); // or feed
    } catch (err) {
      setError(
        err?.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">Create Account</h2>
          <p className="text-center text-gray-500 mb-4">
            Join and start connecting 🚀
          </p>

          {error && (
            <div className="alert alert-error text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* First Name */}
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="input input-bordered w-full"
              required
              value={formData.firstName}
              onChange={handleChange}
            />

            {/* Last Name */}
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="input input-bordered w-full"
              required
              value={formData.lastName}
              onChange={handleChange}
            />

            {/* Email */}
            <input
              type="email"
              name="emailId"
              placeholder="Email"
              className="input input-bordered w-full"
              required
              value={formData.emailId}
              onChange={handleChange}
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="input input-bordered w-full pr-12"
                required
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="btn btn-sm btn-ghost absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Age */}
            <input
              type="number"
              name="age"
              placeholder="Age"
              className="input input-bordered w-full"
              required
              min={18}
              value={formData.age}
              onChange={handleChange}
            />

            {/* Gender */}
            <select
              name="gender"
              className="select select-bordered w-full"
              required
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-full mt-2"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <span
              className="link link-primary"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

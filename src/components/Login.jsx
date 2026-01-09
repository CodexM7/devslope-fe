import axios from "axios";
import { useState } from "react";
import { addUser } from "../utils/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {

    const [emailId, setEmailId] = useState('mayur@gmail.com');
    const [password, setPassword] = useState('J)w8h$AG');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async() => {
        try {   
            const res = await axios.post(
            `${BASE_URL}/login`,
            {
                emailId: emailId,
                password: password,
            },
            {
                withCredentials: true, // IMPORTANT if using cookies / sessions
                headers: {
                "Content-Type": "application/json",
                },
            }
            );
            // console.log("Login success:", res.data);
            dispatch(addUser(res.data));
            return navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body gap-5">
          
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
              value={emailId}
              className="input input-bordered"
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
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              className="input input-bordered"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Remember me */}
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input type="checkbox" className="checkbox checkbox-primary" />
              <span className="label-text">Remember me</span>
            </label>
          </div>

          {/* Button */}
          <button className="btn btn-primary w-full" onClick={handleLogin}>
            Login
          </button>

          {/* Footer */}
          <p className="text-center text-sm">
            Don’t have an account?
            <a href="#" className="link link-primary ml-1">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

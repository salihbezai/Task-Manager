import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { loginUser } from "../../featuers/auth/authActions";
import { Link, useNavigate } from "react-router-dom";
import { clearError } from "../../featuers/auth/authSlice";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, loginLoading, loginError } = useSelector(
    (state: RootState) => state.auth,
  );

  const [formError, setFormError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      dispatch(clearError());
      setFormError("Email and Password are required");
      return;
    }
    setFormError(null);
    dispatch(clearError());
    dispatch(loginUser({ email, password }));
  };

  // when user is logged in
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    }
  }, [navigate, user]);

  return (
    <div className="min-h-screen  flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-blue-700 tracking-wide">
            Task Manager
          </h1>
          <p className="text-gray-600 mt-1">Organize • Assign • Track</p>
        </div>

        <h2 className="text-3xl font-semibold text-gray-800 text-center">
          Welcome Back 👋
        </h2>
        <p className="text-gray-500 text-center mt-1">Login to your account</p>

        {formError && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mt-4 text-center">
            {formError}
          </div>
        )}

        {loginError && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mt-4 text-center">
            {loginError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="flex flex-col mb-4">
            <label htmlFor="email" className="mb-1 text-gray-700 font-medium">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     transition bg-white text-gray-800"
            />
          </div>

          <div className="flex flex-col mb-6">
            <label
              htmlFor="password"
              className="mb-1 text-gray-700 font-medium"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     transition bg-white text-gray-800"
            />
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            className={`w-full py-2 rounded-lg text-white font-semibold 
          transition shadow-md 
          ${
            loginLoading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          >
            {loginLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

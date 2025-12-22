import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { registerUser } from "../../featuers/auth/authActions";
import { clearError, clearRegisterError } from "../../featuers/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user, registerLoading, registerError } = useSelector(
    (state: RootState) => state.auth
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteToken, setInviteToken] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      dispatch(clearRegisterError());
      setFormError("All fields except admin token are required");
      return;
    }        

    setFormError(null);
    dispatch(clearRegisterError());

    dispatch(
      registerUser({
        name,
        email,
        password,
        profileImageUrl: "",
        inviteToken: inviteToken
      })
    );
  };

  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin/dashboard");
      else navigate("/user/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl">
        <h1 className="text-4xl font-extrabold text-blue-700 text-center">
          Task Manager
        </h1>
        <p className="text-gray-600 text-center mt-1">
          Create your account 👤
        </p>

        {formError && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mt-4 text-center">
            {formError}
          </div>
        )}

        {registerError && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mt-4 text-center">
            {registerError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="flex flex-col mb-4">
            <label className="mb-1 text-gray-700 font-medium">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => {
                dispatch(clearRegisterError());
                setName(e.target.value);
              }}
              className="px-4 py-2 rounded-lg border border-gray-300 
              focus:outline-none focus:ring-2
               focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col mb-4">
            <label className="mb-1 text-gray-700 font-medium">Email</label>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => {
                dispatch(clearRegisterError());
                setEmail(e.target.value);
              }}
              className="px-4 py-2 rounded-lg border border-gray-300 
              focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col mb-4">
            <label className="mb-1 text-gray-700 font-medium">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                dispatch(clearRegisterError());
                setPassword(e.target.value);
              }}
              className="px-4 py-2 rounded-lg border border-gray-300
              focus:outline-none  focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col mb-6">
            <label className="mb-1 text-gray-700 font-medium">
              Admin Invite Token (Optional)
            </label>
            <input
              type="text"
              placeholder="Enter admin token if provided"
              value={inviteToken}
              onChange={(e) => {
                dispatch(clearRegisterError());
                setInviteToken(e.target.value);
              }}
              className="px-4 py-2 rounded-lg border border-gray-300
              focus:outline-none  focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={registerLoading}
            className={`w-full py-2 rounded-lg text-white font-semibold 
              transition shadow-md 
              ${
                registerLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {registerLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        {/* already have an account */}
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-semibold"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

import React, { useState } from "react";
import "./LoginModal.css";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
  useForgotPasswordMutation,
  useLogoutUserMutation,
} from "../slices/userApiSlice";
import { useDispatch } from "react-redux";
import { setUserInfoOnLoginOrRegister } from "../slices/authSlice";

function LoginModal({ setUser, setTasks }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentForm, setCurrentForm] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // RTK Query hooks
  const [loginUser] = useLoginUserMutation();
  const [registerUser] = useRegisterUserMutation();
  const [forgotPassword] = useForgotPasswordMutation();
  const [logoutUser] = useLogoutUserMutation();

  const dispatch = useDispatch();

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const showRegisterForm = () => {
    setCurrentForm("register");
  };

  const showResetPasswordForm = () => {
    setCurrentForm("reset");
  };

  // LOG OUT
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logoutUser().unwrap();
      setIsLoggedIn(false);
      setUser(null); // Clear the user state
      setTasks([]); // Clear the tasks state
      setIsOpen(false);
      setCurrentForm("login"); // Reset to login form
      alert("You have been signed out");
      window.location.reload();
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  };

  // LOG IN
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await loginUser({ email, password }).unwrap();
      alert("Connected");
      setUser(userData);
      setIsLoggedIn(true); // Update login state
      closeModal(); // Close the modal after successful login
    } catch (error) {
      console.error("Login failed: ", error);
    }
  };

  // REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser({
        email,
        password,
        confirmPassword,
      }).unwrap();
      console.log(res);
      dispatch(setUserInfoOnLoginOrRegister({ ...res }));

      alert("Registered successfully");
      setCurrentForm("login"); // Return to login form after registration
    } catch (error) {
      console.error("Registration failed: ", error);
    }
  };

  // FORGOT PASSWORD
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
      alert("Check your email");
      setCurrentForm("login"); // Return to login form after password reset
    } catch (error) {
      console.error("Password reset failed: ", error);
    }
  };

  const renderForm = () => {
    switch (currentForm) {
      case "login":
        return (
          <>
            <h2>Login</h2>
            <form className="login-form" onSubmit={handleLoginSubmit}>
              <input
                onInput={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                required
              />
              <input
                onInput={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                required
              />
              <button type="submit">Login</button>
            </form>
            <div className="modal-actions">
              <button onClick={showResetPasswordForm}>Reset Password</button>
              <button onClick={showRegisterForm}>Register</button>
            </div>
          </>
        );
      case "register":
        return (
          <>
            <h2>Register</h2>
            <form className="login-form" onSubmit={handleRegister}>
              <input
                onInput={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                required
              />
              <input
                onInput={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                required
              />
              <input
                onInput={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="Confirm Password"
                required
              />
              <button type="submit">Register</button>
            </form>
            <div className="modal-actions">
              <button onClick={() => setCurrentForm("login")}>
                Back to Login
              </button>
            </div>
          </>
        );
      case "reset":
        return (
          <>
            <h2>Reset Password</h2>
            <form className="login-form" onSubmit={handleForgotPassword}>
              <input
                onInput={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email"
                required
              />
              <button type="submit">Reset Password</button>
            </form>
            <div className="modal-actions">
              <button onClick={() => setCurrentForm("login")}>
                Back to Login
              </button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const renderConnected = () => (
    <div className="connected-container">
      <h2>You are connected!</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );

  return (
    <div>
      <div className="login-icon" onClick={openModal}>
        <i className="fas fa-user"></i>
      </div>

      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            {isLoggedIn ? renderConnected() : renderForm()}
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginModal;

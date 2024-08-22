import React, { useState } from "react";
import "./ResetPass.css"; // Assuming you want to style it separately
import axios from "axios";

function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = window.location.search.split("?")[1];
    const config = {
      method: "post",
      data: { password, confirmPassword },
      withCredentials: true,
    };
    const { data } = await axios(
      `http://localhost:8000/api/users/resetPassword/${token}`,
      config
    );
    alert("password changed succssesfully");
    window.location.href = "/";
    return data;
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <form className="reset-password-form" onSubmit={handleSubmit}>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          required
        />
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="enter password"
        />
        <input
          type="password"
          id="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="confirm password"
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}

export default ResetPasswordForm;

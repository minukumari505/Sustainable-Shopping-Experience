import React, { useState } from "react";
import "../Css/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (!result.success) {
        return toast.error(result.message || "Login failed", {
          position: "top-right"
        });
      }

      // ✅ Store user info
      localStorage.setItem("jwtToken", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("email", result.user.email);

      toast.success("Logged in successfully!", {
        position: "top-right"
      });

      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong. Please try again.", {
        position: "top-right"
      });
    }
  };

  return (
    <div className="login">
      <Link to="/">
        <img
          className="login__logo"
          src="../images/amazon_black.jpg"
          alt="Logo"
        />
      </Link>

      <div className="login__container">
        <h1>Sign-In</h1>
        <form onSubmit={submit}>
          <h5>Email</h5>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <h5>Password</h5>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="login__signInButton" type="submit">
            Sign In
          </button>
        </form>

        <p>
          By signing in you agree to the Terms and Conditions of the Amazon
          fake clone. Please see our privacy notice and cookies policy.
        </p>

        <Link to="/signup">
          <button className="login__registerButton">
            Create your Amazon account
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Login;
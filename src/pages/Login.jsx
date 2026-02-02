import { useState } from "react";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

function Login({ setUser }) {
  const navigate = useNavigate();

=======
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Login({ setUser }) {
>>>>>>> 12c0b2c51e84a22e48010364432d41959c682335
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
<<<<<<< HEAD

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  /* ================= EMAIL LOGIN ================= */
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5001/auth/login",
        formData,
        { withCredentials: true }
      );

      setUser(response.data.user);
      navigate("/dashboard");
    } catch (error) {
      setErrors({
        message:
          error.response?.data?.message || "Login failed",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= GOOGLE LOGIN ================= */
  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      setErrors({ message: "Google token missing" });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/auth/google-auth",
        { idToken: credentialResponse.credential },
        { withCredentials: true }
      );

      setUser(response.data.user);
      navigate("/dashboard");
    } catch (error) {
      setErrors({ message: "Google login failed" });
=======
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    let newError = {};
    let isValid = true;

    if (formData.email.length === 0) {
      newError.email = "Email is required";
      isValid = false;
    }
    if (formData.password.length === 0) {
      newError.password = "Password is required";
      isValid = false;
    }
    setErrors(newError);
    return isValid;
  };
    const navigate = useNavigate();
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      try {
        const body = {
          email: formData.email,
          password: formData.password,
        };
        const config = { withCredentials: true };
        const response = await axios.post(
          "http://localhost:5001/auth/login",
          body,
          config,
        );
        if (setUser) {
          setUser(response.data.user);
        }
        console.log(response);
        setMessage("User authenticated");
        navigate("/",{replace:true});
      } catch (error) {
        console.log(error);
        const errorMessage = error.response?.data?.message || "Something went wrong. Please try again later";
        setErrors({
          message: errorMessage,
        });
      }
    } else {
      console.log("Form has errors");
>>>>>>> 12c0b2c51e84a22e48010364432d41959c682335
    }
  };

  return (
    <div className="container text-center">
      <h3>Login to continue</h3>
<<<<<<< HEAD

      {errors.message && (
        <div className="alert alert-danger">{errors.message}</div>
      )}

      <form onSubmit={handleFormSubmit}>
        <div className="mb-3">
=======
      {errors.message && (
        <div className="alert alert-danger">{errors.message}</div>
      )}
      {message && (
        <div className="alert alert-success">{message}</div>
      )}

      <form onSubmit={handleFormSubmit}>
        <div>
          <label>Email: </label>
>>>>>>> 12c0b2c51e84a22e48010364432d41959c682335
          <input
            className="form-control"
            type="email"
            name="email"
            placeholder="Enter email"
<<<<<<< HEAD
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
=======
            onChange={handleChange}
          />
          {errors.email && <div className="text-danger">{errors.email}</div>}
        </div>
        <div>
          <label>Password: </label>
>>>>>>> 12c0b2c51e84a22e48010364432d41959c682335
          <input
            className="form-control"
            type="password"
            name="password"
            placeholder="Enter password"
<<<<<<< HEAD
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-primary w-100 mb-3" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <hr />

      {/* 🔐 GOOGLE LOGIN */}
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() =>
          setErrors({ message: "Google Login Failed" })
        }
      />
=======
            onChange={handleChange}
          />
          {errors.password && <div className="text-danger">{errors.password}</div>}
        </div>

        <div>
          <button className="btn btn-primary" type="submit">
            Login
          </button>
        </div>
      </form>
>>>>>>> 12c0b2c51e84a22e48010364432d41959c682335
    </div>
  );
}

<<<<<<< HEAD
export default Login;
=======
export default Login;
>>>>>>> 12c0b2c51e84a22e48010364432d41959c682335

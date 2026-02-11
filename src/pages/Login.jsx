import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { SET_USER } from "../redux/user/action";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let newError = {};
    let isValid = true;

    if (!formData.email) {
      newError.email = "Email is required";
      isValid = false;
    }

    if (!formData.password) {
      newError.password = "Password is required";
      isValid = false;
    }

    setErrors(newError);
    return isValid;
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    try {
      const response = await axios.post(`${serverEndpoint}/auth/login`, {
        email: formData.email,
        password: formData.password,
      }, { withCredentials: true });

      dispatch({
        type: SET_USER,
        payload: response.data.user,
      });

      setMessage("User authenticated");
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
      setErrors({
        message:
          error.response?.data?.message ||
          "Something went wrong. Please try again later",
      });
    }
  };

  const handleGoogleSuccess = async (authResponse) => {
    try {
      const response = await axios.post(`${serverEndpoint}/auth/google-auth`, {
        idToken: authResponse?.credential,
      }, { withCredentials: true });

      dispatch({
        type: SET_USER,
        payload: response.data.user,
      });

      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
      setErrors({ message: "Unable to process Google sign-in" });
    }
  };

  const handleGoogleFailure = () => {
    setErrors({
      message: "Something went wrong while performing Google sign-in",
    });
  };

  return (
    <div className="container text-center">
      <h3>Login to continue</h3>

      {errors.message && (
        <div className="alert alert-danger">{errors.message}</div>
      )}
      {message && (
        <div className="alert alert-success">{message}</div>
      )}

      <div className="row justify-content-center">
        <div className="col-6">
          <form onSubmit={handleFormSubmit}>
            <div>
              <label>Email:</label>
              <input
                className="form-control"
                type="email"
                name="email"
                placeholder="Enter email"
                onChange={handleChange}
              />
              {errors.email && (
                <div className="text-danger">{errors.email}</div>
              )}
            </div>

            <div>
              <label>Password:</label>
              <input
                className="form-control"
                type="password"
                name="password"
                placeholder="Enter password"
                onChange={handleChange}
              />
              {errors.password && (
                <div className="text-danger">{errors.password}</div>
              )}
            </div>

            <div className="mt-3">
              <button className="btn btn-primary" type="submit">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="row justify-content-center mt-3">
        <div className="col-6">
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
            />
          </GoogleOAuthProvider>
        </div>
      </div>

      <p className="mt-3">
        <Link to="/reset-password">Forgot Password?</Link>
      </p>
      <p>
        Don&apos;t have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;

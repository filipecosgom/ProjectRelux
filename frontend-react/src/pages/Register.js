import React, { useState } from "react";
import "../pages/Register.css";
import { useNavigate, Link } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";


function Register() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  // Function to make the REST request for registration
  const registerUser = async (userData) => {
    try {
      const response = await fetch(
        "http://localhost:8080/filipe-proj4/rest/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.text();
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form behavior
    try {
      console.log("Sending data:", inputs); // Log the data being sent
      const response = await registerUser(inputs); // Call the registration function
      console.log("Response received:", response); // Log the response received
      alert(
        `Registration successful!\nSent: ${JSON.stringify(
          inputs
        )}\nResponse received: ${response}`
      ); // Alert the user
      navigate("/login", { replace: true }); // Navigate to the login page
    } catch (error) {
      console.error("Registration error:", error); // Log the error
      setError("Registration failed. Please check your details and try again."); // Set the error message
      alert(
        `Registration failed!\nSent: ${JSON.stringify(inputs)}\nError: ${
          error.message
        }`
      ); // Alert the user
    }
  };

  return (
    <div className="register-container">
      <div className="Register">
        <h1>
          <FaUserPlus />
            Register new user
        </h1>
        {error && <p className="error">{error}</p>}{" "}
        {/* Display error message if any */}
        <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input
              type="text"
              name="username"
              defaultValue={inputs.username || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              defaultValue={inputs.password || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            First name:
            <input
              type="text"
              name="firstName"
              defaultValue={inputs.firstName || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Last name:
            <input
              type="text"
              name="lastName"
              defaultValue={inputs.lastName || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              defaultValue={inputs.email || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Phone:
            <input
              type="text"
              name="phone"
              defaultValue={inputs.phone || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Image URL:
            <input
              type="text"
              name="imagem"
              defaultValue={inputs.imagem || ""}
              onChange={handleChange}
            />
          </label>
          <input type="submit" value="Register" />
        </form>
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

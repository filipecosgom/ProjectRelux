import React, { useEffect, useState } from "react";
import { userStore } from "../stores/UserStore";
import { FaUser, FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import "./Profile.css";

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const token = userStore((state) => state.token);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/filipe-proj4/rest/users/me",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const data = await response.json();
        setUserDetails(data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [token]);

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="Profile">
        <img src={userDetails.imagem} alt="Profile" className="profile-image" />
        <h1>
          {userDetails.firstName} {userDetails.lastName}
        </h1>
        <p>
          {userDetails.isAdmin ? "Admin" : "Utilizador"} <FaUser />
        </p>
        <div className="profile-details">
          <div className="profile-column">
            <p>Username: {userDetails.username}</p>
            <p>Password: {"*".repeat(userDetails.password.length)}</p>
          </div>
          <div className="profile-column">
            <p>Email: {userDetails.email}</p>
            <p>Telefone: {userDetails.phone}</p>
          </div>
        </div>
        <p>
          Estado da conta:{" "}
          {userDetails.isDeleted ? (
            <>
              Inativa <MdCancel className="inactive-icon" />
            </>
          ) : (
            <>
              Activa <FaCheckCircle className="active-icon" />
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default Profile;

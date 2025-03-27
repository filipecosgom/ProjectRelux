import React, { useState } from "react";
import { FaRegEyeSlash, FaEye } from "react-icons/fa";
import "./EditUserModal.css";

const EditUserModal = ({
  user,
  isVisible,
  onClose,
  onSave,
  onChange,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false); // Estado para alternar exibição da senha

  if (!isVisible) return null;

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Editar Utilizador</h3>
        {error && <p className="error">{error}</p>}
        <form onSubmit={onSave}>
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={onChange}
              required
            />
          </label>
          <label>
            Password:
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={user.password}
                onChange={onChange}
                required
              />
              <button
                type="button"
                className="toggle-password-button"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaRegEyeSlash /> : <FaEye />}
              </button>
            </div>
          </label>
          <label>
            First Name:
            <input
              type="text"
              name="firstName"
              value={user.firstName}
              onChange={onChange}
              required
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              name="lastName"
              value={user.lastName}
              onChange={onChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={onChange}
              required
            />
          </label>
          <label>
            Phone:
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={onChange}
              required
            />
          </label>
          <label>
            Image URL:
            <input
              type="text"
              name="imagem"
              value={user.imagem}
              onChange={onChange}
            />
          </label>
          <label>
            Admin:
            <input
              type="checkbox"
              name="isAdmin"
              checked={user.isAdmin}
              onChange={onChange}
            />
          </label>
          <label>
            Ativo:
            <input
              type="checkbox"
              name="isDeleted"
              checked={!user.isDeleted}
              onChange={(e) =>
                onChange({
                  target: {
                    name: "isDeleted",
                    value: !e.target.checked,
                  },
                })
              }
            />
          </label>
          <div className="modal-buttons">
            <button type="submit">Salvar</button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;

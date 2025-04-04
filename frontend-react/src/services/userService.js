import api from "./apiService";
const API_BASE_URL = "http://localhost:8080/filipe-proj5/rest/users";

/**
 * Atualiza os dados de um utilizador.
 * @param {Object} user - Os dados do utilizador a serem atualizados.
 * @param {string} token - O token de autenticação.
 * @returns {Promise<Object|string>} - Os dados atualizados do utilizador ou uma mensagem de texto.
 */
export const updateUser = async (user, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar o utilizador.");
    }
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    console.error("Erro no serviço de atualização de utilizador:", error);
    throw error; // Propaga o erro para ser tratado onde o serviço for chamado
  }
};

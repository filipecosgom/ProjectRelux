const API_BASE_URL = "http://localhost:8080/filipe-proj4/rest/users";

/**
 * Atualiza os dados de um utilizador.
 * @param {Object} user - Os dados do utilizador a serem atualizados.
 * @param {string} token - O token de autenticação.
 * @returns {Promise<Object>} - Os dados atualizados do utilizador.
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

    return await response.json(); // Retorna os dados atualizados do utilizador
  } catch (error) {
    console.error("Erro no serviço de atualização de utilizador:", error);
    throw error; // Propaga o erro para ser tratado onde o serviço for chamado
  }
};

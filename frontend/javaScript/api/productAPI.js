'use strict';

import { API_ENDPOINTS, DEFAULT_OPTIONS } from '../config/apiConfig.js';

// Product API functions
export async function getAllProducts() {
  try {
    const response = await fetch(API_ENDPOINTS.products.all, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ERRO AO CARREGAR OS MEUS PRODUTOS: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
}

export async function getProductById(produtoId) {
  try {
    const response = await fetch(API_ENDPOINTS.products.byId(produtoId), {
      method: 'GET',
      headers: DEFAULT_OPTIONS.headers,
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar o produto: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar o produto:', error);
    return null;
  }
}

export async function updateProduct(produtoId, updatedProduct) {
  try {
    const response = await fetch(API_ENDPOINTS.products.update(produtoId), {
      method: 'PUT',
      headers: DEFAULT_OPTIONS.headers,
      body: JSON.stringify(updatedProduct),
    });

    if (!response.ok) {
      throw new Error(`Erro ao atualizar o produto: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar o produto:', error);
    throw error;
  }
}

export async function deleteProduct(produtoId) {
  try {
    const response = await fetch(API_ENDPOINTS.products.delete(produtoId), {
      method: 'DELETE',
      headers: DEFAULT_OPTIONS.headers,
    });

    if (!response.ok) {
      throw new Error(`Erro ao eliminar o produto: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Erro ao eliminar o produto:', error);
    throw error;
  }
}

export async function sendNewProductReq(product) {
  try {
    const response = await fetch(API_ENDPOINTS.products.create, {
      method: 'POST',
      headers: DEFAULT_OPTIONS.headers,
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error(`Erro ao enviar o produto: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao enviar o produto:', error);
    throw error;
  }
}

export async function getProductsByUser(username) {
  try {
    const response = await fetch(API_ENDPOINTS.products.byUser(username), {
      method: 'GET',
      headers: DEFAULT_OPTIONS.headers,
    });

    if (!response.ok) {
      throw new Error(
        `Erro ao buscar produtos do usuário: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar produtos do usuário:', error);
    return null;
  }
}

export async function getProductsByCategory(categoryId) {
  try {
    const response = await fetch(
      API_ENDPOINTS.products.byCategory(categoryId),
      {
        method: 'GET',
        headers: DEFAULT_OPTIONS.headers,
      }
    );

    if (!response.ok) {
      throw new Error(
        `Erro ao buscar produtos por categoria: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar produtos por categoria:', error);
    return null;
  }
}

export async function softDeleteProduct(produtoId) {
  try {
    const response = await fetch(API_ENDPOINTS.products.softDelete(produtoId), {
      method: 'DELETE',
      headers: DEFAULT_OPTIONS.headers,
    });

    if (!response.ok) {
      throw new Error(
        `Erro ao realizar a exclusão lógica do produto: ${response.statusText}`
      );
    }

    return true;
  } catch (error) {
    console.error('Erro ao realizar a exclusão lógica do produto:', error);
    throw error;
  }
}

export async function updateProductState(produtoId, state) {
  try {
    const response = await fetch(
      API_ENDPOINTS.products.updateState(produtoId),
      {
        method: 'PUT',
        headers: DEFAULT_OPTIONS.headers,
        body: JSON.stringify({ state }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Erro ao atualizar o estado do produto: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar o estado do produto:', error);
    throw error;
  }
}

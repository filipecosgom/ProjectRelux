'use strict';

/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */

// Base URL
const API_BASE_URL = 'http://localhost:8080/mariana-filipe-proj3/rest';

export async function submitLoginForm() {
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  try {
    const response = await fetch(
      'http://localhost:8080/mariana-filipe-proj3/rest/users/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      }
    );

    if (response.ok) {
      const token = await response.text();

      console.log('estamos aqui', token);

      sessionStorage.setItem('token', token);

      sessionStorage.setItem('isUserLoggedin', true);

      window.location.href = 'index.html';
    } else {
      alert('Login falhou! Por favor verifique as suas credenciais.');
    }
  } catch (error) {
    alert('Erro ao fazer login. Tente novamente.');
    console.error('Erro no login:', error);
  }
}

// HTTP request default options
const DEFAULT_OPTIONS = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

class API {
  constructor(base_url = API_BASE_URL, token = null) {
    this.base_url = base_url;
    this.token = token;
  }

  setToken(token) {
    this.token = token;
  }

  async _fetch(method, endpoint, body = null) {
    let headers = DEFAULT_OPTIONS.headers;
    if (this.token) {
      headers = {
        ...headers,
        Authorization: this.token,
      };
    }

    const options = {
      method,
      headers: headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.base_url}${endpoint}`, options);
    return response;
  }

  async login(username, password) {
    const response = await this._fetch('POST', '/users/login', {
      username,
      password,
    });

    if (!response.ok) {
      return null;
    }

    this.token = await response.text();

    return this.token;
  }

  async getMe() {
    const response = await this._fetch('GET', '/users/me');

    if (!response.ok) {
      return null;
    }

    return await response.json();
  }

  async logout() {
    await this._fetch('POST', '/users/logout');
    this.token = null;

    return true;
  }
}

// API Endpoints
const API_ENDPOINTS = {
  // Product endpoints
  products: {
    base: `${API_BASE_URL}/products`,
    all: `${API_BASE_URL}/products/all`,
    byId: id => `${API_BASE_URL}/products/${id}`,
    create: `${API_BASE_URL}/products`,
    update: id => `${API_BASE_URL}/products/${id}`,
    delete: id => `${API_BASE_URL}/products/${id}`,
    mostRecent: `${API_BASE_URL}/products/recent`,
    mostRated: `${API_BASE_URL}/products/rated`,
  },

  // User endpoints
  users: {
    base: `${API_BASE_URL}/users`,
    login: `${API_BASE_URL}/users/login`,
    register: `${API_BASE_URL}/users/register`,
    byUsername: username => `${API_BASE_URL}/users/${username}`,
    update: username => `${API_BASE_URL}/users/${username}`,
    checkUsername: `${API_BASE_URL}/users/check-username`,
  },
};

const api = new API();

function loadTokenFromLocalStorage() {
  const token = localStorage.getItem('token');
  if (token) {
    api.setToken(token);
  }
}

function setTokenToLocalStorage(token) {
  if (token === null) {
    localStorage.removeItem('token');
    return;
  }
  localStorage.setItem('token', token);
}

export {
  API_BASE_URL,
  API_ENDPOINTS,
  DEFAULT_OPTIONS,
  api,
  loadTokenFromLocalStorage,
  setTokenToLocalStorage,
};

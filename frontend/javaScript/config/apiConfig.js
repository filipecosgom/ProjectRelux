'use strict';

/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */

// Base URL
const API_BASE_URL = 'http://localhost:8080/mariana-filipe-proj3/rest';

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
    softDelete: id => `${API_BASE_URL}/products/soft-delete/${id}`,
    updateState: id => `${API_BASE_URL}/products/update-state/${id}`,
    byUser: username => `${API_BASE_URL}/products/user-products/${username}`,
    byCategory: categoryId => `${API_BASE_URL}/products/category/${categoryId}`,
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

// HTTP request default options
const DEFAULT_OPTIONS = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export { API_BASE_URL, API_ENDPOINTS, DEFAULT_OPTIONS };

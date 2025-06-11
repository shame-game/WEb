import { API_BASE_URL, STORAGE_KEYS } from '../constants';

// Utility function để tạo headers
const createHeaders = (options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

// Utility function để handle response
const handleResponse = async (response) => {
  if (!response.ok) {
    // Xử lý lỗi 401 - Unauthorized
    if (response.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = '/login';
    }

    // Lấy error message từ response
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: 'Có lỗi xảy ra' };
    }

    throw new Error(errorData.message || `HTTP Error: ${response.status}`);
  }

  return response.json();
};

// API client object
const api = {
  // GET request
  get: async (endpoint, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: createHeaders(options),
      ...options,
    });
    return handleResponse(response);
  },

  // POST request
  post: async (endpoint, data, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: createHeaders(options),
      body: JSON.stringify(data),
      ...options,
    });
    return handleResponse(response);
  },

  // PUT request
  put: async (endpoint, data, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: createHeaders(options),
      body: JSON.stringify(data),
      ...options,
    });
    return handleResponse(response);
  },

  // DELETE request
  delete: async (endpoint, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: createHeaders(options),
      ...options,
    });
    return handleResponse(response);
  },

  // PATCH request
  patch: async (endpoint, data, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: createHeaders(options),
      body: JSON.stringify(data),
      ...options,
    });
    return handleResponse(response);
  },
};

export default api;

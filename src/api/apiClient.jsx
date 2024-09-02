import axios from 'axios';

class ApiClient {
  constructor(baseURL) {
    this.client = axios.create({
      baseURL: baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Basic CRUD operations
  get(path, params = {}) {
    return this.client.get(path, { params });
  }

  post(path, data = {}) {
    return this.client.post(path, data);
  }

  put(path, data = {}) {
    return this.client.put(path, data);
  }

  delete(path) {
    return this.client.delete(path);
  }

  // Optional: Method to set authorization token
  setAuthToken(token) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Optional: Method to remove authorization token
  removeAuthToken() {
    delete this.client.defaults.headers.common['Authorization'];
  }
}

// Instantiate the client with your base URL
const apiClient = new ApiClient('http://localhost:8080');

export default apiClient;
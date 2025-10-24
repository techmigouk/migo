// API Client for cross-dashboard communication

interface APIClientConfig {
  baseURL: string;
  token?: string;
}

export class APIClient {
  private baseURL: string;
  private token?: string;

  constructor(config: APIClientConfig) {
    this.baseURL = config.baseURL;
    this.token = config.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `Request failed with status ${response.status}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  setToken(token: string) {
    this.token = token;
  }

  removeToken() {
    this.token = undefined;
  }
}

// Pre-configured clients for each dashboard
export const createAdminAPIClient = (token?: string) => {
  return new APIClient({
    baseURL: process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001',
    token,
  });
};

export const createFrontAPIClient = (token?: string) => {
  return new APIClient({
    baseURL: process.env.NEXT_PUBLIC_FRONT_API_URL || 'http://localhost:3000',
    token,
  });
};

export const createUserAPIClient = (token?: string) => {
  return new APIClient({
    baseURL: process.env.NEXT_PUBLIC_USER_API_URL || 'http://localhost:3004',
    token,
  });
};

const API_BASE_URL = 'http://localhost:8000';

interface RequestOptions extends RequestInit {
  customHeaders?: Record<string, string>;
}

// Import authService to handle token
import { authService } from './authService';

// Variable for the router that will be set from outside
let vueRouter: any = null;

class HttpService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Sets the Vue router to handle redirects
   */
  setRouter(router: any): void {
    vueRouter = router;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { customHeaders = {}, ...requestOptions } = options;

    // Add authentication token if present
    const token = authService.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...customHeaders,
    };

    const config: RequestInit = {
      ...requestOptions,
      headers,
      credentials: 'include', // Send cookies with requests
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);

      // Handle 401 Unauthorized
      if (response.status === 401) {
        // Remove invalid token
        authService.logout();
        
        // Redirect to login using Vue Router if available
        if (vueRouter) {
          vueRouter.push({ name: 'Login' });
        } else {
          window.location.href = '/';
        }
        throw new Error('Non autorizzato. Reindirizzamento alla login...');
      }

      if (!response.ok) {
        const error = new Error(`HTTP error! status: ${response.status}`);
        // Add status code to error to use it
        (error as any).status = response.status;
        throw error;
      }

      // Handle responses without content (204 No Content)
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return null as T;
      }

      // Check if response has JSON content
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      // If not JSON, return text
      const text = await response.text();
      return (text || null) as T;
    } catch (error) {
      console.error('HTTP Request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string, customHeaders?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      customHeaders,
    });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    customHeaders?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      customHeaders,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    customHeaders?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      customHeaders,
    });
  }

  async delete<T>(endpoint: string, customHeaders?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      customHeaders,
    });
  }
}

export const httpService = new HttpService(API_BASE_URL);

import { httpService } from './httpService';

// To avoid circular dependencies, import httpService here
// but only for auth calls
class AuthService {
  private readonly TOKEN_KEY = 'auth_token';

  /**
   * Saves the token in localStorage
   */
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Gets the token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Removes the token from localStorage
   */
  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Checks if the user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Performs login by calling the API
   */
  async login(username: string, password: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response: { token?: string } = await httpService.post('/api/login', {
        username,
        password
      });
      
      if (response.token) {
        this.setToken(response.token);
        return { success: true };
      } else {
        return { success: false, message: 'Credenziali non valide' };
      }
    } catch (error: any) {
      console.error('Errore durante il login:', error);
      
      // Differentiate error messages based on HTTP status code
      if (error.status === 422 || error.status === 401) {
        return { success: false, message: 'Credenziali non valide' };
      } else if (error.status >= 500) {
        return { success: false, message: 'Errore del server. Riprova più tardi.' };
      } else {
        return { success: false, message: 'Errore durante il login. Riprova.' };
      }
    }
  }

  /**
   * Performs logout by calling the API and removing the local token
   */
  async logout(): Promise<void> {
    try {
      // Try to call logout endpoint if there's a token
      if (this.getToken()) {
        await httpService.post('/api/logout');
      }
    } catch (error) {
      // Doesn't matter if the call fails, continue anyway
      console.warn('Errore durante la chiamata di logout al server:', error);
    } finally {
      // Always remove the local token
      this.removeToken();
    }
  }
}

export const authService = new AuthService();
<template>
  <div class="login-container">
    <div class="login-form">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Email:</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            required
            :disabled="isLoading"
          />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required
            :disabled="isLoading"
          />
        </div>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <button 
          type="submit" 
          class="login-btn" 
          :disabled="isLoading"
        >
          {{ isLoading ? 'Accesso in corso...' : 'Accedi' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { authService } from '../../services';

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      isLoading: false,
      errorMessage: ''
    }
  },
  methods: {
    async handleLogin() {
      this.isLoading = true;
      this.errorMessage = '';
      
      try {
        const result = await authService.login(this.username, this.password);
        
        if (result.success) {
          // Redirect to dashboard/ordini
          this.$router.push('/orders');
        } else {
          this.errorMessage = result.message || 'Errore durante il login';
        }
      } catch (error) {
        console.error('Errore durante il login:', error);
        this.errorMessage = 'Errore durante il login. Riprova.';
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@use './Login.scss';
</style>
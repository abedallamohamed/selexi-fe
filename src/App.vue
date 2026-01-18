<template>
  <div id="app">
    <nav v-if="$route.path !== '/'" class="navbar">
      <div class="nav-brand">
        <h2>Selexi</h2>
      </div>
      <div class="nav-links">
        <router-link to="/orders" class="nav-link">Ordini</router-link>
        <router-link to="/customers" class="nav-link">Clienti</router-link>
        <button @click="logout" class="logout-btn">Logout</button>
      </div>
    </nav>
    
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
import { authService } from './services/authService';

export default {
  name: 'App',
  methods: {
    async logout() {
      //Complete logout (API call + remove local token)
      await authService.logout();
      this.$router.push('/');
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.navbar {
  background: white;
  border-bottom: 1px solid #e9ecef;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-brand h2 {
  color: #42b983;
  font-size: 1.5rem;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  text-decoration: none;
  color: #6c757d;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.nav-link:hover {
  color: #42b983;
  background-color: #f8f9fa;
}

.nav-link.router-link-active {
  color: #42b983;
  background-color: #e8f5e8;
}

.logout-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: #c82333;
}

.main-content {
  min-height: calc(100vh - 64px);
}
</style>

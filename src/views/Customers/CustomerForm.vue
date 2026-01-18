<template>
  <div class="customer-form-container">
    <div class="header">
      <button @click="goBack" class="back-btn">
        ← Indietro
      </button>
      <h1>{{ isEditing ? 'Modifica Cliente' : 'Nuovo Cliente' }}</h1>
    </div>
    
    <form @submit.prevent="handleSubmit" class="customer-form">
      <div class="form-group">
        <label for="name">Nome *</label>
        <input 
          type="text" 
          id="name" 
          v-model="form.name" 
          required
          :disabled="isLoading"
        />
      </div>

      <div class="form-group">
        <label for="email">Email *</label>
        <input 
          type="email" 
          id="email" 
          v-model="form.email" 
          required
          :disabled="isLoading"
        />
      </div>

      <div class="form-group">
        <label for="phone">Telefono</label>
        <input 
          type="tel" 
          id="phone" 
          v-model="form.phone" 
          :disabled="isLoading"
        />
      </div>

      <div class="form-group">
        <label for="address">Indirizzo</label>
        <textarea 
          id="address" 
          v-model="form.address" 
          rows="3"
          :disabled="isLoading"
        ></textarea>
      </div>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div class="form-actions">
        <button 
          type="button" 
          @click="goBack" 
          class="cancel-btn"
          :disabled="isLoading"
        >
          Annulla
        </button>
        <button 
          type="submit" 
          class="save-btn"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Salvataggio...' : (isEditing ? 'Aggiorna' : 'Crea') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { customerService } from '../../services';

export default {
  name: 'CustomerForm',
  data() {
    return {
      form: {
        name: '',
        email: '',
        phone: '',
        address: ''
      },
      isLoading: false,
      errorMessage: ''
    }
  },
  computed: {
    isEditing() {
      return !!this.$route.params.id;
    },
    customerId() {
      return this.$route.params.id ? parseInt(this.$route.params.id) : null;
    }
  },
  async mounted() {
    if (this.isEditing) {
      await this.loadCustomer();
    }
  },
  methods: {
    async loadCustomer() {
      try {
        this.isLoading = true;
        const response = await customerService.getById(this.customerId);
        this.form = {
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone || '',
          address: response.data.address || ''
        };
      } catch (error) {
        console.error('Error loading customer:', error);
        this.errorMessage = 'Errore nel caricamento del cliente';
      } finally {
        this.isLoading = false;
      }
    },

    async handleSubmit() {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        if (this.isEditing) {
          await customerService.update(this.customerId, this.form);
        } else {
          await customerService.create(this.form);
        }
        
        this.$router.push('/customers');
      } catch (error) {
        console.error('Error saving customer:', error);
        this.errorMessage = this.isEditing ? 
          'Errore nell\'aggiornamento del cliente' : 
          'Errore nella creazione del cliente';
      } finally {
        this.isLoading = false;
      }
    },

    goBack() {
      this.$router.push('/customers');
    }
  }
}
</script>

<style lang="scss" scoped>
.customer-form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  
  h1 {
    color: #333;
    margin: 0;
  }
}

.back-btn {
  background: none;
  border: 1px solid #ddd;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  color: #666;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background-color: #f5f5f5;
    border-color: #999;
    color: #333;
  }
}

.customer-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

input, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #42b983;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
}

textarea {
  resize: vertical;
}

.error-message {
  color: #e74c3c;
  background-color: #fadbd8;
  padding: 0.5rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.cancel-btn, .save-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.cancel-btn {
  background-color: #6c757d;
  color: white;

  &:hover:not(:disabled) {
    background-color: #5a6268;
  }
}

.save-btn {
  background-color: #42b983;
  color: white;

  &:hover:not(:disabled) {
    background-color: #369870;
  }
}
</style>
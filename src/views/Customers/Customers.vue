<template>
  <div class="customers-container">
    <div class="header">
      <h1>Clienti</h1>
      <div class="header-actions">
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="Cerca cliente..."
          class="search-input"
        />
        <button @click="addCustomer" class="add-btn">Nuovo Cliente</button>
      </div>
    </div>
    
    <div class="customers-list">
      <div v-if="loading" class="loading-message">
        Caricamento clienti...
      </div>
      
      <div v-else-if="error" class="error-message">
        {{ error }}
        <button @click="fetchCustomers" class="retry-btn">Riprova</button>
      </div>
      
      <div v-else-if="filteredCustomers.length === 0" class="empty-message">
        {{ searchTerm ? 'Nessun cliente trovato per la ricerca' : 'Nessun cliente trovato' }}
      </div>
      
      <div 
        v-else
        v-for="customer in filteredCustomers" 
        :key="customer.id" 
        class="customer-card"
      >
        <div class="customer-info">
          <h3>{{ customer.name }}</h3>
          <p class="email">{{ customer.email }}</p>
          <p class="phone">{{ customer.phone || 'N/A' }}</p>
        </div>
        <div class="customer-stats">
          <div class="stat">
            <span class="stat-label">Ordini:</span>
            <span class="stat-value">{{ customer.orders_count || 0 }}</span>
          </div>
        </div>
        <div class="customer-actions">
          <button @click="viewOrders(customer.id)" class="orders-btn">
            Ordini
          </button>
          <button @click="editCustomer(customer.id)" class="edit-btn">
            Modifica
          </button>
          <button @click="deleteCustomer(customer)" class="delete-btn">
            Elimina
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { customerService } from '../../services';

export default {
  name: 'Customers',
  data() {
    return {
      searchTerm: '',
      customers: [],
      loading: false,
      error: null
    }
  },
  async mounted() {
    await this.fetchCustomers();
  },
  computed: {
    filteredCustomers() {
      if (!this.searchTerm) {
        return this.customers;
      }
      return this.customers.filter(customer => 
        customer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (customer.phone && customer.phone.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }
  },
  methods: {
    async fetchCustomers() {
      try {
        this.loading = true;
        this.error = null;
        const response = await customerService.getAll();
        this.customers = response.data || [];
      } catch (error) {
        console.error('Error fetching customers:', error);
        this.error = 'Errore nel caricamento dei clienti';
        this.customers = [];
      } finally {
        this.loading = false;
      }
    },
    async addCustomer() {
      this.$router.push('/customers/create');
    },
    editCustomer(customerId) {
      this.$router.push(`/customers/${customerId}/edit`);
    },
    viewOrders(customerId) {
      this.$router.push(`/customers/${customerId}/orders`);
    },
    async deleteCustomer(customer) {
      const confirmed = confirm(`Sei sicuro di voler eliminare il cliente "${customer.name}"?`);
      if (!confirmed) return;

      try {
        this.loading = true;
        await customerService.delete(customer.id);
        
        // Rimuovi il cliente dalla lista locale
        this.customers = this.customers.filter(c => c.id !== customer.id);
        
        // Mostra messaggio di successo (opzionale)
        alert(`Cliente "${customer.name}" eliminato con successo`);
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Errore nell\'eliminazione del cliente. Riprova.');
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@use './Customers.scss';
</style>
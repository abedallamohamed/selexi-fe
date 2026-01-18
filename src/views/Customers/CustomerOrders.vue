<template>
  <div class="customer-orders-container">
    <div class="header">
      <button @click="goBack" class="back-btn">
        ← Indietro
      </button>
      <div class="header-info">
        <h1>Ordini di {{ customer?.name || 'Cliente' }}</h1>
        <p v-if="customer" class="customer-details">
          {{ customer.email }} {{ customer.phone ? '• ' + customer.phone : '' }}
        </p>
      </div>
    </div>
    
    <div class="orders-content">
      <div v-if="loading" class="loading-message">
        Caricamento ordini...
      </div>
      
      <div v-else-if="error" class="error-message">
        {{ error }}
        <button @click="fetchOrders" class="retry-btn">Riprova</button>
      </div>
      
      <div v-else-if="orders.length === 0" class="empty-message">
        Questo cliente non ha ancora ordini
      </div>
      
      <div v-else class="orders-list">
        <div 
          v-for="order in orders" 
          :key="order.id" 
          class="order-card"
        >
          <div class="order-info">
            <h3>Ordine #{{ order.order_number || order.id }}</h3>
            <p class="date">Data: {{ formatDateShort(order.order_date) }}</p>
            <p class="total">Totale: €{{ formatAmount(order.total_amount) }}</p>
          </div>
          <div class="order-status" :class="order.status">
            {{ getStatusText(order.status) }}
          </div>
          <div class="order-actions">
            <button 
              @click="viewOrder(order.id)" 
              class="view-btn"
            >
              {{ (order.status === 'completed' || order.status === 'cancelled') ? 'Visualizza' : 'Modifica' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { customerService } from '../../services';

export default {
  name: 'CustomerOrders',
  data() {
    return {
      customer: null,
      orders: [],
      loading: false,
      error: null
    }
  },
  computed: {
    customerId() {
      return parseInt(this.$route.params.id);
    }
  },
  async mounted() {
    await this.loadCustomerData();
    await this.fetchOrders();
  },
  methods: {
    async loadCustomerData() {
      try {
        const response = await customerService.getById(this.customerId);
        this.customer = response.data;
      } catch (error) {
        console.error('Error loading customer:', error);
        this.error = 'Errore nel caricamento del cliente';
      }
    },

    async fetchOrders() {
      try {
        this.loading = true;
        this.error = null;
        const response = await customerService.getOrders(this.customerId);
        this.orders = response.data || [];
      } catch (error) {
        console.error('Error fetching orders:', error);
        this.error = 'Errore nel caricamento degli ordini';
        this.orders = [];
      } finally {
        this.loading = false;
      }
    },

    viewOrder(orderId) {
      this.$router.push({
        path: `/orders/${orderId}/edit`,
        query: { from: 'customer', customerId: this.customerId }
      });
    },

    goBack() {
      this.$router.push('/customers');
    },

    getStatusText(status) {
      const statusMap = {
        pending: 'In Attesa',
        processing: 'In Elaborazione',
        completed: 'Completato',
        cancelled: 'Annullato'
      };
      return statusMap[status] || status;
    },

    formatDateShort(dateString) {
      if (!dateString) return '';
      
      // If already in Italian format "DD/MM/YYYY", extract only the date
      if (typeof dateString === 'string' && dateString.includes('/')) {
        return dateString.split(' ')[0]; // Takes only the date part
      }
      
      const date = new Date(dateString);
      return date.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    },

    formatAmount(value) {
      if (value === null || value === undefined) return '0,00';
      // If it's already a formatted string (e.g. "1,081.14"), return it as is
      if (typeof value === 'string') {
        return value;
      }
      // If it's a number, format it
      return value.toFixed(2).replace('.', ',');
    }
  }
}
</script>

<style lang="scss" scoped>
.customer-orders-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 2rem;
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
  margin-top: 0.5rem; // Align with title

  &:hover {
    background-color: #f5f5f5;
    border-color: #999;
    color: #333;
  }
}

.header-info {
  flex: 1;
  
  h1 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }

  .customer-details {
    margin: 0;
    color: #666;
    font-size: 0.95rem;
  }
}

.orders-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.orders-list {
  display: grid;
  gap: 1rem;
  padding: 1rem;
}

.order-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.order-info {
  h3 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }

  p {
    margin: 0.25rem 0;
    color: #666;
  }
}

.total {
  font-size: 1.1rem;
  font-weight: bold;
  color: #42b983;
}

.order-status {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.8rem;

  &.pending {
    background-color: #fff3cd;
    color: #856404;
  }

  &.processing {
    background-color: #d1ecf1;
    color: #0c5460;
  }

  &.completed {
    background-color: #d4edda;
    color: #155724;
  }

  &.cancelled {
    background-color: #f8d7da;
    color: #721c24;
  }
}

.order-actions {
  display: flex;
  gap: 0.5rem;
}

.view-btn {
  background-color: #17a2b8;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background-color: #138496;
  }
}

.loading-message, .error-message, .empty-message {
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.1rem;
}

.error-message {
  color: #e74c3c;
  background-color: #fadbd8;
}

.retry-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 1rem;

  &:hover {
    background-color: #c0392b;
  }
}
</style>
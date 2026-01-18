<template>
  <div class="orders-container">
    <div class="header">
      <h1>Ordini</h1>
      <button @click="addOrder" class="add-btn">Nuovo Ordine</button>
    </div>
    
    <div class="orders-list">
      <div v-if="loading" class="loading-message">
        Caricamento ordini...
      </div>
      
      <div v-else-if="error" class="error-message">
        {{ error }}
        <button @click="fetchOrders" class="retry-btn">Riprova</button>
      </div>
      
      <div v-else-if="orders.length === 0" class="empty-message">
        Nessun ordine trovato
      </div>
      
      <div 
        v-else
        v-for="order in orders" 
        :key="order.id" 
        class="order-card"
      >
        <div class="order-info">
          <h3>Ordine #{{ order.order_number || order.id }}</h3>
          <p class="customer">
            Cliente: 
            <span v-if="!order.customer" class="customer-deleted">Eliminato</span>
            <span v-else>{{ order.customer.name || 'N/A' }}</span>
          </p>
          <p class="date">Data: {{ order.order_date }}</p>
          <p class="total">Totale: €{{ order.total_amount }}</p>
        </div>
        <div class="order-status" :class="order.status">
          {{ getStatusText(order.status) }}
        </div>
        <div class="order-actions">
          <button 
            @click="editOrder(order.id)" 
            class="edit-btn"
            :class="{ 'view-only': order.status === 'completed' || order.status === 'cancelled' }"
          >
            {{ (order.status === 'completed' || order.status === 'cancelled') ? 'Visualizza' : 'Modifica' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { orderService } from '../../services';

export default {
  name: 'Orders',
  data() {
    return {
      orders: [],
      loading: false,
      error: null
    }
  },
  async mounted() {
    await this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      try {
        this.loading = true;
        this.error = null;
        const response = await orderService.getAll();
        this.orders = response.data || [];
      } catch (error) {
        console.error('Error fetching orders:', error);
        this.error = 'Errore nel caricamento degli ordini';
        this.orders = [];
      } finally {
        this.loading = false;
      }
    },
    async addOrder() {
      this.$router.push('/orders/create');
    },
    editOrder(orderId) {
      this.$router.push(`/orders/${orderId}/edit`);
    },
    getStatusText(status) {
      const statusMap = {
        pending: 'In Attesa',
        processing: 'In Elaborazione',
        completed: 'Completato',
        cancelled: 'Annullato'
      };
      return statusMap[status] || status;
    }
  }
}
</script>

<style lang="scss" scoped>
@use './Orders.scss';
</style>
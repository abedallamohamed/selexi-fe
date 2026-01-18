<template>
  <div class="order-form-container">
    <div class="header">
      <button @click="goBackHeader" class="back-btn">
        ← Indietro
      </button>
      <h1>{{ pageTitle }}</h1>
    </div>
    
    <!-- Form per creazione nuovo ordine o modifica ordine editabile -->
    <form v-if="showForm" @submit.prevent="handleSubmit" class="order-form">
      <div class="form-group">
        <label for="order_number">Numero Ordine *</label>
        <input 
          type="text" 
          id="order_number" 
          v-model="form.order_number" 
          required
          :disabled="isLoading"
          placeholder="Es: ORD-2026-001"
        />
      </div>

      <div class="form-group">
        <label for="customer">Cliente *</label>
        <select 
          id="customer" 
          v-model="form.customer_id" 
          required
          :disabled="isLoading"
        >
          <option value="" disabled>Seleziona un cliente</option>
          <option 
            v-for="customer in customers" 
            :key="customer.id" 
            :value="customer.id"
          >
            {{ customer.name }} ({{ customer.email }})
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="order_date">Data Ordine *</label>
        <input 
          type="date" 
          id="order_date" 
          v-model="form.order_date" 
          required
          :disabled="isLoading"
        />
      </div>

      <div class="form-group">
        <label for="total_amount">Importo Totale (€) *</label>
        <input 
          type="text" 
          id="total_amount" 
          v-model="form.total_amount" 
          required
          :disabled="isLoading"
          placeholder="Es: 1500.50 (usa il punto per i decimali)"
        />
        <small class="input-hint">Usa il punto (.) come separatore decimale</small>
      </div>

      <div class="form-group">
        <label for="status">Stato *</label>
        <select 
          id="status" 
          v-model="form.status" 
          required
          :disabled="isLoading"
        >
          <option 
            v-for="statusOption in availableStatuses" 
            :key="statusOption.value"
            :value="statusOption.value"
          >
            {{ statusOption.label }}
          </option>
        </select>
        <small v-if="isViewing && availableStatuses.length === 1" class="status-info">
          Stato non modificabile
        </small>
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
          v-if="isViewing && order && order.customer"
          type="button" 
          @click="goToCustomerOrders" 
          class="customer-orders-btn"
          :disabled="isLoading"
        >
          Ordini di {{ order.customer.name }}
        </button>
        <button 
          type="submit" 
          class="save-btn"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Salvataggio...' : (isViewing ? 'Aggiorna' : 'Crea') }}
        </button>
      </div>
    </form>

    <!-- Tabella per visualizzazione ordine esistente -->
    <div v-else class="order-view">
      <div v-if="isLoading" class="loading-message">
        Caricamento ordine...
      </div>
      
      <div v-else-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div v-else-if="order" class="order-table-container">
        <table class="order-table">
          <tbody>
            <tr>
              <th>Numero Ordine</th>
              <td>{{ order.order_number || order.id }}</td>
            </tr>
            <tr>
              <th>Cliente</th>
              <td>{{ order.customer?.name || 'N/A' }}</td>
            </tr>
            <tr>
              <th>Email Cliente</th>
              <td>{{ order.customer?.email || 'N/A' }}</td>
            </tr>
            <tr>
              <th>Data Ordine</th>
              <td>{{ formatDateShort(order.order_date) }}</td>
            </tr>
            <tr>
              <th>Importo Totale</th>
              <td class="total-amount">€{{ formatAmount(order.total_amount) }}</td>
            </tr>
            <tr>
              <th>Stato</th>
              <td>
                <span class="status-badge" :class="order.status">
                  {{ getStatusText(order.status) }}
                </span>
              </td>
            </tr>
            <tr v-if="order.created_at">
              <th>Creato il</th>
              <td>{{ formatDate(order.created_at) }}</td>
            </tr>
            <tr v-if="order.updated_at">
              <th>Ultimo aggiornamento</th>
              <td>{{ formatDate(order.updated_at) }}</td>
            </tr>
          </tbody>
        </table>

        <div class="form-actions">
          <button 
            type="button" 
            @click="goBack" 
            class="cancel-btn"
          >
            Torna agli Ordini
          </button>
          <button 
            v-if="order && order.customer"
            type="button" 
            @click="goToCustomerOrders" 
            class="customer-orders-btn"
          >
            Ordini di {{ order.customer.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { orderService, customerService } from '../../services';

export default {
  name: 'OrderForm',
  data() {
    return {
      form: {
        order_number: '',
        customer_id: '',
        order_date: '',
        total_amount: 0,
        status: 'pending'
      },
      order: null,
      customers: [],
      isLoading: false,
      errorMessage: ''
    }
  },
  computed: {
    isViewing() {
      return !!this.$route.params.id;
    },
    orderId() {
      return this.$route.params.id ? parseInt(this.$route.params.id) : null;
    },
    isEditable() {
      if (!this.order) return true; // Per nuovi ordini
      return this.order.status !== 'completed' && this.order.status !== 'cancelled';
    },
    showForm() {
      return !this.isViewing || this.isEditable;
    },
    pageTitle() {
      if (!this.isViewing) return 'Nuovo Ordine';
      return this.isEditable ? 'Modifica Ordine' : 'Dettagli Ordine';
    },
    availableStatuses() {
      const allStatuses = [
        { value: 'pending', label: 'In Attesa' },
        { value: 'processing', label: 'In Elaborazione' },
        { value: 'completed', label: 'Completato' },
        { value: 'cancelled', label: 'Annullato' }
      ];

      // Per nuovi ordini, tutti gli stati sono disponibili
      if (!this.isViewing) {
        return allStatuses;
      }

      // Per ordini esistenti, applica le transizioni valide
      const validTransitions = {
        pending: ['processing', 'cancelled'],
        processing: ['completed', 'cancelled'],
        completed: [], // Nessuna transizione consentita
        cancelled: []  // Nessuna transizione consentita
      };

      const currentStatus = this.order?.status || 'pending';
      const allowedNextStatuses = validTransitions[currentStatus] || [];
      
      // Include sempre lo stato corrente + gli stati di transizione validi
      const availableStatusValues = [currentStatus, ...allowedNextStatuses];
      
      return allStatuses.filter(status => 
        availableStatusValues.includes(status.value)
      );
    }
  },
  async mounted() {
    if (this.isViewing) {
      // Prima carica i clienti se editabile, poi l'ordine
      if (this.isEditable) {
        await this.loadCustomers();
      }
      await this.loadOrder();
    } else {
      await this.loadCustomers();
      this.form.order_date = new Date().toISOString().split('T')[0];
    }
  },
  methods: {
    async loadCustomers() {
      try {
        const response = await customerService.getAll();
        this.customers = response.data || [];
      } catch (error) {
        console.error('Error loading customers:', error);
        this.errorMessage = 'Errore nel caricamento dei clienti';
      }
    },

    async loadOrder() {
      try {
        this.isLoading = true;
        const response = await orderService.getById(this.orderId);
        this.order = response.data;
        
        // Se l'ordine è editabile, prepopola il form
        if (this.isEditable) {
          // Format date to YYYY-MM-DD for input[type="date"]
          let orderDate = this.order.order_date || '';
          if (orderDate && orderDate.includes('/')) {
            // Converte da "18/01/2026" a "2026-01-18"
            const parts = orderDate.split('/');
            if (parts.length >= 3) {
              orderDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            }
          } else if (orderDate && orderDate.includes('T')) {
            orderDate = orderDate.split('T')[0];
          }
          
          this.form = {
            order_number: this.order.order_number || '',
            customer_id: parseInt(this.order.customer?.id) || '',
            order_date: orderDate,
            total_amount: typeof this.order.total_amount === 'string' ? 
              parseFloat(this.order.total_amount.replace(',', '.')) : 
              (this.order.total_amount || 0),
            status: this.order.status || 'pending'
          };
          
          console.log('Form customer_id:', this.form.customer_id);
          console.log('Available customers:', this.customers.map(c => ({id: c.id, name: c.name})));
        }
      } catch (error) {
        console.error('Error loading order:', error);
        this.errorMessage = 'Errore nel caricamento dell\'ordine';
      } finally {
        this.isLoading = false;
      }
    },

    async handleSubmit() {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        const orderData = {
          order_number: this.form.order_number,
          customer_id: this.form.customer_id,
          order_date: this.form.order_date,
          total_amount: this.form.total_amount,
          status: this.form.status
        };

        if (this.isViewing) {
          // Modalità update
          await orderService.update(this.orderId, orderData);
        } else {
          // Modalità create
          await orderService.create(orderData);
        }
        
        // Navigazione dopo submit
        if (this.$route.query.from === 'customer' && this.$route.query.customerId) {
          // Se arriviamo da CustomerOrders, torna lì
          this.$router.push(`/customers/${this.$route.query.customerId}/orders`);
        } else if (this.isViewing && this.order && this.order.customer) {
          // Se stiamo aggiornando e abbiamo un cliente, vai ai suoi ordini
          this.$router.push(`/customers/${this.order.customer.id}/orders`);
        } else {
          // Altrimenti alla lista generale
          this.$router.push('/orders');
        }
      } catch (error) {
        console.error('Error saving order:', error);
        this.errorMessage = this.isViewing ? 
          'Errore nell\'aggiornamento dell\'ordine' : 
          'Errore nella creazione dell\'ordine';
      } finally {
        this.isLoading = false;
      }
    },

    goBack() {
      // Sempre alla lista generale degli ordini
      this.$router.push('/orders');
    },

    goBackHeader() {
      // Pulsante header - torna al contesto da cui sei arrivato
      if (this.$route.query.from === 'customer' && this.$route.query.customerId) {
        this.$router.push(`/customers/${this.$route.query.customerId}/orders`);
      } else {
        this.$router.push('/orders');
      }
    },

    goToCustomerOrders() {
      if (this.order && this.order.customer) {
        this.$router.push(`/customers/${this.order.customer.id}/orders`);
      }
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

    formatDate(dateString) {
      if (!dateString) return '';
      
      // Se è già nel formato italiano "DD/MM/YYYY HH:MM", restituiscilo così com'è
      if (typeof dateString === 'string' && dateString.includes('/')) {
        return dateString;
      }
      
      const date = new Date(dateString);
      return date.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    formatDateShort(dateString) {
      if (!dateString) return '';
      
      // Se è già nel formato italiano "DD/MM/YYYY", estrarre solo la data
      if (typeof dateString === 'string' && dateString.includes('/')) {
        return dateString.split(' ')[0]; // Prende solo la parte della data
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
      // Se è già una stringa formattata (es. "1,081.14"), la restituisco così com'è
      if (typeof value === 'string') {
        return value;
      }
      // Se è un numero, lo formatto
      return value.toFixed(2).replace('.', ',');
    }
  }
}
</script>

<style lang="scss" scoped>
.order-form-container {
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

.order-form,
.order-view {
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

input, select, textarea {
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

select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

// Tabella per visualizzazione ordine
.order-table-container {
  background: white;
}

.order-table {
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e9ecef;
  }

  th {
    width: 40%;
    color: #666;
    font-weight: 600;
    background-color: #f8f9fa;
  }

  td {
    color: #333;
  }

  .total-amount {
    font-weight: bold;
    color: #42b983;
    font-size: 1.1rem;
  }
}

.status-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.75rem;

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

small.status-info,
small.input-hint {
  display: block;
  margin-top: 0.25rem;
  color: #666;
  font-style: italic;
  font-size: 0.85rem;
}

.loading-message {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error-message {
  background-color: #fee;
  color: #c00;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.cancel-btn, .save-btn, .customer-orders-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

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

.customer-orders-btn {
  background-color: #6f42c1;
  color: white;

  &:hover:not(:disabled) {
    background-color: #5a2d91;
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

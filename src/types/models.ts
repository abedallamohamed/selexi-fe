// Customer interface
export interface Customer {
  id: number;
  name: string;
  email: string;
  address?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

// Order interface
export interface Order {
  id: number;
  order_number: string;
  customer_id: number;
  customer?: Customer;
  order_date: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

// API Response wrappers
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Request DTOs
export interface CreateCustomerRequest {
  name: string;
  email: string;
  address?: string;
  phone?: string;
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {}

export interface CreateOrderRequest {
  customer_id: number;
  order_date: string;
  total_amount: number;
  status?: 'pending' | 'processing' | 'completed' | 'cancelled';
}

export interface UpdateOrderRequest extends Partial<CreateOrderRequest> {}
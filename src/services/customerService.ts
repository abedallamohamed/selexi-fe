import { httpService } from './httpService';
import type { 
  Customer, 
  Order, 
  ApiResponse, 
  PaginatedResponse, 
  CreateCustomerRequest, 
  UpdateCustomerRequest 
} from '../types/models';

class CustomerService {
  private readonly basePath = '/api/customers';

  /**
   * Get all customers
   */
  async getAll(): Promise<PaginatedResponse<Customer>> {
    return httpService.get<PaginatedResponse<Customer>>(this.basePath);
  }

  /**
   * Get customer by ID
   */
  async getById(id: number): Promise<ApiResponse<Customer>> {
    return httpService.get<ApiResponse<Customer>>(`${this.basePath}/${id}`);
  }

  /**
   * Create new customer
   */
  async create(customerData: CreateCustomerRequest): Promise<ApiResponse<Customer>> {
    return httpService.post<ApiResponse<Customer>>(this.basePath, customerData);
  }

  /**
   * Update existing customer
   */
  async update(id: number, customerData: UpdateCustomerRequest): Promise<ApiResponse<Customer>> {
    return httpService.put<ApiResponse<Customer>>(`${this.basePath}/${id}`, customerData);
  }

  /**
   * Delete customer
   */
  async delete(id: number): Promise<ApiResponse<null>> {
    return httpService.delete<ApiResponse<null>>(`${this.basePath}/${id}`);
  }

  /**
   * Get orders for specific customer
   */
  async getOrders(customerId: number): Promise<PaginatedResponse<Order>> {
    return httpService.get<PaginatedResponse<Order>>(`${this.basePath}/${customerId}/orders`);
  }
}

export const customerService = new CustomerService();
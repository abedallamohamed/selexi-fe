import { httpService } from './httpService';
import type { 
  Order, 
  ApiResponse, 
  PaginatedResponse, 
  CreateOrderRequest, 
  UpdateOrderRequest 
} from '../types/models';

class OrderService {
  private readonly basePath = '/api/orders';

  /**
   * Get all orders
   */
  async getAll(): Promise<PaginatedResponse<Order>> {
    return httpService.get<PaginatedResponse<Order>>(this.basePath);
  }

  /**
   * Get order by ID
   */
  async getById(id: number): Promise<ApiResponse<Order>> {
    return httpService.get<ApiResponse<Order>>(`${this.basePath}/${id}`);
  }

  /**
   * Create new order
   */
  async create(orderData: CreateOrderRequest): Promise<ApiResponse<Order>> {
    return httpService.post<ApiResponse<Order>>(this.basePath, orderData);
  }

  /**
   * Update existing order
   */
  async update(id: number, orderData: UpdateOrderRequest): Promise<ApiResponse<Order>> {
    return httpService.put<ApiResponse<Order>>(`${this.basePath}/${id}`, orderData);
  }

  /**
   * Delete order
   */
  async delete(id: number): Promise<ApiResponse<null>> {
    return httpService.delete<ApiResponse<null>>(`${this.basePath}/${id}`);
  }

  /**
   * Update order status
   */
  async updateStatus(id: number, status: Order['status']): Promise<ApiResponse<Order>> {
    return httpService.put<ApiResponse<Order>>(`${this.basePath}/${id}`, { status });
  }
}

export const orderService = new OrderService();
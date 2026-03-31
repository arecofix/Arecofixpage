import { Observable } from 'rxjs';

export interface DashboardStats {
  users: number;
  products: number;
  sales: number;
  revenue: number;
  repairs_month: number;
  repairs_revenue: number;
  repairs_profit: number;
  devices_fixed: number;
  pending_approvals?: number;
  sales_chart: { period: string; total: number }[];
  products_chart: { name: string; quantity: number }[];
  category_chart: { name: string; count: number }[];
  profit_chart: { period: string; total: number }[];
}

export abstract class AnalyticsRepository {
  abstract getDashboardStats(): Observable<DashboardStats>;
}

import { Observable } from 'rxjs';

export interface MonthlyRevenue {
  period: string;        // 'YYYY-MM'
  label: string;         // 'Ene 2025'
  gross_revenue: number; // Ingresos brutos (ventas + reparaciones cobradas)
  cost: number;          // Costo de repuestos/productos
  net_profit: number;    // Ganancia real = gross_revenue - cost
  repairs_revenue: number;
  sales_revenue: number;
  repairs_cost: number;
  sales_cost: number;
}

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
  // Totales reales
  total_gross_revenue: number;  // Ingresos brutos totales del negocio
  total_cost: number;           // Costos totales (repuestos + productos)
  total_net_profit: number;     // Ganancia real total
  // Mes actual
  current_month_gross: number;
  current_month_cost: number;
  current_month_profit: number;
  // Desglose mensual
  monthly_breakdown: MonthlyRevenue[];
  // Gráficos legacy
  sales_chart: { period: string; total: number }[];
  products_chart: { name: string; quantity: number }[];
  category_chart: { name: string; count: number }[];
  profit_chart: { period: string; total: number }[];
}

export abstract class AnalyticsRepository {
  abstract getDashboardStats(branchId?: string): Observable<DashboardStats>;
}

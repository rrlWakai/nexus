export interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'staff';
  avatar_url: string | null;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  segment: string;
  lifetime_value: number;
  engagement_score: number;
  last_active: string;
  status: string;
  initials: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  category: string | null;
  stock: number;
  status: string;
  demand_prediction: number;
  demand_label: string;
  next_shipment: string | null;
  image_url: string | null;
  ai_recommended: boolean;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  order_id: string;
  customer_id: string;
  customer?: Customer;
  items?: OrderItem[];
  total_amount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  priority: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  avatar?: string;
  initials: string;
  totalOrders: number;
  productivity: number;
  productivityTrend: 'up' | 'down';
  accuracy: number;
  efficiency: number;
  status: 'Active Now' | 'In Meeting' | 'Offline';
  rating: number;
  badge: string;
  performanceData: number[];
}

export interface AnalyticsData {
  revenue: { month: string; value: number }[];
  revenueGrowth: number;
  orders: { month: string; value: number }[];
  ordersGrowth: number;
  customerSegments: { name: string; value: number; color: string }[];
  productPerformance: { name: string; revenue: number; growth: number }[];
  salesForecast: number[];
  confidence: number;
  propensityScore: number;
}

export interface DashboardStats {
  totalRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  ordersGrowth: number;
  activeCustomers: number;
  customerGrowth: number;
  avgLifetimeValue: number;
  avgEngagementScore: number;
  inventoryValue: number;
  inventoryChange: number;
  efficiencyScore: number;
  ordersFulfilled: number;
  fulfillmentGrowth: number;
  processingOrders: number;
  avgPriority: number;
  productCount: number;
}

export interface MLInsight {
  id: string;
  type: 'inventory' | 'churn' | 'demand' | 'anomaly' | 'staffing' | 'optimization';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
  actionLabel?: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

export interface ClassificationResult {
  customerId: string;
  customerName: string;
  classification: 'Frequent Buyer' | 'Occasional Buyer' | 'New Customer';
  numberOfOrders: number;
  totalSpent: number;
}

export interface ClusterResult {
  id: string;
  name: string;
  orders: number;
  spent: number;
  cluster: number;
  label: string;
}

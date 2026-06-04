import type { DashboardStats, Order, Customer, Product, Staff, AnalyticsData, MLInsight } from '@/types'

export const dashboardStats: DashboardStats = {
  totalRevenue: 2482900,
  revenueGrowth: 12.5,
  totalOrders: 1284,
  ordersGrowth: 12,
  activeCustomers: 12482,
  customerGrowth: 12,
  avgLifetimeValue: 3420,
  avgEngagementScore: 88,
  inventoryValue: 1120450,
  inventoryChange: -2.1,
  efficiencyScore: 94.8,
  ordersFulfilled: 18542,
  fulfillmentGrowth: 5.4,
  processingOrders: 48,
  avgPriority: 8.2,
  productCount: 12,
}

export const orders: Order[] = [
  {
    id: '1', order_id: 'ORD-2849',
    customer_id: 'c1',
    customer: { id: 'c1', name: 'Jonathan Dorsey', email: 'dorsey.j@enterprise.com', company: 'Enterprise Co', segment: 'Enterprise', lifetime_value: 42900, engagement_score: 94, last_active: new Date().toISOString(), status: 'High Value', initials: 'JD', created_at: new Date().toISOString(), phone: null },
    items: [], total_amount: 2450, status: 'Processing', priority: 9.4, notes: null, created_at: '2024-01-15T00:00:00Z', updated_at: new Date().toISOString(),
  },
  {
    id: '2', order_id: 'ORD-2848',
    customer_id: 'c2',
    customer: { id: 'c2', name: 'Miriam Sterling', email: 'm.sterling@globex.io', company: 'Globex Inc', segment: 'Enterprise', lifetime_value: 22300, engagement_score: 65, last_active: new Date().toISOString(), status: 'Returning', initials: 'MS', created_at: new Date().toISOString(), phone: null },
    items: [], total_amount: 890, status: 'Shipped', priority: 6.5, notes: null, created_at: '2024-01-14T00:00:00Z', updated_at: new Date().toISOString(),
  },
  {
    id: '3', order_id: 'ORD-2847',
    customer_id: 'c3',
    customer: { id: 'c3', name: 'Alan Vance', email: 'alan.v@vance-media.com', company: 'Vance Media', segment: 'SME', lifetime_value: 12400, engagement_score: 21, last_active: new Date().toISOString(), status: 'Returning', initials: 'AV', created_at: new Date().toISOString(), phone: null },
    items: [], total_amount: 12400, status: 'Delivered', priority: 2.1, notes: null, created_at: '2024-01-13T00:00:00Z', updated_at: new Date().toISOString(),
  },
]

export const customers: Customer[] = [
  { id: 'c1', name: 'Sophia Chen', email: 'sophia.chen@globallogistics.com', company: 'Global Logistics Inc.', segment: 'Enterprise', lifetime_value: 42900, engagement_score: 94, last_active: new Date().toISOString(), status: 'High Value', initials: 'SC', created_at: new Date().toISOString(), phone: null },
  { id: 'c2', name: 'Marcus Thorne', email: 'marcus@nexusdynamics.com', company: 'Nexus Dynamics', segment: 'Mid-Market', lifetime_value: 12150, engagement_score: 68, last_active: new Date().toISOString(), status: 'Returning', initials: 'MT', created_at: new Date().toISOString(), phone: null },
  { id: 'c3', name: 'Elena Rossi', email: 'elena@starlightretail.com', company: 'Starlight Retail', segment: 'New Startup', lifetime_value: 1840, engagement_score: 82, last_active: new Date().toISOString(), status: 'New', initials: 'ER', created_at: new Date().toISOString(), phone: null },
  { id: 'c4', name: 'Julianna Duarte', email: 'julianna.d@techcore.io', company: 'TechCore', segment: 'Enterprise', lifetime_value: 108240, engagement_score: 98, last_active: new Date().toISOString(), status: 'High Value', initials: 'JD', created_at: new Date().toISOString(), phone: null },
  { id: 'c5', name: 'Michael Kross', email: 'm.kross@velvet.net', company: 'Velvet Corp', segment: 'Mid-Market', lifetime_value: 22100, engagement_score: 74, last_active: new Date().toISOString(), status: 'Returning', initials: 'MK', created_at: new Date().toISOString(), phone: null },
  { id: 'c6', name: 'Lydia Weaver', email: 'lydia@weaver.design', company: 'Weaver Design', segment: 'New Startup', lifetime_value: 4200, engagement_score: 45, last_active: new Date().toISOString(), status: 'At Risk', initials: 'LW', created_at: new Date().toISOString(), phone: null },
]

export const products: Product[] = [
  { id: 'p1', name: 'Studio Pro X1', sku: 'STU-X1-BLK', price: 349, category: 'Electronics', stock: 1248, status: 'In Stock', demand_prediction: 94, demand_label: 'High', next_shipment: '2024-10-12', image_url: null, ai_recommended: true, created_at: new Date().toISOString() },
  { id: 'p2', name: 'Classic Minimalist', sku: 'CLS-MIN-004', price: 189, category: 'Fashion', stock: 14, status: 'Low Stock', demand_prediction: 42, demand_label: 'Stable', next_shipment: '2024-10-28', image_url: null, ai_recommended: false, created_at: new Date().toISOString() },
  { id: 'p3', name: 'Archi-Frames', sku: 'ARC-FRM-D9', price: 120, category: 'Fashion', stock: 432, status: 'In Stock', demand_prediction: 68, demand_label: 'Rising', next_shipment: '2024-10-15', image_url: null, ai_recommended: false, created_at: new Date().toISOString() },
]

export const staffMembers: Staff[] = [
  { id: 's1', name: 'Sarah Jenkins', role: 'Warehouse Manager', department: 'Warehouse', email: 'sarah.j@nexusoms.com', initials: 'SJ', totalOrders: 12842, productivity: 8.5, productivityTrend: 'up', accuracy: 98.2, efficiency: 92, status: 'Active Now', rating: 5, badge: 'Elite Performer', performanceData: [50, 75, 65, 80, 50, 100] },
  { id: 's2', name: 'David Wilson', role: 'Sales Lead', department: 'Sales', email: 'david.w@nexusoms.com', initials: 'DW', totalOrders: 8420, productivity: -1.2, productivityTrend: 'down', accuracy: 94.5, efficiency: 76, status: 'In Meeting', rating: 4, badge: 'Senior Associate', performanceData: [75, 65, 50, 35, 40, 25] },
  { id: 's3', name: 'Elena Rodriguez', role: 'Logistics Coordinator', department: 'Logistics', email: 'elena.r@nexusoms.com', initials: 'ER', totalOrders: 4119, productivity: 12.4, productivityTrend: 'up', accuracy: 99.1, efficiency: 88, status: 'Offline', rating: 5, badge: 'Consistent High', performanceData: [25, 35, 50, 75, 80, 100] },
]

export const analyticsData: AnalyticsData = {
  revenue: [
    { month: 'Jan', value: 150000 },
    { month: 'Feb', value: 140000 },
    { month: 'Mar', value: 100000 },
    { month: 'Apr', value: 80000 },
    { month: 'May', value: 140000 },
    { month: 'Jun', value: 180000 },
  ],
  revenueGrowth: 14.2,
  orders: [
    { month: 'Jan', value: 30 },
    { month: 'Feb', value: 45 },
    { month: 'Mar', value: 60 },
    { month: 'Apr', value: 85 },
    { month: 'May', value: 100 },
    { month: 'Jun', value: 50 },
  ],
  ordersGrowth: 8.3,
  customerSegments: [
    { name: 'Enterprise', value: 35, color: '#0066cc' },
    { name: 'SME', value: 25, color: '#34C759' },
    { name: 'Startup', value: 20, color: '#FF9F0C' },
    { name: 'Individual', value: 12, color: '#883700' },
    { name: 'Other', value: 8, color: '#aac7ff' },
  ],
  productPerformance: [
    { name: 'Nexus Pro Workstation', revenue: 124800, growth: 18 },
    { name: 'Quantum ANC Headphones', revenue: 89200, growth: 12 },
    { name: 'Cloud Node Mini', revenue: 65300, growth: -3 },
    { name: 'Titanium X20', revenue: 45100, growth: 24 },
  ],
  salesForecast: [150000, 140000, 100000, 80000, 140000, 180000],
  confidence: 92,
  propensityScore: 84.2,
}

export const mlInsights: MLInsight[] = [
  { id: 'm1', type: 'inventory', title: 'Inventory Bottleneck Detected', description: 'AI has flagged 12 pending orders with high priority scores that are likely to be delayed due to low stock in Western Distribution Hub. We recommend prioritizing local supplier fulfillment for these items.', severity: 'warning', timestamp: '2m ago', actionLabel: 'Review Impact' },
  { id: 'm2', type: 'demand', title: 'Sales Forecasting Update', description: '12-Month projected growth shows 14% surge in consumer electronics for late November.', severity: 'info', timestamp: '5m ago', actionLabel: 'View Forecast' },
  { id: 'm3', type: 'staffing', title: 'Predictive Staffing Intelligence', description: 'Based on historical order volume trends, Nexus AI suggests a 15% increase in staffing for the Northwest Warehouse sector between 14:00 and 17:00 today.', severity: 'info', timestamp: '10m ago', actionLabel: 'Review Staffing' },
]

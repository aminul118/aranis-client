export interface IStats {
  user: {
    totalCount: number;
    activeCount: number;
    inactiveCount: number;
    blockedCount: number;
    deletedCount: number;
    login24hCount?: number;
    suspiciousLoginCount?: number;
  };
  productCount: number;
  orderCount: number;
  totalSales: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  totalStockValue: number;
  totalSaleValue: number;
  lowStockCount: number;
  restockRequestCount: number;
  orderStatusDistribution: {
    Pending: number;
    Processing: number;
    Shipped: number;
    Delivered: number;
    Cancelled: number;
  };
  timeBasedOrders: {
    today: number;
    last7Days: number;
    last15Days: number;
    last30Days: number;
  };
  revenueTrend: {
    date: string;
    revenue: number;
    orders: number;
  }[];
  projectCount: number;
  blogCount: number;
  invoice: {
    totalCount: number;
    totalEarnings: number;
    totalDue: number;
    statusDistribution: {
      PAID: number;
      UNPAID: number;
      PENDING: number;
    };
  };
}

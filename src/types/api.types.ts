export interface ILogin {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}
export interface ApiResponse<T> {
  message: string;
  statusCode: number;
  success: boolean;
  data: T;
  meta?: IMeta;
}

export interface IUserAddress {
  title: string;
  address: string;
}

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string;
  phone?: string;
  addresses: IUserAddress[];
  role: string;
  userId?: number;
  picture?: string;
  isDeleted: boolean;
  isActive: string;
  isVerified: boolean;
  hasPassword: boolean;
  auths: Auth[];
  createdAt: string;
  updatedAt: string;
}

export interface Auth {
  provider: string;
  providerId: string;
}

export interface IBlog {
  _id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  slug: string;
  content: string;
  thumbnail: string;
  photos?: string[];
}

export interface IProject {
  _id: string;
  title: string;
  slug: string;
  liveLink: string;
  github?: string;
  content: string;
  technology: string[];
  thumbnail: string;
  photos?: string[];
  createdAt: Date;
  updatedAt: Date;
  isFeatured: boolean;
}

export interface IExperience {
  _id: string;
  position: string;
  companyName: string;
  timeline: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IContact {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface IInvoiceItem {
  itemName: string;
  quantity: string;
  price: number;
  total: number;
}

interface IPayableTo {
  name: string;
  address?: string;
  phone?: string;
}

export interface IInvoice {
  _id: string;
  paymentInfo: boolean;
  invoiceNo?: string;
  invoiceDate?: string;
  payableTo: IPayableTo;
  items: IInvoiceItem[];
  subTotal: number;
  discount?: number;
  tax: number;
  status: 'PAID' | 'UNPAID' | 'PENDING';
  grandTotal: number;
  pdfUrl?: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IStats {
  user: {
    totalCount: number;
    activeCount: number;
    inactiveCount: number;
    blockedCount: number;
    deletedCount: number;
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

export interface ICoupon {
  _id: string;
  name: string;
  code: string;
  discount: number;
  expiryDate: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

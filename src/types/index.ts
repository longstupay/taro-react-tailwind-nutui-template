export enum UserRole {
  VENDOR = 'VENDOR',
  CONSUMER = 'CONSUMER',
  GUEST = 'GUEST'
}

export enum ActivityType {
  GROUP_BUY = 'GROUP_BUY',
  COUPON = 'COUPON'
}

export enum OrderStatus {
  PENDING = 'PENDING', // Bought/Claimed but not used
  REDEEMED = 'REDEEMED', // Used at the shop
  EXPIRED = 'EXPIRED'
}

export interface Activity {
  id: string;
  shopId: string;
  type: ActivityType;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  stock: number; // Remaining count
  targetCount?: number; // For group buy
  currentCount?: number; // For group buy
  expiryDate: string;
  imageUrl?: string;
  views?: number; // For analytics
  sales?: number; // For analytics
}

export interface Order {
  id: string;
  activityId: string;
  activityTitle: string;
  userId: string;
  shopId: string;
  status: OrderStatus;
  code: string; // The verification code (e.g., 6 digits)
  createdAt: string;
  redeemedAt?: string;
  price: number;
}

export interface ShopStats {
  todayVisitors: number;
  totalSales: number;
  pendingRedemptions: number;
  activityCount: number;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: number;
  read: boolean;
}

export interface AnalyticsData {
  conversionRate: { name: string; value: number }[];
  demographics: { name: string; value: number; color: string }[];
  salesTrend: { name: string; value: number }[];
  kpi: {
    aov: number; // Average Order Value
    cltv: number; // Customer Lifetime Value
    repeatRate: number; // Repeat purchase rate
  }
}

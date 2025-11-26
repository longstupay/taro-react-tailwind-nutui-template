import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Taro from '@tarojs/taro';
import { Activity, ActivityType, Order, OrderStatus, User, UserRole, ShopStats, Notification, AnalyticsData } from '../types/index';

interface StoreContextType {
  user: User | null;
  activities: Activity[];
  orders: Order[];
  stats: ShopStats;
  notifications: Notification[];
  login: (role: UserRole) => void;
  logout: () => void;
  addActivity: (activity: Omit<Activity, 'id' | 'shopId'>) => void;
  createOrder: (activityId: string) => void;
  redeemOrder: (code: string) => { success: boolean; message: string };
  getMyOrders: () => Order[];
  removeNotification: (id: string) => void;
  getAnalytics: (range: string, type: string) => AnalyticsData;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Mock Data
const MOCK_SHOP_ID = "shop_001";
const MOCK_USER_ID = "user_007";

const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act_1',
    shopId: MOCK_SHOP_ID,
    type: ActivityType.GROUP_BUY,
    title: '招牌柠檬茶 3人拼团',
    description: '夏日解暑神器，3人成团立享5折优惠！手打柠檬，清爽一夏。',
    price: 9.9,
    originalPrice: 18.0,
    stock: 50,
    targetCount: 3,
    currentCount: 1,
    expiryDate: '2023-12-31',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    views: 342,
    sales: 45
  },
  {
    id: 'act_2',
    shopId: MOCK_SHOP_ID,
    type: ActivityType.COUPON,
    title: '全场满30减5元',
    description: '店铺通用优惠券，不仅好喝，还很划算。领取后3天内有效。',
    price: 0,
    originalPrice: 5.0,
    stock: 100,
    expiryDate: '2023-12-31',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    views: 156,
    sales: 89
  }
];

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<ShopStats>({
    todayVisitors: 128,
    totalSales: 3450,
    pendingRedemptions: 0,
    activityCount: 2
  });

  // Calculate mock stats based on orders
  useEffect(() => {
    const pending = orders.filter(o => o.status === OrderStatus.PENDING).length;
    setStats(prev => ({
      ...prev,
      pendingRedemptions: pending,
      activityCount: activities.length
    }));
  }, [orders, activities]);

  // Simulate expiring notifications on load/login
  useEffect(() => {
    if (user?.role === UserRole.CONSUMER) {
        // Mock a delayed notification about expiring coupon
        const timer = setTimeout(() => {
            pushNotification(MOCK_USER_ID, '优惠券即将过期', '您的“满30减5元”优惠券还有3小时过期，请尽快使用！', 'warning');
        }, 5000);
        return () => clearTimeout(timer);
    }
     if (user?.role === UserRole.VENDOR) {
        // Mock a delayed notification about expiring promotion
        const timer = setTimeout(() => {
            pushNotification(MOCK_SHOP_ID, '活动即将结束', '您的“周末大促”活动将在2小时后结束，请留意数据。', 'info');
        }, 8000);
        return () => clearTimeout(timer);
    }
  }, [user]);

  const pushNotification = (userId: string, title: string, message: string, type: 'success' | 'info' | 'warning' | 'error') => {
      // Only show if the target user is currently logged in (simplified)
      if (user?.id === userId) {
          const newNotif: Notification = {
              id: `notif_${Date.now()}_${Math.random()}`,
              userId,
              title,
              message,
              type,
              timestamp: Date.now(),
              read: false
          };
          setNotifications(prev => [newNotif, ...prev]);
          
          Taro.showToast({
            title: title,
            icon: type === 'success' ? 'success' : 'none',
            duration: 2000
          });

          // Auto dismiss
          setTimeout(() => {
              removeNotification(newNotif.id);
          }, 5000);
      }
  };

  const removeNotification = (id: string) => {
      setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const login = (role: UserRole) => {
    setUser({
      id: role === UserRole.VENDOR ? MOCK_SHOP_ID : MOCK_USER_ID,
      name: role === UserRole.VENDOR ? '陈记手打柠檬茶' : '微信用户_8821',
      avatar: 'https://picsum.photos/100/100',
      role: role
    });

    if (role === UserRole.VENDOR) {
      Taro.navigateTo({ url: '/pages/vendor/dashboard/index' });
    } else {
      Taro.navigateTo({ url: '/pages/consumer/shop/index' });
    }
  };

  const logout = () => {
      setUser(null);
      setNotifications([]);
      Taro.reLaunch({ url: '/pages/index/index' });
  };

  const addActivity = (activityData: Omit<Activity, 'id' | 'shopId'>) => {
    const newActivity: Activity = {
      ...activityData,
      id: `act_${Date.now()}`,
      shopId: MOCK_SHOP_ID,
      views: 0,
      sales: 0
    };
    setActivities(prev => [newActivity, ...prev]);
    pushNotification(MOCK_SHOP_ID, '发布成功', `活动 "${newActivity.title}" 已成功上线`, 'success');
  };

  const createOrder = (activityId: string) => {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return;

    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      activityId,
      activityTitle: activity.title,
      userId: MOCK_USER_ID,
      shopId: activity.shopId,
      status: OrderStatus.PENDING,
      code,
      createdAt: new Date().toISOString(),
      price: activity.price
    };
    setOrders(prev => [newOrder, ...prev]);
    
    // Update stats
    if (activity.price > 0) {
      setStats(prev => ({ ...prev, totalSales: prev.totalSales + activity.price }));
    }

    // Notifications
    pushNotification(MOCK_SHOP_ID, '新订单', `收到一笔新订单：${activity.title}`, 'info');
    
    if (activity.type === ActivityType.GROUP_BUY) {
         pushNotification(MOCK_USER_ID, '拼团成功', `恭喜！您的 "${activity.title}" 拼团已成功！`, 'success');
    } else {
         pushNotification(MOCK_USER_ID, '领取成功', `"${activity.title}" 已放入您的卡包`, 'success');
    }
  };

  const redeemOrder = (code: string): { success: boolean; message: string } => {
    const orderIndex = orders.findIndex(o => o.code === code && o.status === OrderStatus.PENDING);
    
    if (orderIndex === -1) {
      return { success: false, message: '无效的核销码或订单已使用' };
    }

    const order = orders[orderIndex];
    const updatedOrders = [...orders];
    updatedOrders[orderIndex] = {
      ...updatedOrders[orderIndex],
      status: OrderStatus.REDEEMED,
      redeemedAt: new Date().toISOString()
    };
    setOrders(updatedOrders);

    // Notifications
    pushNotification(MOCK_SHOP_ID, '核销成功', `订单 ${code} 已完成核销`, 'success');
    // In a real app we'd push to the specific user ID, here we assume current context user might see it if they are testing
    if (user?.role === UserRole.CONSUMER) {
         pushNotification(MOCK_USER_ID, '使用成功', `您的 "${order.activityTitle}" 已成功使用`, 'success');
    }

    return { success: true, message: '核销成功！' };
  };

  const getMyOrders = () => {
    return orders.filter(o => o.userId === user?.id);
  };

  const getAnalytics = (range: string, type: string): AnalyticsData => {
      // Mock advanced analytics data generation based on inputs
      // In a real app, this would filter 'orders' and 'activities' by date and type
      
      // Demographics Mock
      const demographics = [
          { name: '18-24岁', value: 35, color: '#8884d8' },
          { name: '25-34岁', value: 45, color: '#82ca9d' },
          { name: '35+岁', value: 20, color: '#ffc658' },
      ];

      // Conversion Rate Mock (Funnel)
      const conversionRate = [
          { name: '曝光量', value: 1200 },
          { name: '访问量', value: 800 },
          { name: '下单', value: 200 },
          { name: '核销', value: 180 },
      ];

      // KPI Mock
      const kpi = {
          aov: 15.5, // Average Order Value
          cltv: 128.0, // Lifetime Value
          repeatRate: 42.5 // Percentage
      };

      // Sales Trend Mock
      const salesTrend = [
          { name: '周一', value: 400 },
          { name: '周二', value: 300 },
          { name: '周三', value: 600 },
          { name: '周四', value: 450 },
          { name: '周五', value: 900 },
          { name: '周六', value: 1300 },
          { name: '周日', value: 1100 },
      ];

      return { demographics, conversionRate, kpi, salesTrend };
  };

  return (
    <StoreContext.Provider value={{ 
        user, activities, orders, stats, notifications, 
        login, logout, addActivity, createOrder, redeemOrder, getMyOrders, removeNotification, getAnalytics 
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};

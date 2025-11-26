import React, { useState, useMemo } from 'react';
import { View, Text, Image, Picker } from '@tarojs/components';
import { useStore } from '../../../context/StoreContext';
import { AnalyticsData } from '../../../types/index';

const VendorDashboard: React.FC = () => {
  const { user, stats, getAnalytics } = useStore();
  const [dateRange, setDateRange] = useState('7d');
  const [campaignType, setCampaignType] = useState('all');

  const analytics = useMemo(() => getAnalytics(dateRange, campaignType), [dateRange, campaignType, getAnalytics]);

  const StatCard = ({ label, value, subtext, icon, color }: any) => (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-full">
      <View className="flex justify-between items-start mb-2">
         <View className={`p-2 rounded-lg ${color} bg-opacity-10`}>
            <Text className={`${color} text-lg`}>{icon}</Text>
         </View>
         <Text className="text-[10px] bg-gray-50 text-gray-400 px-1.5 py-0.5 rounded border border-gray-100">{dateRange === '7d' ? '近7天' : '本月'}</Text>
      </View>
      <View>
        <Text className="text-2xl font-bold text-gray-800 tracking-tight block">{value}</Text>
        <Text className="text-gray-400 text-xs mt-1 block">{label}</Text>
        {subtext && <Text className="text-green-500 text-[10px] font-bold mt-1 flex items-center gap-1">📈 {subtext}</Text>}
      </View>
    </View>
  );

  return (
    <View className="p-4 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <View className="flex items-center justify-between sticky top-0 bg-gray-50 z-10 py-2">
        <View>
          <Text className="text-2xl font-bold text-gray-800 block">数据看板</Text>
          <Text className="text-gray-500 text-xs block">欢迎回来, {user?.name}</Text>
        </View>
        {user?.avatar && <Image src={user.avatar} className="w-10 h-10 rounded-full border-2 border-orange-600 shadow-sm" />}
      </View>

      {/* Filter Bar */}
      <View className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <View className="bg-white rounded-lg p-1 flex border border-gray-200 shadow-sm">
            <View 
                onClick={() => setDateRange('7d')}
                className={`px-3 py-1.5 rounded-md transition-all ${dateRange === '7d' ? 'bg-gray-900' : ''}`}
            >
                <Text className={`text-xs font-bold ${dateRange === '7d' ? 'text-white' : 'text-gray-500'}`}>近7日</Text>
            </View>
            <View 
                onClick={() => setDateRange('30d')}
                className={`px-3 py-1.5 rounded-md transition-all ${dateRange === '30d' ? 'bg-gray-900' : ''}`}
            >
                <Text className={`text-xs font-bold ${dateRange === '30d' ? 'text-white' : 'text-gray-500'}`}>近30日</Text>
            </View>
        </View>

        {/* Picker for Campaign Type */}
        <View className="bg-white rounded-lg px-3 py-1.5 flex items-center gap-2 border border-gray-200 shadow-sm min-w-fit">
            <Text className="text-gray-400 text-xs">🔍</Text>
            <Picker 
                mode="selector" 
                range={['所有活动', '仅拼团', '仅优惠券']} 
                onChange={(e) => {
                    const idx = e.detail.value;
                    const val = idx === 0 ? 'all' : idx === 1 ? 'group' : 'coupon';
                    setCampaignType(val as string);
                }}
            >
                <Text className="text-xs font-bold text-gray-700">
                    {campaignType === 'all' ? '所有活动' : campaignType === 'group' ? '仅拼团' : '仅优惠券'}
                </Text>
            </Picker>
        </View>
      </View>

      {/* KPI Grid */}
      <View className="grid grid-cols-2 gap-3">
        <StatCard label="总销售额" value={`¥${stats.totalSales}`} subtext="+12.5%" icon="💳" color="text-orange-600" />
        <StatCard label="客单价 (AOV)" value={`¥${analytics.kpi.aov}`} subtext="+5.2%" icon="🛍️" color="text-purple-500" />
        <StatCard label="客户终值 (CLTV)" value={`¥${analytics.kpi.cltv}`} icon="👥" color="text-blue-500" />
        <StatCard label="复购率" value={`${analytics.kpi.repeatRate}%`} icon="📊" color="text-green-500" />
      </View>

      {/* Sales Trend Placeholder */}
      <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <View className="flex items-center justify-between mb-6">
          <Text className="font-bold text-gray-700 flex items-center gap-2">
            📅 销售趋势
          </Text>
        </View>
        <View className="h-48 w-full flex items-center justify-center bg-gray-50 rounded-xl">
            <Text className="text-gray-400 text-xs">图表组件在小程序中暂不可用</Text>
            <View className="mt-2 space-y-1 w-full px-4">
                {analytics.salesTrend.slice(0, 3).map((item, idx) => (
                    <View key={idx} className="flex justify-between text-xs">
                        <Text>{item.name}</Text>
                        <Text>¥{item.value}</Text>
                    </View>
                ))}
            </View>
        </View>
      </View>
      
      {/* Demographics Placeholder */}
      <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <Text className="font-bold text-gray-700 mb-4 block">用户画像</Text>
        <View className="space-y-2">
             {analytics.demographics.map((item, idx) => (
                 <View key={idx} className="flex justify-between items-center text-xs">
                     <Text>{item.name}</Text>
                     <Text style={{color: item.color}}>{item.value}%</Text>
                 </View>
             ))}
        </View>
      </View>

      <View className="h-12"></View>
    </View>
  );
};

export default VendorDashboard;

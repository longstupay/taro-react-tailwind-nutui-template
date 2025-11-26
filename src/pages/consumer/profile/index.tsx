import React, { useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';
import { useStore } from '../../../context/StoreContext';
import { OrderStatus } from '../../../types/index';

const Profile: React.FC = () => {
  const { user, getMyOrders, logout } = useStore();
  const orders = getMyOrders();
  
  // Simple tab state
  const [activeTab, setActiveTab] = useState<'PENDING' | 'REDEEMED'>('PENDING');

  const filteredOrders = orders.filter(o => 
    activeTab === 'PENDING' ? o.status === OrderStatus.PENDING : o.status !== OrderStatus.PENDING
  );

  const handleLogout = () => {
      logout();
  };

  const goShop = () => {
    Taro.navigateTo({ url: '/pages/consumer/shop/index' });
  };

  return (
    <View className="min-h-screen bg-gray-50 pb-6">
      <View className="bg-orange-600 pt-12 pb-16 px-6 text-white rounded-b-[2.5rem] shadow-lg relative">
        <View className="flex items-center justify-between">
            <View className="flex items-center gap-4">
                {user?.avatar && <Image src={user.avatar} className="w-16 h-16 rounded-full border-4 border-white/30" />}
                <View>
                    <Text className="text-xl font-bold block">{user?.name}</Text>
                    <Text className="text-white/80 text-sm block">普通会员</Text>
                </View>
            </View>
            <View onClick={handleLogout} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition">
                <Text className="text-white">🚪</Text>
            </View>
        </View>
      </View>

      <View className="px-4 -mt-8">
        <View className="bg-white rounded-2xl shadow-sm p-2 flex mb-6">
             <View 
                onClick={() => setActiveTab('PENDING')}
                className={`flex-1 py-3 rounded-xl flex items-center justify-center transition-all ${activeTab === 'PENDING' ? 'bg-orange-50' : ''}`}
             >
                <Text className={`text-sm font-bold text-center ${activeTab === 'PENDING' ? 'text-orange-600' : 'text-gray-400'}`}>
                    待使用 ({orders.filter(o => o.status === OrderStatus.PENDING).length})
                </Text>
             </View>
             <View 
                onClick={() => setActiveTab('REDEEMED')}
                className={`flex-1 py-3 rounded-xl flex items-center justify-center transition-all ${activeTab === 'REDEEMED' ? 'bg-gray-100' : ''}`}
             >
                <Text className={`text-sm font-bold text-center ${activeTab === 'REDEEMED' ? 'text-gray-700' : 'text-gray-400'}`}>
                    已失效/历史
                </Text>
             </View>
        </View>

        <View className="space-y-4">
            {filteredOrders.map(order => (
                <View key={order.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
                    {/* Decorative Circles */}
                    <View className="absolute -left-3 top-1/2 -mt-3 w-6 h-6 rounded-full bg-gray-50 z-10"></View>
                    <View className="absolute -right-3 top-1/2 -mt-3 w-6 h-6 rounded-full bg-gray-50 z-10"></View>
                    
                    <View className="flex justify-between items-start mb-4 border-b border-dashed border-gray-200 pb-4">
                        <View>
                            <Text className="font-bold text-gray-800 text-lg block">{order.activityTitle}</Text>
                            <Text className="text-xs text-gray-400 mt-1 block">有效期至 2023-12-31</Text>
                        </View>
                        <View className="text-right">
                             {order.status === OrderStatus.PENDING ? (
                                <Text className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">可使用</Text>
                             ) : (
                                <Text className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded">已核销</Text>
                             )}
                        </View>
                    </View>

                    <View className="flex items-center justify-between">
                        <View className="flex flex-col">
                            <Text className="text-xs text-gray-400 block">核销码</Text>
                            <Text className="font-mono text-2xl font-bold tracking-widest text-gray-800 block">{order.code.substring(0,3)} {order.code.substring(3)}</Text>
                        </View>
                        {order.status === OrderStatus.PENDING ? (
                            <View className="p-2 bg-white border-2 border-orange-600 rounded-lg">
                                {/* Simulated QR */}
                                <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${order.code}&color=FF6B00`} className="w-12 h-12" />
                            </View>
                        ) : (
                            <Text className="text-gray-300 text-4xl">✅</Text>
                        )}
                    </View>
                </View>
            ))}

            {filteredOrders.length === 0 && (
                <View className="flex flex-col items-center justify-center py-12 text-gray-300">
                    <Text className="text-4xl mb-2">🎫</Text>
                    <Text>暂无相关订单</Text>
                    <View onClick={goShop} className="mt-4">
                        <Text className="text-orange-600 font-bold text-sm">去逛逛</Text>
                    </View>
                </View>
            )}
        </View>
      </View>
    </View>
  );
};

export default Profile;

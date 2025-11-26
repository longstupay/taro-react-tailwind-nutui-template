import React from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';
import { useStore } from '../../../context/StoreContext';
import { Activity, ActivityType } from '../../../types/index';

interface ActivityCardProps {
  act: Activity;
  onBuy: (id: string) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ act, onBuy }) => (
  <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4 flex gap-4">
    <View className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden relative">
      <Image src={act.imageUrl || ''} className="w-full h-full object-cover" />
      <View className="absolute top-0 left-0 bg-black bg-opacity-50 text-white text-[10px] px-2 py-1 rounded-br-lg">
        <Text>{act.type === ActivityType.GROUP_BUY ? '拼团' : '优惠券'}</Text>
      </View>
    </View>
    
    <View className="flex-1 flex flex-col justify-between">
      <View>
        <Text className="font-bold text-gray-900 leading-tight mb-1 block">{act.title}</Text>
        <Text className="text-xs text-gray-500 line-clamp-2 block">{act.description}</Text>
      </View>

      <View className="mt-2">
          {act.type === ActivityType.GROUP_BUY && (
              <View className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md w-fit mb-2">
                  <Text>👥 {act.targetCount}人成团 · 已拼{act.currentCount}件</Text>
              </View>
          )}
          
          <View className="flex items-end justify-between">
              <View>
                  <Text className="text-orange-600 font-bold text-lg">¥{act.price}</Text>
                  <Text className="text-gray-400 text-xs line-through ml-1">¥{act.originalPrice}</Text>
              </View>
              <View 
                  onClick={() => onBuy(act.id)}
                  className="bg-orange-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md active:scale-95 transition-transform"
              >
                  <Text>{act.type === ActivityType.GROUP_BUY ? '去拼团' : '立即领'}</Text>
              </View>
          </View>
      </View>
    </View>
  </View>
);

const ShopView: React.FC = () => {
  const { activities, createOrder } = useStore();

  const handleBuy = (id: string) => {
    createOrder(id);
    Taro.navigateTo({ url: '/pages/consumer/profile/index' });
  };

  return (
    <View className="min-h-screen bg-gray-50 pb-20">
      {/* Shop Header */}
      <View className="relative h-48 bg-gray-900">
        <Image 
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop" 
            className="w-full h-full opacity-60" 
            mode="aspectFill"
        />
        <View className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-gray-900 to-transparent pt-12 text-white">
            <Text className="text-2xl font-bold block">陈记手打柠檬茶</Text>
            <View className="flex items-center gap-2 text-xs opacity-80 mt-1">
                <Text>🏷️ 网红地摊</Text>
                <Text>|</Text>
                <Text>天河区体育西路 H档口</Text>
            </View>
        </View>
      </View>

      {/* Activity List */}
      <View className="p-4 -mt-4 relative z-10">
        <View className="bg-white rounded-xl p-3 shadow-sm mb-4 flex items-center justify-between">
            <View className="flex items-center gap-2">
                 <Text className="text-red-500">⏰</Text>
                 <Text className="text-sm font-bold text-gray-700">限时秒杀中</Text>
            </View>
            <Text className="text-xs text-gray-400">距离结束 02:14:55</Text>
        </View>

        <Text className="text-lg font-bold text-gray-800 mb-3 ml-1 block">热门活动</Text>
        
        {activities.map(act => (
            <ActivityCard key={act.id} act={act} onBuy={handleBuy} />
        ))}

        {activities.length === 0 && (
            <View className="text-center py-10 text-gray-400">
                <Text>暂无活动，敬请期待</Text>
            </View>
        )}
      </View>
    </View>
  );
};

export default ShopView;

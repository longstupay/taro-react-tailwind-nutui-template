import React, { useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Input, Textarea, Button, Picker } from '@tarojs/components';
import { useStore } from '../../../context/StoreContext';
import { ActivityType } from '../../../types/index';
import { generateMarketingCopy } from '../../../services/geminiService';

const CreateActivity: React.FC = () => {
  const { addActivity } = useStore();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    type: ActivityType.GROUP_BUY,
    title: '',
    price: '',
    originalPrice: '',
    description: '',
    stock: '50',
    targetCount: '3', // Only for group buy
  });

  const handleAI = async () => {
    if (!formData.title) return;
    setLoading(true);
    const keyDetails = `Price: ${formData.price}, Original: ${formData.originalPrice}, Stock: ${formData.stock}`;
    const copy = await generateMarketingCopy(formData.title, formData.type, keyDetails);
    setFormData(prev => ({ ...prev, description: copy }));
    setLoading(false);
  };

  const handleSubmit = () => {
    addActivity({
      type: formData.type,
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      originalPrice: parseFloat(formData.originalPrice),
      stock: parseInt(formData.stock),
      targetCount: formData.type === ActivityType.GROUP_BUY ? parseInt(formData.targetCount) : undefined,
      currentCount: 0,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      imageUrl: `https://picsum.photos/400/300?random=${Date.now()}`
    });
    Taro.navigateBack();
  };

  const goBack = () => {
    Taro.navigateBack();
  };

  return (
    <View className="p-4 bg-white min-h-screen">
       <View className="flex items-center gap-2 mb-6">
        <View onClick={goBack} className="p-2 -ml-2 text-gray-500">
          <Text className="text-xl">⬅️</Text>
        </View>
        <Text className="text-xl font-bold">发布新活动</Text>
      </View>

      <View className="space-y-6">
        {/* Type Selector */}
        <View className="flex p-1 bg-gray-100 rounded-lg">
          <View
            className={`flex-1 py-2 flex items-center justify-center text-sm font-medium rounded-md transition-all ${formData.type === ActivityType.GROUP_BUY ? 'bg-white shadow text-orange-600' : 'text-gray-500'}`}
            onClick={() => setFormData({ ...formData, type: ActivityType.GROUP_BUY })}
          >
            <Text>多人拼团</Text>
          </View>
          <View
            className={`flex-1 py-2 flex items-center justify-center text-sm font-medium rounded-md transition-all ${formData.type === ActivityType.COUPON ? 'bg-white shadow text-orange-600' : 'text-gray-500'}`}
            onClick={() => setFormData({ ...formData, type: ActivityType.COUPON })}
          >
            <Text>优惠券</Text>
          </View>
        </View>

        {/* Basic Info */}
        <View className="space-y-4">
          <View>
            <Text className="block text-sm font-medium text-gray-700 mb-1">活动名称</Text>
            <Input 
              type="text" 
              placeholder="例如：招牌手打柠檬茶"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
              value={formData.title}
              onInput={e => setFormData({ ...formData, title: e.detail.value })}
            />
          </View>

          <View className="grid grid-cols-2 gap-4">
            <View>
              <Text className="block text-sm font-medium text-gray-700 mb-1">活动价 (¥)</Text>
              <Input 
                type="digit" 
                placeholder="9.9"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                value={formData.price}
                onInput={e => setFormData({ ...formData, price: e.detail.value })}
              />
            </View>
             <View>
              <Text className="block text-sm font-medium text-gray-700 mb-1">原价 (¥)</Text>
              <Input 
                type="digit" 
                placeholder="18.0"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                value={formData.originalPrice}
                onInput={e => setFormData({ ...formData, originalPrice: e.detail.value })}
              />
            </View>
          </View>

          {formData.type === ActivityType.GROUP_BUY && (
            <View>
              <Text className="block text-sm font-medium text-gray-700 mb-1">成团人数</Text>
              <Picker
                mode="selector"
                range={['2人团', '3人团', '5人团']}
                onChange={(e) => {
                  const val = ['2', '3', '5'][e.detail.value];
                  setFormData({ ...formData, targetCount: val });
                }}
              >
                 <View className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl">
                   <Text>{formData.targetCount}人团</Text>
                 </View>
              </Picker>
            </View>
          )}

          <View>
             <View className="flex justify-between items-center mb-1">
                <Text className="block text-sm font-medium text-gray-700">活动描述</Text>
                <View 
                  onClick={loading || !formData.title ? undefined : handleAI}
                  className={`flex items-center gap-1 text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full ${loading || !formData.title ? 'opacity-50' : ''}`}
                >
                  <Text>{loading ? '🔄' : '✨'} AI 帮我写</Text>
                </View>
             </View>
            <Textarea 
              placeholder="输入描述或点击 AI 生成..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl h-24"
              value={formData.description}
              onInput={e => setFormData({ ...formData, description: e.detail.value })}
            />
          </View>
          
          <Button 
            className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl mt-6"
            onClick={handleSubmit}
          >
            发布活动
          </Button>
        </View>
      </View>
    </View>
  );
};

export default CreateActivity;

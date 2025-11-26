import React from 'react';
import { View, Text } from '@tarojs/components';
import { useStore } from '../../context/StoreContext';
import { UserRole } from '../../types/index';
import { Store, User, Category } from '@nutui/icons-react-taro';
import { Button } from '@nutui/nutui-react-taro';

const Landing: React.FC = () => {
  const { login } = useStore();

  const handleVendorLogin = () => {
    login(UserRole.VENDOR);
  };

  const handleConsumerLogin = () => {
    login(UserRole.CONSUMER);
  };

  return (
    <View className="min-h-screen w-full bg-gradient-to-br from-orange-400 to-orange-600 flex flex-col items-center justify-center p-8 text-white relative overflow-hidden">
      {/* Background decoration */}
      <View className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <View className="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl" />
        <View className="absolute top-1/3 -left-20 w-40 h-40 bg-yellow-300 opacity-10 rounded-full blur-2xl" />
        <View className="absolute bottom-0 right-0 w-80 h-80 bg-orange-800 opacity-20 rounded-full blur-3xl" />
      </View>

      <View className="mb-16 text-center flex flex-col items-center z-10 animate-fade-in-down">
        <View className="w-28 h-28 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
          <Store className="text-orange-500" width={48} height={48} />
        </View>
        <Text className="text-4xl font-extrabold mb-3 tracking-tight block drop-shadow-sm">StallMate</Text>
        <Text className="text-orange-100 text-base font-medium tracking-wider block opacity-90">地摊夜市 · 营销神器</Text>
      </View>

      <View className="w-full space-y-6 z-10 max-w-xs">
        <Button 
          block 
          type="default" 
          size="large"
          className="!bg-white !text-orange-600 !border-none !rounded-2xl !h-14 !font-bold !text-lg !shadow-lg hover:!shadow-xl active:!scale-95 !transition-all !flex !items-center !justify-center !gap-2"
          onClick={handleVendorLogin}
          icon={<Category className="mb-0.5" />}
        >
          我是摊主 (店铺管理)
        </Button>

        <Button 
          block 
          type="primary" 
          size="large"
          className="!bg-orange-700 !bg-opacity-30 !border-2 !border-white !border-opacity-20 !text-white !rounded-2xl !h-14 !font-bold !text-lg !backdrop-blur-md hover:!bg-opacity-40 active:!scale-95 !transition-all !flex !items-center !justify-center !gap-2"
          onClick={handleConsumerLogin}
          icon={<User className="mb-0.5" />}
        >
          我是食客 (扫码下单)
        </Button>
      </View>

      <View className="mt-16 text-center opacity-60 text-xs z-10 space-y-1">
        <Text className="block">模拟微信一键登录</Text>
        <Text className="block">无需手机号 · 极速体验</Text>
      </View>
    </View>
  );
};

export default Landing;

import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Input, Button } from '@tarojs/components';
import { useStore } from '../../../context/StoreContext';

const Verification: React.FC = () => {
  const { redeemOrder } = useStore();
  const [code, setCode] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleVerify = () => {
    const res = redeemOrder(code);
    setResult(res);
    if (res.success) {
      setCode(''); // Clear on success
    }
  };

  const handleScan = () => {
    Taro.scanCode({
      success: (res) => {
        // Assume QR code contains the code directly
        const scannedCode = res.result;
        setCode(scannedCode);
        const verifyRes = redeemOrder(scannedCode);
        setResult(verifyRes);
        if (verifyRes.success) setCode('');
      },
      fail: () => {
        Taro.showToast({ title: '扫码失败', icon: 'none' });
      }
    });
  };

  // Auto-verify if code length is 6
  useEffect(() => {
    if (code.length === 6) {
        const timer = setTimeout(() => {
             const res = redeemOrder(code);
             setResult(res);
             if (res.success) setCode('');
        }, 500);
        return () => clearTimeout(timer);
    }
  }, [code, redeemOrder]);

  return (
    <View className="p-6 min-h-screen flex flex-col bg-white">
      <Text className="text-2xl font-bold text-gray-800 mb-8 block">订单核销</Text>

      <View className="flex-1 flex flex-col items-center justify-center space-y-8">
        {/* Scanner Button */}
        <View 
            className="relative w-64 h-64 bg-black rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center"
            onClick={handleScan}
        >
            <View className="absolute inset-0 opacity-50 bg-gray-800"></View>
            <View className="absolute inset-0 border-2 border-orange-500 opacity-50 m-8 rounded-lg"></View>
            <View className="z-10 flex flex-col items-center">
                <Text className="text-white text-4xl mb-2">📷</Text>
                <Text className="text-white text-xs opacity-80">点击扫码</Text>
            </View>
        </View>

        <View className="w-full max-w-xs">
          <Input
            type="number"
            placeholder="输入6位数字核销码"
            maxlength={6}
            className="w-full text-center text-2xl tracking-widest font-mono p-4 rounded-xl border-2 border-gray-200 focus:border-orange-500 shadow-sm h-16"
            value={code}
            onInput={e => {
                setResult(null);
                setCode(e.detail.value.replace(/\D/g, ''));
            }}
          />
        </View>

        {result && (
          <View className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-lg ${result.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <Text className="text-lg">{result.success ? '✅' : '❌'}</Text>
            <Text className="font-bold">{result.message}</Text>
          </View>
        )}
      </View>
      
      <Text className="text-center text-gray-400 text-sm mt-8 block">支持扫码或手动输入</Text>
    </View>
  );
};

export default Verification;

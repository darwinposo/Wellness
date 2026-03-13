import { View, Text } from 'react-native';
import { SafeScreen } from '@/components/ui/SafeScreen';

export default function InsightsScreen() {
  return (
    <SafeScreen>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-3xl font-bold text-text-primary mb-2">Wawasan</Text>
        <Text className="text-base text-text-muted text-center">
          Pola & tren suasana hatimu 📊
        </Text>
      </View>
    </SafeScreen>
  );
}

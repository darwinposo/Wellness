import { View, Text, Alert } from 'react-native';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

/** Today/Home screen — stub with design token smoke test */
export default function TodayScreen() {
  return (
    <SafeScreen>
      <View className="flex-1 px-screen-edge pt-6">
        {/* Header */}
        <Text
          className="text-3xl text-text-primary mb-1"
          style={{ fontFamily: 'PlusJakartaSans_700Bold' }}
        >
          Hari Ini
        </Text>
        <Text
          className="text-base text-text-muted mb-6"
          style={{ fontFamily: 'PlusJakartaSans_400Regular' }}
        >
          Bagaimana perasaanmu? 🌅
        </Text>

        {/* Token smoke-test card */}
        <Card className="mb-4">
          <Text
            className="text-base text-text-primary mb-1"
            style={{ fontFamily: 'PlusJakartaSans_600SemiBold' }}
          >
            Mulai sesi harianmu
          </Text>
          <Text
            className="text-sm text-text-muted"
            style={{ fontFamily: 'PlusJakartaSans_400Regular' }}
          >
            AI siap mendengarkan kamu hari ini.
          </Text>
        </Card>

        {/* Brand primary button — proves #D4724A renders */}
        <Button
          label="Mulai Jurnal"
          onPress={() => Alert.alert('Reflect', 'Coming soon in M003!')}
          variant="primary"
        />

        <View className="h-3" />

        {/* Secondary button */}
        <Button
          label="Lihat Riwayat"
          onPress={() => {}}
          variant="secondary"
        />
      </View>
    </SafeScreen>
  );
}

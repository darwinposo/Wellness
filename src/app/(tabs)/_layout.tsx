import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/lib/constants';

function TabLabel({ title, color }: { title: string; color: string }) {
  return (
    <Text
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.7}
      allowFontScaling={false}
      style={{
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 10,
        color,
        includeFontPadding: false,
        textAlign: 'center',
        width: '100%',
      }}
    >
      {title}
    </Text>
  );
}

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface TabIconProps {
  name: IoniconsName;
  color: string;
  size: number;
}

function TabIcon({ name, color, size }: TabIconProps) {
  return <Ionicons name={name} color={color} size={size} />;
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.brandPrimary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 64 + insets.bottom,
          paddingBottom: insets.bottom + 6,
          paddingTop: 10,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
        tabBarItemStyle: {
          paddingHorizontal: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hari Ini',
          tabBarIcon: ({ color }) => <TabIcon name="sunny-outline" color={color} size={20} />,
          tabBarLabel: ({ color }) => <TabLabel title="Hari Ini" color={color} />,
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Jurnal',
          tabBarIcon: ({ color }) => <TabIcon name="book-outline" color={color} size={20} />,
          tabBarLabel: ({ color }) => <TabLabel title="Jurnal" color={color} />,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Wawasan',
          tabBarIcon: ({ color }) => <TabIcon name="bar-chart-outline" color={color} size={20} />,
          tabBarLabel: ({ color }) => <TabLabel title="Wawasan" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <TabIcon name="person-outline" color={color} size={20} />,
          tabBarLabel: ({ color }) => <TabLabel title="Profil" color={color} />,
        }}
      />
    </Tabs>
  );
}

import { View, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

/** Base card component — white bg, 16px radius, standard shadow */
export function Card({ children, className = '', style }: CardProps) {
  return (
    <View
      className={`bg-surface rounded-card p-4 ${className}`}
      style={[
        {
          // Android uses elevation; iOS uses shadow* props
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.10,
          shadowRadius: 16,
          elevation: 4,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface LogoProps {
  size?: number;
  glow?: boolean;
  showFreeBadge?: boolean;
}

export function Logo({
  size = 40,
  glow = false,
  showFreeBadge = false,
}: LogoProps) {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        }
      ]}
    >
      <Image
        source={require('@/assets/images/icon.png')}
        style={{
          width: '100%',
          height: '100%',
          // Ye scale effect safed borders ko zoom karke crop kar dega
          transform: [{ scale: 1.2 }],
        }}
        resizeMode="cover"
      />
    </View>
  );
}

export function Wordmark() {
  return null;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    overflow: 'hidden', // Bahar nikla hua white hissa yahan se cut ho jayega
  },
});

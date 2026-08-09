import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface LogoProps {
  size?: number;
  glow?: boolean;
}

export function Logo({ size = 40, glow = false }: LogoProps) {
  return (
    <View style={[
      styles.container,
      { width: size, height: size, borderRadius: size / 2 }
    ]}>
      <Image
        source={require('@/assets/images/icon.png')}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
});

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
  const radius = size * 0.22;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: radius,
          overflow: 'hidden',
        },
        glow && styles.glow,
      ]}
    >
      <Image
        source={require('@/assets/images/icon.png')}
        style={{
          width: '130%',
          height: '130%',
          marginLeft: '-15%',
          marginTop: '-15%',
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
  },

  glow: {
    shadowColor: '#3DDC84',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 4,
  },
});

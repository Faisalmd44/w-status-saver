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
        },
        glow && styles.glow,
      ]}
    >
      <Image
        source={require('@/assets/images/icon.png')}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
        }}
        resizeMode="cover"
      />

      {showFreeBadge && (
        <View style={styles.freeBadge}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={{ width: 0, height: 0 }}
          />
        </View>
      )}
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
    overflow: 'hidden',
  },
  glow: {
    shadowColor: '#3DDC84',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  freeBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 18,
    height: 18,
    backgroundColor: '#E53935',
    transform: [{ rotate: '45deg' }],
  },
});

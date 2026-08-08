import { View, Text } from 'react-native';

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#0E1513',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: '#3DDC84', fontSize: 24, fontWeight: 'bold' }}>
        W Status Saver
      </Text>

      <Text style={{ color: '#FFFFFF', marginTop: 10 }}>
        APP STARTED SUCCESSFULLY
      </Text>
    </View>
  );
}

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Enter_screen from './screens/enter_screen';

export default function App() {
  return (
    <View style={styles.container}>
      <Enter_screen/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

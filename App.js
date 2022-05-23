import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2d2e2c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldsGrid: {
    marginTop: 80,
  },
  field: {
    marginTop: 10,
    spacing: 1,
    padding: 2,
    paddingBottom: 4,
  },
  fieldText: {
    color: 'white',
    height: 60,
    width: 60,
    textAlign: 'center',
    fontSize: 25,
  },
  state0: {
    // Word doesn't contains letter
    backgroundColor: '#505050',
  },
  state1: {
    // Word contains letter
    backgroundColor: '#ffc107',
  },
  state2: {
    // Letter on right spot
    backgroundColor: '#4caf50',
  }
});

export default function App() {
  const [ fields, setFields ] = useState([
    { slot: '1.1', value: 'S', state: 0 },
    { slot: '1.2', value: 'M', state: 0 },
    { slot: '1.3', value: 'E', state: 1 },
    { slot: '1.4', value: 'L', state: 0 },
    { slot: '1.5', value: 'T', state: 1 },
    { slot: '2.1', value: 'T', state: 2 },
    { slot: '2.2', value: 'E', state: 2 },
    { slot: '2.3', value: 'G', state: 0 },
    { slot: '2.4', value: 'E', state: 2 },
    { slot: '2.5', value: 'N', state: 2 },
    { slot: '3.1', value: 'T', state: 2 },
    { slot: '3.2', value: 'E', state: 2 },
    { slot: '3.3', value: 'K', state: 0 },
    { slot: '3.4', value: 'E', state: 2 },
    { slot: '3.5', value: 'N', state: 2 },
    { slot: '4.1', value: 'T', state: 2 },
    { slot: '4.2', value: 'E', state: 2 },
    { slot: '4.3', value: 'V', state: 0 },
    { slot: '4.4', value: 'E', state: 2 },
    { slot: '4.5', value: 'N', state: 2 },
    { slot: '5.1', value: 'T', state: 2 },
    { slot: '5.2', value: 'E', state: 2 },
    { slot: '5.3', value: 'Z', state: 0 },
    { slot: '5.4', value: 'E', state: 2 },
    { slot: '5.5', value: 'N', state: 2 },
    { slot: '6.1', value: 'T', state: 2 },
    { slot: '6.2', value: 'E', state: 2 },
    { slot: '6.3', value: 'N', state: 0 },
    { slot: '6.4', value: 'E', state: 2 },
    { slot: '6.5', value: 'N', state: 2 },
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.fieldsGrid}>
        <FlatList
          itemDimension={130}
          data={fields}
          spacing={10}
          numColumns={5}
          key={5}
          renderItem={({ item }) => (
            <View style={styles.field}>
              <Text
                style={[item.state === 1 ?
                  styles.state1
                  :
                  (item.state === 2 ?
                    styles.state2 
                    :
                    styles.state0
                  )
                , styles.fieldText]}
              >
                {item.value}
              </Text>
            </View>
          )}
        / >
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

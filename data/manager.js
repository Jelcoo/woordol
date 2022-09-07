import AsyncStorage from '@react-native-async-storage/async-storage';

export const store = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value)
    } catch (e) {
      // saving error
    }
}

export const get = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key)
        return value;
    } catch(e) {
        // error reading value
    }
}

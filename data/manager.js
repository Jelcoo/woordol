import AsyncStorage from '@react-native-async-storage/async-storage';

export const store = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      throw e;
    }
}

export const get = async (key) => {
    try {
        console.log(key)
        const value = await AsyncStorage.getItem(key);
        return value;
    } catch(e) {
        throw e;
    }
}

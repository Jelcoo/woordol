import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';

import homeStyles from './styles/home';
import tileStyle from './styles/tiles';
import keyboardStyle from './styles/keyboard';

import keys from './data/keyboard';
import tileList from './data/tiles';

export default function App() {
    const [ tiles, setTiles ] = useState(tileList);

    const setTile = (key) => {
        let tileList = tiles;
        tileList[0] = {value: key};
        setTiles(tileList);
    }

    return (
        <View style={homeStyles.container}>
            <View style={tileStyle.tileGrid}>
                <FlatList
                    itemDimension={130}
                    data={tiles}
                    spacing={10}
                    numColumns={5}
                    key={5}
                    renderItem={({ item }) => (
                        <View style={tileStyle.tile}>
                            <Text
                                style={[
                                    item.state === 2 ?
                                        tileStyle.state2
                                        :
                                        tileStyle.state0
                                    , tileStyle.tileText
                                ]}
                            >
                                {item.value}
                            </Text>
                        </View>
                    )}
                />
            </View>
            <View style={keyboardStyle.grid}>
                {keys.map((keyMap, key) => (
                    <View key={key} style={keyboardStyle.row}>
                        {keyMap.map((k) => (
                            <TouchableOpacity
                                key={k}
                                style={keyboardStyle.button}
                                onPress={setTile(k)}
                            >
                                <Text style={keyboardStyle.buttonText}>
                                    {k}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </View>
            <StatusBar style="auto" />
        </View>
    );
}

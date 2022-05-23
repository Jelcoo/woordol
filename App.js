import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, FlatList } from 'react-native';

import homeStyles from './styles/home';
import letterGrid from './styles/letterGrid';
import keyboardGrid from './styles/keyboardGrid';

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

    const [ keyboard, setKeyboard ] = useState([
        { slot: '1.1', value: 'Q', state: 0 },
        { slot: '1.2', value: 'W', state: 0 },
        { slot: '1.3', value: 'E', state: 1 },
        { slot: '1.4', value: 'R', state: 0 },
        { slot: '1.5', value: 'T', state: 1 },
        { slot: '1.6', value: 'Y', state: 2 },
        { slot: '1.7', value: 'U', state: 2 },
        { slot: '1.8', value: 'I', state: 0 },
        { slot: '1.9', value: 'O', state: 2 },
        { slot: '1.10', value: 'P', state: 2 },
        { slot: '2.1', value: 'A', state: 2 },
        { slot: '2.2', value: 'S', state: 2 },
        { slot: '2.3', value: 'D', state: 0 },
        { slot: '2.4', value: 'F', state: 2 },
        { slot: '2.5', value: 'G', state: 2 },
        { slot: '2.6', value: 'H', state: 2 },
        { slot: '2.7', value: 'J', state: 2 },
        { slot: '2.8', value: 'K', state: 0 },
        { slot: '2.9', value: 'L', state: 2 },
        { slot: '2.10', value: '', state: 0 },
        { slot: '2.9', value: 'Enter', state: 0, type: 'enter' },
        { slot: '3.1', value: 'Z', state: 2 },
        { slot: '3.2', value: 'X', state: 2 },
        { slot: '3.3', value: 'C', state: 2 },
        { slot: '3.4', value: 'V', state: 0 },
        { slot: '3.5', value: 'B', state: 2 },
        { slot: '3.6', value: 'N', state: 2 },
        { slot: '3.7', value: 'M', state: 2 },
        { slot: '2.8', value: '', state: 0 },
        { slot: '2.10', value: '', state: 0 },
    ]);

    return (
        <View style={homeStyles.container}>
            <View style={letterGrid.fieldsGrid}>
                <FlatList
                    itemDimension={130}
                    data={fields}
                    spacing={10}
                    numColumns={5}
                    key={5}
                    renderItem={({ item }) => (
                        <View style={letterGrid.field}>
                            <Text
                                style={[item.state === 1 ?
                                    letterGrid.state1
                                    :
                                    (item.state === 2 ?
                                        letterGrid.state2 
                                        :
                                        letterGrid.state0
                                    )
                                    , letterGrid.fieldText
                                ]}
                            >
                                {item.value}
                            </Text>
                        </View>
                    )}
                />
            </View>
            <View style={keyboardGrid.fieldsGrid}>
                <FlatList
                    itemDimension={130}
                    data={keyboard}
                    spacing={10}
                    numColumns={10}
                    key={10}
                    renderItem={({ item }) => (
                        <View style={keyboardGrid.field}>
                            <Text
                                style={[item.state === 1 ?
                                    keyboardGrid.state1
                                    :
                                    (item.state === 2 ?
                                        keyboardGrid.state2 
                                        :
                                        (
                                            item.value === '' ?
                                                null
                                                :
                                                keyboardGrid.state0
                                        )
                                    )
                                    , (item.type === 'enter' ? keyboardGrid.enterButton : keyboardGrid.fieldText)
                                ]}
                            >
                                {item.value}
                            </Text>
                        </View>
                    )}
                />
            </View>
            <StatusBar style="auto" />
        </View>
    );
}

import { StyleSheet } from 'react-native';

const keyboardGrid = StyleSheet.create({
    fieldsGrid: {
        marginTop: 20,
        alignItems: 'center',
    },
    field: {
        marginTop: 10,
        spacing: 1,
        padding: 2,
        paddingBottom: 4,
    },
    fieldText: {
        color: 'white',
        height: 35,
        width: 25,
        textAlign: 'center',
        fontSize: 23,
    },
    enterButton: {
        color: 'white',
        height: 35,
        width: 70,
        textAlign: 'center',
        fontSize: 23,
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

export default keyboardGrid;

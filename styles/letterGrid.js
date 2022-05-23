import { StyleSheet } from 'react-native';

const letterGrid = StyleSheet.create({
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

export default letterGrid;

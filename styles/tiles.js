import { StyleSheet } from 'react-native';

const tiles = StyleSheet.create({
    tileGrid: {
        marginTop: 80,
        alignItems: 'center',
    },
    tile: {
        marginTop: 10,
        spacing: 1,
        padding: 2,
        paddingBottom: 4,
        borderWidth: 1.5,
        borderColor: '#565758',
        marginRight: 5,
    },
    tileText: {
        color: 'white',
        height: 60,
        width: 60,
        textAlign: 'center',
        fontSize: 25,
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

export default tiles;

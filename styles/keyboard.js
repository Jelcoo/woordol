import { StyleSheet } from 'react-native';

const keyboardGrid = StyleSheet.create({
    grid: {
        marginHorizontal: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        marginBottom: 10,
    },
    button: {
        padding: 0,
        marginRight: 6,
        height: 58,
        borderRadius: 4,
        backgroundColor: '#505050',
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        textTransform: 'uppercase',
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

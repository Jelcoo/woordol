import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';

export const TileContainer = styled.View`
    margin-top: 15%;
    align-items: center;
`;

export const TileRow = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 95%;
    margin-bottom: 5px;
`;

export const Tile = styled.View`
    padding: 2px;
    padding-bottom: 4px;
    border-width: 1.5px;
    border-color: #565758;
    margin-right: 5px;
`;

export const TileText = styled.Text`
    color: white;
    height: 60px;
    width: 60px;
    text-align: center;
    font-size: 25px;
`;

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

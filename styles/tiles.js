import styled from 'styled-components/native';

export const TileContainer = styled.View`
    margin-top: 20%;
    align-items: center;
`;

export const TileRow = styled.View`
    display: flex;
    flex-direction: row;
    width: 75%;
    margin: 0px 10px 5px;
`;

export const Tile = styled.View`
    padding: 2px;
    padding-bottom: 4px;
    border-width: 1.5px;
    border-color: #565758;
    margin-right: 5px;
    height: 60px;
    width: 60px;
`;

export const TileText = styled.Text`
    color: white;
    font-size: 25px;
    text-transform: uppercase;
    text-align: center;
    margin-top: auto;
    margin-bottom: auto;
`;

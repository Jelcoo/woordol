import styled from 'styled-components/native';

export const KeyboardContainer = styled.View`
    margin-top: 30%;
    margin-right: 1%;
    margin-left: 1%;
    align-items: center;
`;

export const KeyboardRow = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 95%;
    margin-bottom: 10px;
`;

export const KeyboardKey = styled.TouchableOpacity`
    padding: 0;
    margin-right: 6px;
    height: 58px;
    border-radius: 4px;
    background-color: #505050;
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
`;

export const KeyboardKeyText = styled.Text`
    color: white;
    font-weight: bold;
    text-transform: uppercase;
`;

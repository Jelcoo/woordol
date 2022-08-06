import { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBackspace, faTurnDown } from '@fortawesome/free-solid-svg-icons';
import * as config from './config.js';

import { TileContainer, TileText, Tile, TileRow } from './styles/tiles';
import { KeyboardContainer, KeyboardKey, KeyboardKeyText, KeyboardRow } from './styles/keyboard';
import { Container } from './styles/home';

export default function App() {
    const wordOfTheDay = "money";
    const [ guesses, setGuesses ] = useState({ ...config.newGame });
    const [ markers, setMarkers ] = useState({
        0: Array.from({ length: config.wordLength }).fill(''),
        1: Array.from({ length: config.wordLength }).fill(''),
        2: Array.from({ length: config.wordLength }).fill(''),
        3: Array.from({ length: config.wordLength }).fill(''),
        4: Array.from({ length: config.wordLength }).fill(''),
        5: Array.from({ length: config.wordLength }).fill(''),
    });
    let letterIndex = useRef(0);
    let round = useRef(0);

    const erase = () => {
        const _letterIndex = letterIndex.current;
        const _round = round.current;
    
        if (_letterIndex !== 0) {
            setGuesses((prev) => {
                const newGuesses = { ...prev };
                newGuesses[_round][_letterIndex - 1] = "";
                return newGuesses;
            });
    
            letterIndex.current = _letterIndex - 1;
        }
    };

    const publish = (pressedKey) => {
        const _letterIndex = letterIndex.current;
        const _round = round.current;
    
        if (_letterIndex < config.wordLength) {
            setGuesses((prev) => {
                const newGuesses = { ...prev };
                newGuesses[_round][_letterIndex] = pressedKey.toLowerCase();
                return newGuesses;
            });
    
            letterIndex.current = _letterIndex + 1;
        }
    };

    const enterGuess = async (pressedKey) => {
        if (pressedKey === "enter" && !guesses[round.current].includes("")) {
            //const validWord = await fetchWord(guesses[round.current].join(""));
    
            //if (Array.isArray(validWord)) {
            //    submit();
            //}
        } else if (pressedKey === "backspace") {
            erase();
        } else if (pressedKey !== "enter") {
            publish(pressedKey);
        }
    };

    const handleClick = (key) => {
        const pressedKey = key.toLowerCase();
        enterGuess(pressedKey);
    };

    return (
        <Container>
            <TileContainer>
                {Object.values(guesses).map((word, wordIndex) => (
                    <TileRow>
                        {word.map((letter, i) => (
                            <Tile key={i}>
                                <TileText>
                                    {letter}
                                </TileText>
                            </Tile>
                        ))}
                    </TileRow>
                ))}
            </TileContainer>
            <KeyboardContainer>
                {config.keyboardRows.map((keys, i) => (
                    <KeyboardRow key={i}>
                        {keys.map((key, i) => (
                            <KeyboardKey key={i} onPress={() => handleClick(key)}>
                                <KeyboardKeyText>
                                    {key === 'backspace' ? (
                                        <FontAwesomeIcon
                                            icon={faBackspace}
                                            style={{ color: '#ffffff' }}
                                        />
                                    ) : (
                                        key === 'enter' ? (
                                            <FontAwesomeIcon
                                                icon={faTurnDown}
                                                style={{
                                                    color: '#ffffff',
                                                    transform: [{ rotate: '90deg' }]
                                                }}
                                            />
                                        ) : (
                                            key
                                        )
                                    )}
                                </KeyboardKeyText>
                            </KeyboardKey>
                        ))}
                    </KeyboardRow>
                ))}
            </KeyboardContainer>
            <StatusBar style="auto" />
        </Container>
    );
}

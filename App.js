import { useState, useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBackspace, faTurnDown } from '@fortawesome/free-solid-svg-icons';
import * as config from './config';
import { wordList } from './data/words';
import * as dataManager from './data/manager';
import * as utils from './utils';

import { TileContainer, TileText, Tile, TileRow } from './styles/tiles';
import { KeyboardContainer, KeyboardKey, KeyboardKeyText, KeyboardRow } from './styles/keyboard';
import { Container } from './styles/home';

export default function App() {
    const wordOfTheDay = "nimby";
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

    useEffect(() => {
        dataManager.store('woordol_words', JSON.stringify(wordList));
    });

    const submit = () => {
        const roundNr = round.current;
        const newMarkers = { ...markers };
        const correctWord = wordOfTheDay.split('');
        const notMarked = [];
    
        // Check correct letters
        correctWord.forEach((letter, i) => {
            const guessedLetter = guesses[roundNr][i];
    
            if (guessedLetter === letter) {
                newMarkers[roundNr][i] = 'green';
                correctWord[i] = '';
            } else notMarked.push(i);
        });
    
        // Check if all markers are green (= win)
        if (newMarkers[roundNr].every((guess) => guess === 'green')) {
            // TODO: make win system
            setMarkers(newMarkers);
            return;
        }
    
        // Check letters in wrong spot
        if (notMarked.length) {
            notMarked.forEach((i) => {
                const guessedLetter = guesses[roundNr][i];
                const position = correctWord.indexOf(guessedLetter);
    
            if (correctWord.includes(guessedLetter) && position !== i) {
                newMarkers[roundNr][i] = 'yellow';
                correctWord[position] = '';
            } else newMarkers[roundNr][i] = "grey";
          });
        }
    
        setMarkers(newMarkers);
        round.current = roundNr + 1;
        letterIndex.current = 0;
    };

    const backspace = () => {
        const index = letterIndex.current;
        const roundNr = round.current;
    
        if (index !== 0) {
            setGuesses((prev) => {
                const newGuesses = { ...prev };
                newGuesses[roundNr][index - 1] = '';
                return newGuesses;
            });
    
            letterIndex.current = index - 1;
        }
    };

    const enter = (key) => {
        const index = letterIndex.current;
        const roundNr = round.current;
    
        if (index < config.wordLength) {
            setGuesses((prev) => {
                const newGuesses = { ...prev };
                newGuesses[roundNr][index] = key.toLowerCase();
                return newGuesses;
            });
    
            letterIndex.current = index + 1;
        }
    };

    const keyPress = async (key) => {
        const pressed = key.toLowerCase();
        if (pressed === "enter" && !guesses[round.current].includes('')) {
            // Fetch words & validate
            const savedWordList = JSON.parse(await dataManager.get('woordol_words'));
            const isValid = savedWordList.filter(w => w.word === guesses[round.current].join(''));
    
            if (isValid) submit();
        } else if (pressed === "backspace") {
            // Remove last letter from the field
            backspace();
        } else if (pressed !== "enter") {
            // Enter new letter into the field
            enter(pressed);
        }
    };

    return (
        <Container>
            <TileContainer>
                {Object.values(guesses).map((word, i) => (
                    <TileRow key={i}>
                        {word.map((letter, ind) => (
                            <Tile key={ind+letter} style={utils.markerToColor(markers[i][ind])}>
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
                            <KeyboardKey key={i+key} onPress={() => keyPress(key)}>
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

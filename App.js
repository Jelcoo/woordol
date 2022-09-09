import { useState, useEffect } from 'react';
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
    const [ guesses, setGuesses ] = useState({ ...config.newGame });
    const [ markers, setMarkers ] = useState({
        0: Array.from({ length: config.wordLength }).fill(''),
        1: Array.from({ length: config.wordLength }).fill(''),
        2: Array.from({ length: config.wordLength }).fill(''),
        3: Array.from({ length: config.wordLength }).fill(''),
        4: Array.from({ length: config.wordLength }).fill(''),
        5: Array.from({ length: config.wordLength }).fill(''),
    });
    const [ letterIndex, setLetterIndex ] = useState(0);
    const [ round, setRound ] = useState(0);
    const [ todaysWord, setTodaysWord ] = useState('');

    useEffect(() => {
        dataManager.store('woordol_words', JSON.stringify(wordList));
        checkTodaysWord();
    });

    const checkTodaysWord = async () => {
        const savedWordList = JSON.parse(await dataManager.get('woordol_words'));
        const today = new Date().toISOString().slice(0, 10);
        const word = savedWordList.filter(w => w.use_on === today);
        if (word) setTodaysWord(word[0].word);
    }

    const submit = () => {
        const newMarkers = { ...markers };
        const correctWord = todaysWord.split('');
        const notMarked = [];

        // Check correct letters
        correctWord.forEach((letter, i) => {
            const guessedLetter = guesses[round][i];

            if (guessedLetter === letter) {
                newMarkers[round][i] = 'green';
                correctWord[i] = '';
            } else notMarked.push(i);
        });

        // Check if all markers are green (= win)
        if (newMarkers[round].every((guess) => guess === 'green')) {
            // TODO: make win system
            setMarkers(newMarkers);
            return;
        }

        // Check letters in wrong spot
        if (notMarked.length) {
            notMarked.forEach((i) => {
                const guessedLetter = guesses[round][i];
                const position = correctWord.indexOf(guessedLetter);

            if (correctWord.includes(guessedLetter) && position !== i) {
                newMarkers[round][i] = 'yellow';
                correctWord[position] = '';
            } else newMarkers[round][i] = "grey";
          });
        }

        setMarkers(newMarkers);
        setRound(round + 1);
        setLetterIndex(0);
    };

    const backspace = () => {
        if (letterIndex !== 0) {
            setGuesses((prev) => {
                const newGuesses = { ...prev };
                newGuesses[round][letterIndex - 1] = '';
                return newGuesses;
            });

            setLetterIndex(letterIndex - 1);
        }
    };

    const enter = (key) => {
        if (index < config.wordLength) {
            setGuesses((prev) => {
                const newGuesses = { ...prev };
                newGuesses[round][index] = key.toLowerCase();
                return newGuesses;
            });

            setLetterIndex(index + 1);
        }
    };

    const keyPress = async (key) => {
        const pressed = key.toLowerCase();
        if (pressed === "enter" && !guesses[round].includes('')) {
            // Fetch words & validate
            const savedWordList = JSON.parse(await dataManager.get('woordol_words'));
            const isValid = savedWordList.filter(w => w.word === guesses[round].join(''));

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

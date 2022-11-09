import { useState, useEffect } from 'react';
import { Alert, Modal, Pressable, View, Button, Share } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBackspace, faTurnDown } from '@fortawesome/free-solid-svg-icons';
import * as config from './config';
import { guessWordList } from './data/guessWords';
import { enterWordList } from './data/enterWords';
import * as dataManager from './data/manager';
import * as utils from './utils';

import { TileContainer, TileText, Tile, TileRow } from './styles/tiles';
import { KeyboardContainer, KeyboardKey, KeyboardKeyText, KeyboardRow } from './styles/keyboard';
import { Container, ModalContainer, ModalView, ModalText } from './styles/home';

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
    const [ modalVisible, setModalVisible ] = useState(false);
    const [ incorrect, setIncorrect ] = useState(-1);

    useEffect(() => {
        dataManager.store('woordol_words', JSON.stringify(guessWordList));
        checkTodaysWord();
    }, []);

    useEffect(() => {
        setData();
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setIncorrect(-1);
        }, 2000);
    }, [incorrect]);

    const checkTodaysWord = async () => {
        const savedWordList = JSON.parse(await dataManager.get('woordol_words'));
        const today = new Date().toISOString().slice(0, 10);
        const word = savedWordList.filter(w => w.use_on === today);
        if (word) setTodaysWord(word[0].word);
    }

    const setData = async () => {
        const today = new Date().toISOString().slice(0, 10);
        const savedGuesses = JSON.parse(await dataManager.get(`woordol_guesses_${today}`));
        if (savedGuesses) setGuesses(savedGuesses);

        const savedMarkers = JSON.parse(await dataManager.get(`woordol_markers_${today}`));
        if (savedMarkers) setMarkers(savedMarkers);

        const savedData = JSON.parse(await dataManager.get(`woordol_data_${today}`));
        if (savedData) {
            if (savedData.round) {
                setRound(savedData.round);
            }
        }

        if (savedMarkers && savedMarkers[round].every((guess) => guess === 'green')) setModalVisible(true);
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
            const todaysDate = new Date().toISOString().slice(0, 10);
            const todaysGuesses = JSON.stringify(guesses);
            const todaysMarkers = JSON.stringify(newMarkers);
            const todaysData = JSON.stringify({
                day: todaysDate,
                word: todaysWord,
                round: round,
            });

            dataManager.store(`woordol_guesses_${todaysDate}`, todaysGuesses);
            dataManager.store(`woordol_markers_${todaysDate}`, todaysMarkers);
            dataManager.store('woordol_data', todaysData);

            setModalVisible(true);
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

            const todaysGuesses = JSON.stringify(guesses);
            const todaysMarkers = JSON.stringify(markers);

            dataManager.store('woordol_guesses', todaysGuesses);
            dataManager.store('woordol_markers', todaysMarkers);
        }
    };

    const enter = (key) => {
        if (letterIndex < config.wordLength) {
            setGuesses((prev) => {
                const newGuesses = { ...prev };
                newGuesses[round][letterIndex] = key.toLowerCase();
                return newGuesses;
            });

            setLetterIndex(letterIndex + 1);

            const todaysGuesses = JSON.stringify(guesses);
            const todaysMarkers = JSON.stringify(markers);

            dataManager.store('woordol_guesses', todaysGuesses);
            dataManager.store('woordol_markers', todaysMarkers);
        }
    };

    const keyPress = async (key) => {
        const pressed = key.toLowerCase();
        if (pressed === "enter" && !guesses[round].includes('')) {
            // Fetch words & validate
            const isValid = enterWordList.includes(guesses[round].join(''));

            if (isValid) {
                submit();
            } else {
                setIncorrect(round);
            }
        } else if (pressed === "backspace") {
            // Remove last letter from the field
            backspace();
        } else if (pressed !== "enter") {
            // Enter new letter into the field
            enter(pressed);
        }
    };

    const openShare = async () => {
        try {
            let shareMessage = '';
            shareMessage += `${new Date().toISOString().slice(0, 10).split('-').reverse().join('-')}\n`;
            Object.keys(markers).forEach((v, i) => {
                markers[i].forEach(m => {
                    if (m === 'green') shareMessage += '🟩';
                    else if (m === 'yellow') shareMessage += '🟨';
                    else shareMessage += '⬛';
                });
                shareMessage += '\n';
            });
            const result = await Share.share({
                message: shareMessage,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <Container>
            <TileContainer>
                {Object.values(guesses).map((word, i) => (
                    <TileRow key={i}>
                        {word.map((letter, ind) => (
                            <Tile key={ind+letter} style={utils.markerToColor(markers[i][ind], incorrect === i)}>
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
            <ModalContainer>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        setModalVisible(!modalVisible);
                    }}
                >
                    <ModalContainer>
                        <ModalView>
                            <ModalText>Hello World!</ModalText>
                            <View style={{ marginTop: 50 }}>
                                <Button onPress={openShare} title="Share" />
                            </View>
                            <Pressable onPress={() => setModalVisible(!modalVisible)}>
                                <ModalText>Hide Modal</ModalText>
                            </Pressable>
                        </ModalView>
                    </ModalContainer>
                </Modal>
            </ModalContainer>
        </Container>
    );
}

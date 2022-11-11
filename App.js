import { useState, useEffect } from 'react';
import { Text, Modal, View, Share } from "react-native";
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
import { Container, ModalContainer, ModalView, ModalText, ModalShareButtonView, ModalShareButton } from './styles/home';

export default function App() {
    const today = new Date().toISOString().slice(0, 10);
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
        const word = savedWordList.filter(w => w.use_on === today);
        if (word) setTodaysWord(word[0].word);
    }

    const setData = async () => {
        const savedGuesses = JSON.parse(await dataManager.get(`woordol_guesses_${today}`));
        if (savedGuesses) setGuesses(savedGuesses);

        const savedMarkers = JSON.parse(await dataManager.get(`woordol_markers_${today}`));
        if (savedMarkers) setMarkers(savedMarkers);

        const savedData = JSON.parse(await dataManager.get(`woordol_data_${today}`));
        if (savedData) {
            if (savedData.round) {
                setRound(savedData.round);
            }
            if (savedData.index) {
                setLetterIndex(savedData.index);
            }
        }

        if (savedMarkers && savedMarkers[savedData.round].every((guess) => guess === 'green')) setModalVisible(true);
    }

    const saveData = function (guesses, markers, data) {
        dataManager.store(`woordol_guesses_${today}`, guesses);
        dataManager.store(`woordol_markers_${today}`, markers);
        dataManager.store(`woordol_data_${today}`, data);
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
            const todaysGuesses = JSON.stringify(guesses);
            const todaysMarkers = JSON.stringify(newMarkers);
            const todaysData = JSON.stringify({
                day: today,
                word: todaysWord,
                round: round,
                index: letterIndex - 1,
            });

            saveData(todaysGuesses, todaysMarkers, todaysData);

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

        const todaysGuesses = JSON.stringify(guesses);
        const todaysMarkers = JSON.stringify(newMarkers);
        const todaysData = JSON.stringify({
            day: today,
            word: todaysWord,
            round: round + 1,
            index: 0,
        });

        saveData(todaysGuesses, todaysMarkers, todaysData);

        setMarkers(newMarkers);
        setRound(round + 1);
        setLetterIndex(0);
    };

    const backspace = () => {
        if (letterIndex !== 0) {
            const newGuesses = guesses;
            newGuesses[round][letterIndex - 1] = '';
            setGuesses(newGuesses);

            setLetterIndex(letterIndex - 1);

            const todaysGuesses = JSON.stringify(guesses);
            const todaysMarkers = JSON.stringify(markers);
            const todaysData = JSON.stringify({
                day: today,
                word: todaysWord,
                round: round,
                index: letterIndex - 1,
            });

            dataManager.store(`woordol_guesses_${today}`, todaysGuesses);
            dataManager.store(`woordol_markers_${today}`, todaysMarkers);
            dataManager.store(`woordol_data_${today}`, todaysData);
        }
    };

    const enter = (key) => {
        if (letterIndex < config.wordLength) {
            const newGuesses = guesses;
            newGuesses[round][letterIndex] = key.toLowerCase();
            setGuesses(newGuesses);

            setLetterIndex(letterIndex + 1);

            const todaysGuesses = JSON.stringify(guesses);
            const todaysMarkers = JSON.stringify(markers);
            const todaysData = JSON.stringify({
                day: today,
                word: todaysWord,
                round: round,
                index: letterIndex - 1,
            });

            dataManager.store(`woordol_guesses_${today}`, todaysGuesses);
            dataManager.store(`woordol_markers_${today}`, todaysMarkers);
            dataManager.store(`woordol_data_${today}`, todaysData);
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
            shareMessage += `Mijn Woordol van ${new Date().toISOString().slice(0, 10).split('-').reverse().join('-')}\n`;
            Object.keys(markers).forEach((v, i) => {
                markers[i].forEach(m => {
                    if (m === 'green') shareMessage += '🟩';
                    else if (m === 'yellow') shareMessage += '🟨';
                    else shareMessage += '⬛';
                });
                shareMessage += '\n';
            });
            await Share.share({
                message: shareMessage,
            });
        } catch (error) {

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
                        setModalVisible(!modalVisible);
                    }}
                >
                    <ModalContainer>
                        <ModalView>
                            <ModalText>
                                Jouw Woordol van {new Date().toISOString().slice(0, 10).split('-').reverse().join('-')}
                                <View>
                                    <Text>
                                        {Object.keys(markers).map((r, i) => (
                                            <View key={i}>
                                                {markers[i].map((marker, index) => (
                                                    <Text key={marker+index} style={{ fontSize: 25 }}>
                                                        {marker === 'green' ?
                                                            '🟩'
                                                            :
                                                            marker === 'yellow' ?
                                                            '🟨'
                                                            :
                                                            '⬛'
                                                        }
                                                    </Text>
                                                ))}
                                            </View>
                                        ))}
                                    </Text>
                                </View>
                            </ModalText>
                            <ModalShareButtonView>
                                <ModalShareButton onPress={openShare} title="Resultaten Delen" />
                            </ModalShareButtonView>
                        </ModalView>
                    </ModalContainer>
                </Modal>
            </ModalContainer>
        </Container>
    );
}

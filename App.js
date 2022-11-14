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
    const [ guesses, setGuesses ] = useState({
        0: Array.from({ length: 5 }).fill(''),
        1: Array.from({ length: 5 }).fill(''),
        2: Array.from({ length: 5 }).fill(''),
        3: Array.from({ length: 5 }).fill(''),
        4: Array.from({ length: 5 }).fill(''),
        5: Array.from({ length: 5 }).fill(''),
    });
    const [ markers, setMarkers ] = useState({
        0: Array.from({ length: 5 }).fill(''),
        1: Array.from({ length: 5 }).fill(''),
        2: Array.from({ length: 5 }).fill(''),
        3: Array.from({ length: 5 }).fill(''),
        4: Array.from({ length: 5 }).fill(''),
        5: Array.from({ length: 5 }).fill(''),
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
        // Haal het woord van vandaag op
        const savedWordList = JSON.parse(await dataManager.get('woordol_words'));
        const word = savedWordList.filter(w => w.use_on === today);
        if (word) setTodaysWord(word[0].word);
    }

    const setData = async () => {
        // Laad alle geraden woorden in
        const savedGuesses = JSON.parse(await dataManager.get(`woordol_guesses_${today}`));
        if (savedGuesses) setGuesses(savedGuesses);

        // Laad alle markers in
        const savedMarkers = JSON.parse(await dataManager.get(`woordol_markers_${today}`));
        if (savedMarkers) setMarkers(savedMarkers);

        // Laad overige data in
        const savedData = JSON.parse(await dataManager.get(`woordol_data_${today}`));
        if (!savedData) return;
        if (savedData.round) setRound(savedData.round);
        if (savedData.index) setLetterIndex(savedData.index);
        if (!savedData.round) return;
        if (savedMarkers && savedMarkers[savedData.round].every((guess) => guess === 'green') || savedData.round === 5) {
            setModalVisible(true);
        }
    }

    const saveData = function (guesses, markers, data) {
        // Sla data op
        dataManager.store(`woordol_guesses_${today}`, guesses);
        dataManager.store(`woordol_markers_${today}`, markers);
        dataManager.store(`woordol_data_${today}`, data);
    }

    const submit = () => {
        const newMarkers = { ...markers };
        const correctWord = todaysWord.split('');
        const notMarked = [];

        // Controleer of de letter correct is
        correctWord.forEach((letter, i) => {
            const guessedLetter = guesses[round][i];

            if (guessedLetter === letter) {
                newMarkers[round][i] = 'green';
                correctWord[i] = '';
            } else notMarked.push(i);
        });

        // Controleer of alle letters groen zijn
        if (newMarkers[round].every((guess) => guess === 'green')) {
            saveData(
                JSON.stringify(guesses),
                JSON.stringify(newMarkers),
                JSON.stringify({
                    day: today,
                    word: todaysWord,
                    round: round,
                    index: letterIndex - 1,
                }),
            );

            setModalVisible(true);
            setMarkers(newMarkers);
            return;
        }

        // Controleer alle letters op de verkeerde plek
        if (notMarked.length) {
            notMarked.forEach((i) => {
                const guessedLetter = guesses[round][i];
                const position = correctWord.indexOf(guessedLetter);

                // Controleer of de letter in het woord zit
                if (correctWord.includes(guessedLetter) && position !== i) {
                    newMarkers[round][i] = 'yellow';
                    correctWord[position] = '';
                } else newMarkers[round][i] = "grey";
          });
        }

        // Als dit de laatste ronde is, laat het eindscherm zien, anders naar de volgende ronde
        if (round === 5) {
            setModalVisible(true);
            saveData(
                JSON.stringify(guesses),
                JSON.stringify(newMarkers),
                JSON.stringify({
                    day: today,
                    word: todaysWord,
                    round: round,
                    index: 0,
                }),
            );
        } else {
            setMarkers(newMarkers);
            setRound(round + 1);
            setLetterIndex(0);

            saveData(
                JSON.stringify(guesses),
                JSON.stringify(newMarkers),
                JSON.stringify({
                    day: today,
                    word: todaysWord,
                    round: round + 1,
                    index: 0,
                }),
            );
        }
    };

    const keyPress = async (key) => {
        const pressed = key.toLowerCase();
        if (pressed === "enter" && !guesses[round].includes('')) {
            // Fetch words & validate
            const isValid = enterWordList.includes(guesses[round].join(''));

            if (isValid) submit();
            else setIncorrect(round);
        } else if (pressed === "backspace") {
            // Controlleer of de letter niet 0 is
            if (letterIndex !== 0) {
                // Verwijder de laatste letter
                const newGuesses = guesses;
                newGuesses[round][letterIndex - 1] = '';
                setGuesses(newGuesses);

                setLetterIndex(letterIndex - 1);
    
                saveData(
                    JSON.stringify(guesses),
                    JSON.stringify(markers),
                    JSON.stringify({
                        day: today,
                        word: todaysWord,
                        round: round,
                        index: letterIndex - 1,
                    }),
                );
            }
        } else if (pressed !== "enter") {
            // Controlleer of er al 5 letters zijn toegevoegd
            if (letterIndex < 5) {
                // Voeg een nieuwe letter toe
                const newGuesses = guesses;
                newGuesses[round][letterIndex] = key.toLowerCase();
                setGuesses(newGuesses);
    
                setLetterIndex(letterIndex + 1);

                saveData(
                    JSON.stringify(guesses),
                    JSON.stringify(markers),
                    JSON.stringify({
                        day: today,
                        word: todaysWord,
                        round: round,
                        index: letterIndex + 1,
                    }),
                );
            }
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
                                    {Object.keys(markers).map((r, i) => (
                                        <Text key={i} style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
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
                                        </Text>
                                    ))}
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

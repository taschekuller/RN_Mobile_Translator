import { StyleSheet, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { Alert } from 'react-native';

export default function Input({ placeholder, value, onChangeText, onSubmitEditing }) {
    const [recording, setRecording] = useState(null);
    const [message, setMessage] = useState('');

    async function startRecording() {
        try {
            console.log('Requesting permissions..');
            Alert.alert('Permission Required', 'This app needs access to your microphone to record audio.')
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            console.log('Starting recording..');
            const { recording } = await Audio.Recording.createAsync(
                Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
            );
            setRecording(recording);
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        console.log('Stopping recording..');
        setRecording(null);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log('Recording stopped and stored at', uri);

        // Placeholder: Convert audio to text or handle the audio file URI
        setMessage('Recording finished. Audio file saved at: ' + uri);
    }

    const speak = () => {
        const thingToSay = '1';
        Speech.speak(thingToSay);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.textInput}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                onSubmitEditing={onSubmitEditing}
            />
            <FontAwesome
                name="microphone"
                style={styles.micIcon}
                size={28}
                color={recording ? '#ff1612' : '#010101'}
                onPress={recording ? stopRecording : startRecording} // Corrected ternary logic
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        backgroundColor: '#d6d4d4',
        padding: 10,
        borderRadius: 20,
        shadowColor: '#d6d4d4',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 1,
    },
    micIcon: {
        position: 'absolute',
        right: 10,
        zIndex: 10,
        padding: 10,
    },
});
import React from 'react';
import { TextInput, View, Text, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import styles from "../styles/styles";
import _ from 'lodash';
import axios from 'react-native-axios';
import { TRANSLATE_TEXT } from '../../api';

interface TextInputFieldProps {
    toLanguage: string;
    fromLanguage: string;
}



export default function TextInputField({ toLanguage, fromLanguage }: TextInputFieldProps) {
    const [response, setResponse] = React.useState<string>('');

    const debouncedHandleSendMessage = _.debounce(async (term: string) => {
        if (term.length > 0 && term.trim()) {
            const params = {
                q: term,
                source: fromLanguage,
                target: toLanguage,
                format: 'text',
            };
            try {
                // change to TRANSLATE_TEXT_URL
                await axios.post(TRANSLATE_TEXT, params)
                    .then(response => {
                        setResponse(response.data.translatedText)
                    })
            } catch (error) {
                console.error('Error during translation of text:', error);
            }
        } else {
            setResponse("")
        }
    }, 500);

    const handleInputChange = (text: string) => {
        debouncedHandleSendMessage(text);
    };

    const languageNames: { [key: string]: string } = {
        tr: 'Türkçe',
        en: 'English',
    };

    const handleTextClear = () => {
        setResponse("") //TODO for input text clear
    }

    return (
        <View style={styles.translateFieldContainer}>
            <View style={{ ...styles.textInputFieldTopBar, borderRadius: 20, padding: 12, borderBottomWidth: 0, marginBottom: 0, minWidth: "100%", }}>
                <Text>{languageNames[fromLanguage] ? languageNames[fromLanguage] : "Dil Seçiniz"}</Text>
                <Pressable onPress={handleTextClear}>
                    <AntDesign name="close" size={24} color="gray" />
                </Pressable>
            </View>

            <TextInput
                style={{ ...styles.textInputField, borderRadius: 20, padding: 12 }}
                textAlignVertical="top"
                multiline={true}
                placeholder='Çeviri yapmak istediğiniz metni giriniz'
                onChangeText={handleInputChange} />
            <View style={styles.translatedTextContainer}>
                <View style={{ ...styles.textInputFieldTopBar }}>
                    <Text style={{ color: "white" }}>{languageNames[toLanguage] ? languageNames[toLanguage] : "Dil Seçiniz"}</Text>
                </View>
                <ScrollView
                    style={{ padding: 4 }}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <TouchableOpacity>
                        <Text style={{ ...styles.translatedText, color: "#f1f1f1" }}>{response ? response : ""}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>

    )
}
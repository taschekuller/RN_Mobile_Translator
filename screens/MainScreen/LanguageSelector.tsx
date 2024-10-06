import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import styles from "../styles/styles"
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';

interface LanguageSelectionProps {
    fromLanguage: string;
    toLanguage: string;
    handleLanguageExchange: () => void;
}

export default function LanguageSelector({ fromLanguage, toLanguage, handleLanguageExchange }: LanguageSelectionProps) {
    const [isFromLanguagePickerModalVisible, setIsFromLanguagePickerModalVisible] = useState(false);
    const [isToLanguagePickerModalVisible, setIsToLanguagePickerModalVisible] = useState(false);
    const [initialLanguages, setInitialLanguages] = useState([
        { id: 0, name: 'İngilizce', value: "en" },
        { id: 1, name: 'Türkçe', value: "tr" },
    ]);
    const [languages, setLanguages] = useState({
        fromLanguage: "en",
        toLanguage: "tr"
    });

    const languageNames: { [key: string]: string } = {
        tr: 'Türkçe',
        en: 'English',
    };

    const handleFromLanguageChange = (itemValue) => {
        if (itemValue !== languages.toLanguage) {
            setLanguages((prevLanguages) => ({
                ...prevLanguages,
                fromLanguage: itemValue
            }));
        }
    };

    const handleToLanguageChange = (itemValue) => {
        if (itemValue !== languages.fromLanguage && itemValue !== "xx") {
            setLanguages((prevLanguages) => ({
                ...prevLanguages,
                toLanguage: itemValue
            }));
        }
    };

    const toggleisFromLanguagePickerModalVisible = () => {
        isFromLanguagePickerModalVisible ? setIsFromLanguagePickerModalVisible(false) : setIsFromLanguagePickerModalVisible(true);
    }

    const toggleisToLanguagePickerModalVisible = () => {
        isToLanguagePickerModalVisible ? setIsToLanguagePickerModalVisible(false) : setIsToLanguagePickerModalVisible(true);
    }

    return (
        <View style={styles.languageChangerContainer}>
            {/* FROM LANGUAGE MODAL */}
            <Modal visible={isFromLanguagePickerModalVisible} animationType="slide">
                <View style={{ ...styles.languageChangerModalContainer }}>
                    <Text style={{ ...styles.mainHeaderText, textAlign: "center", fontSize: 24 }}>From</Text>
                    <Picker
                        selectedValue={fromLanguage}
                        onValueChange={handleFromLanguageChange}>
                        {initialLanguages.map((language) => (
                            <Picker.Item key={language.id} label={language.name} value={language.value} />
                        ))}
                    </Picker>
                </View>
                <View style={styles.languageChangerButtonContainer}>
                    <Pressable
                        onPress={toggleisFromLanguagePickerModalVisible}
                        style={{ ...styles.languageChangerButton, backgroundColor: "white" }}>
                        <Text style={{ ...styles.languageButtonText, color: "#010101" }}>Kapat</Text>
                    </Pressable>
                    <Pressable
                        onPress={toggleisFromLanguagePickerModalVisible}
                        style={{ ...styles.languageChangerButton, backgroundColor: "#010101" }}>
                        <Text style={styles.languageButtonText}>Onayla</Text>
                    </Pressable>
                </View>
            </Modal>

            {/* TO LANGUAGE MODAL */}
            <Modal visible={isToLanguagePickerModalVisible} animationType="slide">
                <View style={styles.languageChangerModalContainer}>
                    <Text style={{ ...styles.mainHeaderText, textAlign: "center", fontSize: 24 }}>To</Text>
                    <Picker
                        selectedValue={toLanguage}
                        onValueChange={handleToLanguageChange}>
                        {initialLanguages.map((language) => (
                            <Picker.Item key={language.id} label={language.name} value={language.value} />
                        ))}
                    </Picker>
                </View>
                <View style={styles.languageChangerButtonContainer}>
                    <Pressable
                        onPress={toggleisToLanguagePickerModalVisible}
                        style={{ ...styles.languageChangerButton, backgroundColor: "white" }}>
                        <Text style={{ ...styles.languageButtonText, color: "#010101" }}>Kapat</Text>
                    </Pressable>
                    <Pressable
                        onPress={toggleisToLanguagePickerModalVisible}
                        style={{ ...styles.languageChangerButton, backgroundColor: "black" }}>
                        <Text style={styles.languageButtonText}>Onayla</Text>
                    </Pressable>
                </View>
            </Modal>

            <Pressable
                style={{ ...styles.languageChangerInput, backgroundColor: "#f1f1f1" }}
                onPress={() => setIsFromLanguagePickerModalVisible(true)}>
                <Text style={{ ...styles.mainHeaderText, fontSize: 14 }}>{languageNames[fromLanguage] ? languageNames[fromLanguage] : "Dil Seçiniz"}</Text>
                <AntDesign name="caretdown" size={16} color="black" />
            </Pressable>

            <Pressable onPress={handleLanguageExchange}>
                <FontAwesome name="exchange" size={24} color="black" />
            </Pressable>

            <Pressable
                style={{ ...styles.languageChangerInput, backgroundColor: "#2A36AF" }}
                onPress={() => setIsToLanguagePickerModalVisible(true)}>
                <Text style={{ ...styles.mainHeaderText, color: "#f1f1f1", fontSize: 14 }}>{languageNames[toLanguage] ? languageNames[toLanguage] : "Dil Seçiniz"}</Text>
                <AntDesign name="caretdown" size={16} color="#f1f1f1" />
            </Pressable>
        </View>
    )

}
import React, { useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, SafeAreaView, Keyboard, TouchableWithoutFeedback, Image, ScrollView } from 'react-native';
import { useState } from 'react';
import TopBar from './TopBar';
import InputTypes from '../modals/inputTypes';
import LanguageSelection from './LanguageSelector';
import TextInputField from './TextInputField';
import PreviewViewer from './PreviewViewer';
import SplashScreen from './SplashScreen';

export default function MainScreen() {
    useEffect(() => {
        setTimeout(() => {
            setIsSplashScreenVisible(false);
        }, 3000);
    })

    const [isSettingVisible, setIsSettingVisible] = useState<boolean>(false);
    const [fromLanguage, setFromLanguage] = useState<string>('tr');
    const [toLanguage, setToLanguage] = useState<string>('en');
    const [image, setImage] = useState<string>('');
    const [downloadedOutputUri, setDownloadedOutputUri] = useState<string>('');
    const [downloadedOutputFileUri, setDownloadedOutputFileUri] = useState<string>('');
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [isDownloadedOutputFile, setIsDownloadedOutputFile] = useState<boolean>(false);
    const [getUploadProgress, setGetUploadProgress] = useState<boolean>(false);
    const [isSplashScreenVisible, setIsSplashScreenVisible] = useState<boolean>(true);

    const handleDownloadedOutputUriChange = (downloadedOutputUri) => {
        setDownloadedOutputUri(downloadedOutputUri);
        setIsSettingVisible(false);
    }

    const handleDownloadedOutputFileUri = (downloadedOutputFileUri) => {
        setDownloadedOutputFileUri(downloadedOutputFileUri);
    }

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    const openModalWithImage = (uri: string) => {
        setDownloadedOutputUri(uri);
        setIsModalVisible(true);
    };

    const handleLanguageExchange = () => {
        const temp = fromLanguage;
        setFromLanguage(toLanguage);
        setToLanguage(temp);
    }

    const handleFileState = (isDownloadedOutputFile) => {
        setIsDownloadedOutputFile(isDownloadedOutputFile);
    }

    const handleUploadProgress = (getUploadProgress) => {
        setGetUploadProgress(getUploadProgress);
    }

    return (
        isSplashScreenVisible ? <SplashScreen /> :
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 4 : 0}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <View>
                            <TopBar setIsSettingVisible={setIsSettingVisible} />
                            <InputTypes
                                toLanguage={toLanguage} fromLanguage={fromLanguage}
                                isSettingVisible={isSettingVisible} setIsSettingVisible={setIsSettingVisible}
                                image={image} setImage={setImage}
                                handleDownloadedOutputUriChange={handleDownloadedOutputUriChange}
                                handleDownloadedOutputFileUri={handleDownloadedOutputFileUri}
                                handleFileState={handleFileState}
                                handleUploadProgress={handleUploadProgress}
                                // setGetUploadProgress={setGetUploadProgress}
                                getUploadProgress={getUploadProgress} />
                            <LanguageSelection toLanguage={toLanguage} fromLanguage={fromLanguage} handleLanguageExchange={handleLanguageExchange} />
                            {downloadedOutputUri ?
                                <PreviewViewer
                                    downloadedOutputUri={downloadedOutputUri}
                                    openModalWithImage={openModalWithImage} handleModalClose={handleModalClose}
                                    isModalVisible={isModalVisible}
                                    image={image}
                                    downloadedOutputFileUri={downloadedOutputFileUri}
                                    isDownloadedOutputFile={isDownloadedOutputFile} />
                                : <TextInputField toLanguage={toLanguage} fromLanguage={fromLanguage} />}
                        </View>

                    </SafeAreaView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
    )
}
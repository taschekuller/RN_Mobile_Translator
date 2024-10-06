import React from 'react'
import { Alert, Modal, Pressable, Text, View } from 'react-native'
import styles from '../styles/styles'
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { translateFile } from '../../api/index';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import Constants from 'expo-constants';
import LottieView from 'lottie-react-native';




interface InputTypesProps {
    toLanguage: string;
    fromLanguage: string;
    isSettingVisible: boolean;
    setIsSettingVisible: (visible: boolean) => void;
    image: string;
    setImage: (image: string) => void;
    handleDownloadedOutputUriChange: (downloadedOutputUri: string) => void;
    setDownloadedOutputFileUri: (downloadedOutputFileUri: string) => void;
    handleFileState: (isDownloadedOutputFile: boolean) => void;
    handleUploadProgress: (getUploadProgress: boolean) => void;
    getUploadProgress: boolean;
}

export default function IsSettings({ toLanguage, fromLanguage,
    isSettingVisible, setIsSettingVisible,
    image, setImage,
    handleDownloadedOutputUriChange,
    setDownloadedOutputFileUri,
    handleFileState,
    handleUploadProgress,
    getUploadProgress }: InputTypesProps) {

    const [isCameraVisible, setIsCameraVisible] = React.useState(false);
    const [downloadProgress, setDownloadProgress] = React.useState(0);

    const { BASE_URL } = Constants.expoConfig.extra;

    const openCamera = () => {
        setIsCameraVisible(true);
    }

    const getFormattedDate = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        // Example format: 20240913_101530 (YYYYMMDD_HHMMSS)
        return `${year}${month}${day}_${hours}${minutes}${seconds}`;
    };

    const uploadImage = async (result) => {
        handleFileState(false);
        handleUploadProgress(true);
        if (result) {
            try {
                const imageUri = result
                setImage(imageUri)
                const uploadResponse = await translateFile(imageUri, fromLanguage, toLanguage)


                const responseData = JSON.parse(uploadResponse.body)
                const rawTranslatedUrl = responseData.translatedFileUrl
                const translatedImageUrl = `${BASE_URL.replace(/\/$/, '')}/${rawTranslatedUrl.replace(/^\//, '')}`;

                const fileName = `translatedImage_${getFormattedDate()}.jpg`;


                const downloadImageInstance = translatedImageUrl ? FileSystem.createDownloadResumable(
                    translatedImageUrl,
                    FileSystem.documentDirectory + fileName,
                    {},

                    (downloadProgress) => {
                        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
                        setDownloadProgress(progress)
                    }
                ) : null

                try {
                    const { uri } = await downloadImageInstance.downloadAsync()
                    handleDownloadedOutputUriChange(uri)
                    setIsSettingVisible(false);
                    handleUploadProgress(false);
                } catch {
                    Alert.alert("Error while downloading translated image")
                }
            } catch {
                Alert.alert("Error while uploading image to be translated")
            }
        }
    }

    const uploadFile = async (result) => {
        handleUploadProgress(true);
        if (result) {
            try {
                const fileUri = result
                const uploadResponse = await translateFile(fileUri, fromLanguage, toLanguage)


                const responseData = JSON.parse(uploadResponse.body)
                const rawTranslatedUrl = responseData.translatedFileUrl
                const translatedFileUrl = `${BASE_URL.replace(/\/$/, '')}/${rawTranslatedUrl.replace(/^\//, '')}`;


                //TODO : Commented section is for creating an instance of downloadable file in case, it is needed to utilize canceling and pausing download operations.
                // const downloadFileInstance = translatedFileUrl ? FileSystem.createDownloadResumable(
                //     translatedFileUrl,
                //     FileSystem.documentDirectory + "translatedFile.docx",
                //     {},

                //     (downloadProgress) => {
                //         const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
                //         setDownloadProgress(progress)

                //     }
                // ) : null
                // const { uri } = await downloadFileInstance.downloadAsync()
                try {
                    const { uri } = await FileSystem.downloadAsync(
                        translatedFileUrl,
                        FileSystem.documentDirectory + "translatedFile.docx"
                    );
                    handleDownloadedOutputUriChange(uri)
                    setDownloadedOutputFileUri(uri)
                    setIsSettingVisible(false);
                    handleFileState(true);
                    handleUploadProgress(false);
                }catch{
                    Alert.alert("Error while downloading translated file")
                }
                
            } catch {
                Alert.alert("Error while uploading file")
            }
        }
    }

    const takePictureAndUpload = async () => {
        setIsCameraVisible(true);
        if (isCameraVisible) {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            const cameraResultUri = result.assets[0].uri
            uploadImage(cameraResultUri)
        }else{
            console.log("Camera is not visible")
        }
    }

    const pickImageFromGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            console.log('Sorry, we need media library permissions to make this work!')
            Alert.alert('Sorry, we need media library permissions to make this work!');
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        const imageSize = result.assets[0].fileSize
        const maxImageSize = 10 * 1024 * 1024;
        const isImageSizeValid = imageSize < maxImageSize

        if (result && isImageSizeValid) {
            const galleryResultUri = result.assets[0].uri
            uploadImage(galleryResultUri)
        } else {
            Alert.alert("Görsel boyutu 10MB'dan büyük olamaz.")
        }
    }

    const pickFileFromFolder = async () => {
        let result = await DocumentPicker.getDocumentAsync();
        const fileSize = result.assets[0].size
        const maxFileSize = 10 * 1024 * 1024;
        const isFileSizeValid = fileSize < maxFileSize



        if (result && isFileSizeValid) {
            const fileUri = result.assets[0].uri
            uploadFile(fileUri)
        } else {
            Alert.alert("Dosya boyutu 10MB'dan büyük olamaz.")
        }
    }

    // const handleOpenCameraButtonClick = () => {
    //     setIsCameraVisible(true);
    //     takePictureAndUpload()
    // }

    return (
        <Modal visible={isSettingVisible} onRequestClose={() => setIsSettingVisible(false)} animationType='slide'>
            {getUploadProgress ? <View style={{ backgroundColor: "#f1f1f1", flex: 1, justifyContent: "center", alignItems: "center", zIndex: 2 }}>
                <Text>File is uploading...</Text>
                <LottieView style={{ height: 100, width: 100 }} source={require('../../assets/loader.json')} autoPlay loop />
            </View> : null}

            <View style={styles.isSettingModalContainer}>
                <Pressable
                    onPress={() => setIsSettingVisible(false)}
                    style={styles.inputTypeCloseBtn}>
                    <AntDesign name="close" size={48} color="black" />
                </Pressable>
                <View style={styles.inputTypeCardContainer}>
                    <Pressable
                        onPress={() => { handleDownloadedOutputUriChange('') }}
                        style={{ ...styles.inputTypeCard }}>
                        <Ionicons name="text-outline" size={24} color="black" />
                        <Text>Yazı</Text>
                    </Pressable>

                    <Pressable onPress={() => {
                        openCamera(); 
                        takePictureAndUpload()
                        }} style={{ ...styles.inputTypeCard, marginLeft: "2%" }}>
                        <Ionicons name="camera-outline" size={24} color="black" />
                        <Text>Kamera</Text>
                    </Pressable>
                    <Pressable
                        onPress={pickFileFromFolder}
                        style={{ ...styles.inputTypeCard }}>
                        <MaterialCommunityIcons name="file-outline" size={24} color="black" />
                        <Text>Dosya</Text>
                    </Pressable>
                    <Pressable
                        onPress={pickImageFromGallery}
                        style={{ ...styles.inputTypeCard, marginLeft: "2%" }}>
                        <FontAwesome name="photo" size={24} color="black" />
                        <Text>Fotoğraf</Text>
                    </Pressable>
                </View>
            </View>



        </Modal >
    )
}
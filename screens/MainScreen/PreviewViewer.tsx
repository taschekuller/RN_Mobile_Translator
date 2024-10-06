import React from 'react';
import ImageViewer from 'react-native-image-zoom-viewer';
import { View, Modal, Image, Pressable, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import styles from '../styles/styles';
import { Share } from 'react-native';

interface PreviewViewerProps {
    downloadedOutputUri: string;
    downloadedOutputFileUri: string;
    handleModalClose?: () => void;
    openModalWithImage?: (uri: string) => void;
    isModalVisible?: boolean;
    image: string;
    isDownloadedOutputFile: boolean;
}

const PreviewViewer: React.FC<PreviewViewerProps> = ({
    downloadedOutputUri,
    downloadedOutputFileUri,
    openModalWithImage,
    handleModalClose,
    isModalVisible,
    image,
    isDownloadedOutputFile
}) => {
    const images = [
        { url: downloadedOutputUri },  // First image
        { url: image }  // Second image
    ];

    const onShare = async () => {
        try {
            const result = await Share.share({
                url: downloadedOutputFileUri, //TODO platform ile android || ios
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // TODO Good for different scenarios -> shared with activity type of result.activityType
                    // console.log('result.activityType :>> ', result.activityType);
                } else {
                    // shared
                    // console.log('shared :>> ');
                }
            } else if (result.action === Share.dismissedAction) {
                // console.log('dismissed :>> ');
            }
        } catch (error) {
            console.log("Error occured during onShare :>> ", error);
            alert(error.message);
        }
    }

    const isSomething = !!(downloadedOutputUri && !isDownloadedOutputFile)
    return (
        <View style={{ flex: 1, marginTop: 48, marginHorizontal: 8 }} >
            {isSomething && (
                <View>
                    <Modal
                        visible={isModalVisible}>
                        <Pressable
                            onPress={() => handleModalClose()}
                            style={styles.inputTypeCloseBtn}>
                            <AntDesign name="close" size={36} color="white" />
                        </Pressable>
                        <ImageViewer imageUrls={images} />
                    </Modal>
                    <Pressable onPress={() => openModalWithImage(downloadedOutputUri)}>
                        <Image style={{ height: 400, width: "100%", borderRadius: 20 }} source={{ uri: downloadedOutputUri }} />
                    </Pressable>
                </View>
            )}
            {isDownloadedOutputFile && (
                <Pressable style={{ justifyContent: "center", alignItems: "center" }} onPress={onShare}>
                    <View style={{ marginTop: 200, height: 200, width: "100%", borderRadius: 10, borderWidth: 0.25, borderColor: "#010101", backgroundColor: "#f1f1f1", justifyContent: "center", alignItems: "center" }}>
                        <Text>Dosyanız başarılı bir şekilde çevrildi.</Text>
                        <Text style={{ ...styles.downloadFileButton, height: 48, width: "50%", padding: 14, textAlign: "center", marginTop: 12 }}>Kaydet & Paylaş</Text>
                    </View>
                </Pressable>
            )}

        </View>
    )
}

export default PreviewViewer;
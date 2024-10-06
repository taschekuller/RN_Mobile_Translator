import React from 'react'
import { View, Image, StyleSheet, Text } from 'react-native'
import LottieView from 'lottie-react-native'

export default function SplashScreen() {
    return (
        <View style={styles.container}>
            <LottieView style={{ height: 150, width: 150 }} source={require("../../assets/splashLoader.json")} autoPlay loop />
            <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Image style={{ height: 100, width: 140 }} source={require("../../assets/logo.jpg")} />
                <Text style={{ fontSize: 14, fontWeight: 600 }}>Translator</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: 'white'
    }
})
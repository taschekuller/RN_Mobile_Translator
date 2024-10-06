import React from 'react'
import { View, Text, Image, Pressable, } from 'react-native'
import styles from '../styles/styles'
import Entypo from '@expo/vector-icons/Entypo';

interface TopBarProps {
    setIsSettingVisible: (isVisible: boolean) => void;
}

export default function TopBar({ setIsSettingVisible }: TopBarProps) {
    return (
        <View style={styles.topBarHeaderContainer}>
            <Pressable>
                <Text style={{ ...styles.mainHeaderText }}>Translator</Text>
            </Pressable>
            <Pressable style={{ padding: 8 }} onPress={() => setIsSettingVisible(true)}>
                <Entypo name="dots-three-horizontal" size={24} color="gray" />
            </Pressable>
        </View>
    )
}


import { View, Pressable, Text, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function ButtonUI({title, onPress}) {
    return (
        <View style={styles.container}>
            <Pressable style={styles.button} onPress={onPress}>
                <AntDesign name="arrowup" size={24} color="black" />
            </Pressable>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex:0.25,
        
    }, 
    button: {
        padding: 10,
        backgroundColor: '#f1f1f1',
        borderRadius: 100,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
    },
    text: {
        color: '#010101',
        textAlign: 'center',
    },
})
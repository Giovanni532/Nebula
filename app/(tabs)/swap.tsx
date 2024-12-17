import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import Colors from '@/constants/Colors';

export default function SwapScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Swap</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
        padding: 20,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 20 : 60,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.dark.text,
    },
}); 
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

export default function WhaleTrackerScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Whale Tracker</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.dark.text,
    },
}); 
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedProps,
    useSharedValue,
    withTiming,
    runOnJS
} from 'react-native-reanimated';
import Colors from '@/constants/Colors';

const AnimatedText = Animated.createAnimatedComponent(Text);

type AnimatedAmountProps = {
    value: number;
    prefix?: string;
    suffix?: string;
    duration?: number;
    style?: any;
    precision?: number;
};

export function AnimatedAmount({
    value,
    prefix = '',
    suffix = '',
    duration = 1500,
    style,
    precision = 2
}: AnimatedAmountProps) {
    const animatedValue = useSharedValue(0);
    const [displayValue, setDisplayValue] = React.useState('0');

    useEffect(() => {
        animatedValue.value = withTiming(value, {
            duration: duration,
        });
    }, [value]);

    const animatedProps = useAnimatedProps(() => {
        const currentValue = animatedValue.value;
        runOnJS(setDisplayValue)(currentValue.toFixed(precision));
        return {};
    });

    return (
        <View style={styles.container}>
            <AnimatedText style={[styles.text, style]} animatedProps={animatedProps}>
                {prefix}{displayValue}{suffix}
            </AnimatedText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    text: {
        color: Colors.dark.text,
        fontSize: 36,
        fontWeight: 'bold',
    },
}); 
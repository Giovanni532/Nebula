import 'react-native-get-random-values';
import { Buffer } from "buffer";

// Polyfill Buffer
global.Buffer = Buffer;

if (typeof crypto === 'undefined') {
    (global as any).crypto = {
        getRandomValues: function (array: Uint8Array) {
            return array;
        }
    };
}
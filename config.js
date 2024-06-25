// config.js
import { Platform } from 'react-native';

const BASE_URL = Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000';
console.log(`BASE_URL: ${BASE_URL}`);

export default BASE_URL;

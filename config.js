// config.js
import { Platform } from 'react-native';
import axios from 'axios';

// 10.8.0.83 

const BASE_URL = Platform.OS === 'ios' ? 'http://10.0.203.87:3000' : 'http://10.0.2.2:3000';
console.log(`BASE_URL: ${BASE_URL}`);

axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response) {
        console.log('Response error:', error.response.data);
        console.log('Status:', error.response.status);
        console.log('Headers:', error.response.headers);
      } else if (error.request) {
        console.log('Request error:', error.request);
      } else {
        console.log('Error message:', error.message);
      }
      return Promise.reject(error);
    }
  );
  

export default BASE_URL;

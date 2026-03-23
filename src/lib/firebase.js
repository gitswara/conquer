import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCVQNLhfIhTzI5JknYnDMY9odpkFgqj3Fs',
  authDomain: 'conquer-271e5.firebaseapp.com',
  projectId: 'conquer-271e5',
  storageBucket: 'conquer-271e5.firebasestorage.app',
  messagingSenderId: '148445756493',
  appId: '1:148445756493:web:14c6214f01edd883ecb004',
  measurementId: 'G-NSLZ8414S5'
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;

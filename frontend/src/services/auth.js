import { 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../firebase/config';
import api from './api';

export const loginUser = async (email, password) => {
  try {
    // 1. Login com Firebase Auth diretamente
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    
    // 2. Verifica token no backend para dados adicionais
    const response = await api.post('/auth/verify-token', { idToken });
    
    return {
      user: response.data.user,
      token: idToken
    };
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  await signOut(auth);
};
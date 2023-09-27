import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase';

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        return user;
    } catch (error) {
        console.error("Error signing in with Google", error);
        throw error;
    }
};

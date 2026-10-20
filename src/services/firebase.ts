import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

// Google Auth Provider with Google Drive least-privilege scope
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/drive.file');
googleProvider.setCustomParameters({ prompt: 'select_account' });

// In-memory access token cache (NEVER in localStorage/sessionStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuthListener = (
  onSuccess?: (user: User, token: string | null) => void,
  onLoggedOut?: () => void
) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      if (onSuccess) onSuccess(user, cachedAccessToken);
    } else {
      cachedAccessToken = null;
      if (onLoggedOut) onLoggedOut();
    }
  });
};

export const signInWithGoogle = async (): Promise<{ user: User; accessToken: string | null }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    cachedAccessToken = credential?.accessToken || null;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Google Sign-in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getCachedAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const setCachedAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const firebaseLogout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

export { signInWithEmailAndPassword, createUserWithEmailAndPassword };

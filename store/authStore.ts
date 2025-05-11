import { create } from 'zustand';
import { User } from 'firebase/auth';
import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  checkAuth: () => Promise<User>;
  logout: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  signInWithEmail: async (email: string, password: string) => {
    try {
      set({ error: null });
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      set({ error: 'Invalid email or password' });
      throw error;
    }
  },

  signInWithGoogle: async () => {
    try {
      set({ error: null });
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      set({ error: 'Error signing in with Google' });
      throw error;
    }
  },

  checkAuth: async () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          set({ user });
          unsubscribe();
          resolve(user);
        } else {
          unsubscribe();
          reject(new Error('No user found'));
        }
      });
    });
  },

  logout: async () => {
    try {
      set({ error: null });
      await signOut(auth);
    } catch (error) {
      set({ error: 'Error signing out' });
      throw error;
    }
  },

  setError: (error: string | null) => set({ error }),
}));

// Subscribe to auth state changes
onAuthStateChanged(auth, (user) => {
  useAuthStore.setState({ user, loading: false });
}); 
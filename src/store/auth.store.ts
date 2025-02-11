import { create } from "zustand";
import { auth, AuthService } from "../api/auth";
import { UserCredential } from "firebase/auth";

interface AuthState {
  token: string | null;
  expiresAt: number | null;
  signIn: (email: string, password: string) => Promise<string>;
  validateToken: () => Promise<'IS_AUTH' | 'ISNOT_AUTH'>;
  isUserEntered: boolean;
  setUser: (state: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  expiresAt: Number(localStorage.getItem('expiresAt')) || null,
  signIn: async (email: string, password: string): Promise<'OK'> => {
    const userCredential: UserCredential = await AuthService.signIn(email, password);
    const idToken = await userCredential.user.getIdToken();
    const expiresIn = 3600 * 24 * 7; // 7 days in seconds
    const expiresAt = Date.now() + expiresIn * 1000;
    
    localStorage.setItem('token', idToken);
    localStorage.setItem('expiresAt', expiresAt.toString());
    
    set({ token: idToken, expiresAt });
    return 'OK';
  },
  validateToken: async () => {
    return new Promise(res => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          res('IS_AUTH');
        } else {
          res('ISNOT_AUTH');
        }
      })
    });
  },
  isUserEntered: false,
  setUser: (userState) => {
    set(state => {
      return ({...state, isUserEntered: userState});
    })
  }
}));
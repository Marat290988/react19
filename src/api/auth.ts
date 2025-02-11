import { getAuth, signInWithCustomToken, signInWithEmailAndPassword } from "firebase/auth";
import { app, } from "./firebaseConfig";

export const auth = getAuth(app);

export const AuthService = {
  signIn: async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  },
  signWithToken: async (token: string) => {
    return signInWithCustomToken(auth, token);
  }
}
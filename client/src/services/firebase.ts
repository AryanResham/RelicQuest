import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD-iMqN2qwoPSHxokFafdQejp0pD43enM0",
  authDomain: "relicquest-784a9.firebaseapp.com",
  projectId: "relicquest-784a9",
  storageBucket: "relicquest-784a9.firebasestorage.app",
  messagingSenderId: "843871598347",
  appId: "1:843871598347:web:86b42c3c4d2399a080d40e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;
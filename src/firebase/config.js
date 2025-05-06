// Firebase yapılandırması
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyA-4l49UOG-1XUWn6mLi2ki0x_Jth4y1MQ",
  authDomain: "esans-talep-sistemi.firebaseapp.com",
  projectId: "esans-talep-sistemi",
  storageBucket: "esans-talep-sistemi.appspot.com",
  messagingSenderId: "810199839185",
  appId: "1:810199839185:web:42f13704bfa5318aaeb0f0"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Firestore ve Auth servislerini dışa aktar
export const db = getFirestore(app);
export const auth = getAuth(app);

// Emülatör bağlantısı için (Canlı ortama geçmek için yorum satırı yapıldı)
// if (window.location.hostname === 'localhost') {
//   connectAuthEmulator(auth, 'http://localhost:9099');
//   connectFirestoreEmulator(db, 'localhost', 8080);
// }
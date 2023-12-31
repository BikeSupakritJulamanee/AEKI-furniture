import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyAjwPYyykc1RQDhU8qBANOwyD0S5OyH0TY",
//   authDomain: "react-firebase-fb6cf.firebaseapp.com",
//   projectId: "react-firebase-fb6cf",
//   storageBucket: "react-firebase-fb6cf.appspot.com",
//   messagingSenderId: "538198369325",
//   appId: "1:538198369325:web:98e6e61c2b7bf5817844a4",
//   measurementId: "G-70V57NZTS5"
// };

// const firebaseConfig = {
//   apiKey: "AIzaSyDeIshX8DKCcUEX9a8RbuVEjgUghmvlVUQ",
//   authDomain: "web-project-7b5dc.firebaseapp.com",
//   projectId: "web-project-7b5dc",
//   storageBucket: "web-project-7b5dc.appspot.com",
//   messagingSenderId: "810531678544",
//   appId: "1:810531678544:web:ab650ecbdb07732cd02455",
//   measurementId: "G-TJ12839401"
// };

const firebaseConfig = {
  apiKey: "AIzaSyA7JlvilV5gJDR51h6wqICX2LwPW8hszhM",
  authDomain: "advance-conduit-329209.firebaseapp.com",
  projectId: "advance-conduit-329209",
  storageBucket: "advance-conduit-329209.appspot.com",
  messagingSenderId: "164287522710",
  appId: "1:164287522710:web:df10a0362da710aef3dfb7",
  measurementId: "G-4RDD4MV00M"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storageRef = getStorage(app);

export default app;
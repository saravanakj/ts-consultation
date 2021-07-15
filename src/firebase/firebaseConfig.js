import firebase from "firebase";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB_wY4nZ_yIkInxD8fO5DMBmVwtRVjk4z8",
    authDomain: "astrology-89684.firebaseapp.com",
    projectId: "astrology-89684",
    storageBucket: "astrology-89684.appspot.com",
    messagingSenderId: "591236882907",
    appId: "1:591236882907:web:41fbcd02cd92668e3707fe",
    measurementId: "G-YYM2NXQGT5"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig)

firebaseApp.firestore().settings({
  ignoreUndefinedProperties: true
})

export const db = firebaseApp.firestore()


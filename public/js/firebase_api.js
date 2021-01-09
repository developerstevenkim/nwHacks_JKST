// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyDlJNGRKicyybAMskoXqEzKWEFzA0elprA",
    authDomain: "donatetshirts.firebaseapp.com",
    projectId: "donatetshirts",
    storageBucket: "donatetshirts.appspot.com",
    messagingSenderId: "192056717961",
    appId: "1:192056717961:web:51c44b59dae93d25d84c58",
    measurementId: "G-SB1TCCN79C"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const db = firebase.firestore();
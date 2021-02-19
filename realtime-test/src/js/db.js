import * as env from './env.js'
// Your web app's Firebase configuration

var firebaseConfig = {
    apiKey: env.apiKEY,
    authDomain: env.authDomain,
    projectId: env.projectID,
    storageBucket: env.storageBucket,
    messagingSenderId: env.messagingSenderId,
    appId: env.appId
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.database();

function writeUserData(uid, name) {
    firebase.database().ref('users/' + uid).set({
        name: name
    });
}
writeUserData("12345", "test1")
let uid = "12345"
var starCountRef = firebase.database().ref('users/' + uid);
starCountRef.on('value', (snapshot) => {
  const data = snapshot.val();
  console.log(data)
});
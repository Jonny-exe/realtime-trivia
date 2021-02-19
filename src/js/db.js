import * as env from './env.js'
import * as index from './index.js'

var firebaseConfig = env.firebaseConfig
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.database()
const db_object = db.ref().child('object')
const db_room = db.ref().child('room/public')


let uid = Math.floor(Math.random() * 10000000)

db_object.on('value', (snapshot) => {
    const data = snapshot.val();
    db.ref("object/" + uid).onDisconnect().remove()
    console.log(data)
    index.setUsers(data);
});

db_room.get().then((snap) => {
    if (snap.exists()) {
        let data = snap.val()
        index.setWord(data["word"])
    } else {
        db_room.set({
            writer: uid,
            word: "Test"
        });
    }
})

db_room.on("value", (snap) => {
    const data = snap.val()
    index.setWord(data["word"])
})


export const addUser = (name) => {
    db.ref('object/' + uid).set({
        name: name,
        uid: uid
    });
}
// writeUserData("hello")
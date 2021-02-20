import * as env from './env.js'
import * as index from './index.js'
import * as req from './requests.js'

var firebaseConfig = env.firebaseConfig
firebase.initializeApp(firebaseConfig);

let questionCount

const db = firebase.database()
const db_users = db.ref().child('users')
const db_room = db.ref().child('room/public')
const db_lider = db.ref().child('room/public/lider')
const db_question_count = db.ref().child('room/public/question_count')
const db_questions = db.ref().child('room/public/questions')
const db_timer = db.ref().child('room/public/question_timer')


// export let uid = Math.floor(Math.random() * 10000000)

// TODO: SOmewhere the leader has to increase the question counter

db_question_count.on('value', async (snap) => {
    if (snap.exists()) {

        const data = snap.val()
        questionCount = data
        await db_questions.get().then(snap => {
            if (snap.exists()) {
                const questions = snap.val()
                index.setQuestion(questions[questionCount])
            }
        })
    } else {
        // TODO: maybe alert loading not sure yet
        index.handleAlert("show")
    }
})

db_users.on('value', (snap) => {
    if (!snap.exists()) {
        index.setUserCount(0)
        return
    }
    const data = snap.val()
    db.ref('users/' + index.user).onDisconnect().remove()
    index.setUsers(data)
    let userCount = Object.keys(data).length;

    index.setUserCount(userCount)
});


const setNewQuestions = async () => {
    let questions = await req.getNewQuestions()
    set('room/public/questions', questions)
    set('room/public/question_count', 0)
}


// TODO: somewhere do question_timer
db_room.on("value", async (snap) => {
    if (snap.exists()) {
        const data = snap.val()
        let isLeader = data[`lider`] == index.user
        if (!isLeader) {
            return
        }

        if (data['questions'] !== undefined) { // You have to do this like this becusae if questions is undefined you cant access length
            if (Object.keys(data['questions']).length <= data['questions_count']) {
                await setNewQuestions()
            }
        } else {
            await setNewQuestions()
        }
    }
})

db_lider.on("value", snap => {
    if (!snap.exists()) {
        db.ref('room/public/lider').set(index.user).onDisconnect().remove()

    }
})

export const set = (place, info) => {
    db.ref(place).set(info);
}



export const get = async (place) => {
    const data = await db.ref(place).get().then(snap => {
        return snap.val()
    })
    return data
}
// writeUserData("hello")
import * as env from './env.js'
import * as index from './index.js'
import * as req from './requests.js'

var firebaseConfig = env.firebaseConfig
firebase.initializeApp(firebaseConfig);

let questionCount
let notLeader = true

const db = firebase.database()
const db_users = db.ref().child('users')
const db_room = db.ref().child('room/public')
const db_leader = db.ref().child('room/public/leader')
const db_question_count = db.ref().child('room/public/question_count')
const db_questions = db.ref().child('room/public/questions')
const db_timer = db.ref().child('room/public/question_timer')

// TODO: Somewhere the leader has to increase the question counter


const setNewQuestions = async () => {
    let questions = await req.getNewQuestions()
    set('room/public/questions', questions)
    set('room/public/question_count', 0)
}

export const set = (place, info) => {
    db.ref(place).set(info);
}


export const get = async (place) => {
    const data = await db.ref(place).get().then(snap => {
        return snap.val()
    })
    return data
}

export const handleTimer = async () => {
    
    if (notLeader) return
    const dbPathTimer = "room/public/question_timer"
    const dbPathCount = "room/public/question_count"
    const currentTime = await get(dbPathTimer)
    if (currentTime === 0) {
        let questionCount = await get(dbPathCount)
        if (questionCount >= 9) {
            setNewQuestions()
        } else {
            questionCount = questionCount + 1
            console.log(questionCount)
            set(dbPathCount, questionCount)
            set(dbPathTimer, 15)
        }
        setTimeout(handleTimer, 5000)
        return
    }
    let newTime = currentTime == undefined ? 15 : currentTime - 5
    set(dbPathTimer, newTime)
    setTimeout(handleTimer, 5000)
    
}


export const startListening = () => {
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
            // index.handleAlert("hide")
        } else {
            // index.handleAlert("show")
            // TODO: maybe alert loading not sure yet
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


    // TODO: somewhere do question_timer
    db_room.on("value", async (snap) => {
        if (snap.exists()) {
            const data = snap.val()
            let isLeader = data[`leader`] == index.user
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

    db_leader.on("value", async snap => {
        if (!snap.exists()) {
            const dbPath = 'room/public/leader'
            db.ref(dbPath).set(index.user)
            db.ref(dbPath).onDisconnect().remove()
            notLeader = false
            handleTimer()
        } else {
            notLeader = !(snap.val() == index.user)
        }
    })
}

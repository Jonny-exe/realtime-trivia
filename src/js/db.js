import * as env from './env.js'
import * as index from './index.js'
import * as req from './requests.js'

firebase.initializeApp(env.firebaseConfig);


let questionCount
let notLeader = true

export let listeners

const setNewQuestions = async () => {
    let questions = await req.getNewQuestions()
    listeners.set(`room/${index.room}/questions`, questions)
    listeners.set(`room/${index.room}/question_count`, 0)
}

export const handleTimer = async () => {
    if (notLeader || listeners.stopTimer) return
    const dbPathTimer = `room/${index.room}/question_timer`
    const dbPathCount = `room/${index.room}/question_count`
    const currentTime = await listeners.get(dbPathTimer)
    if (currentTime === 0) {
        let questionCount = await listeners.get(dbPathCount)
        if (questionCount >= 9) {
            setNewQuestions()
        } else {
            questionCount++
            listeners.set(dbPathCount, questionCount)
            // THis is actually 15 secs because it counts 5 s after it's set to 0
            listeners.set(dbPathTimer, 10)
        }
        setTimeout(handleTimer, 5000)
        return
    }
    let newTime = currentTime == undefined ? 15 : currentTime - 5
    listeners.set(dbPathTimer, newTime)
    setTimeout(handleTimer, 5000)
}


class DbListeners {
    constructor(room = "public", firebase, user) {
        this.stopTimer = false
        this.user = user
        this.room = room

        this.db = firebase.database()

        this.db_users = this.db.ref().child(`users/${room}`)
        this.db_room = this.db.ref().child(`room/${room}`)
        this.db_leader = this.db.ref().child(`room/${room}/leader`)
        this.db_question_count = this.db.ref().child(`room/${room}/question_count`)
        this.db_questions = this.db.ref().child(`room/${room}/questions`)

        this.references = [this.db_users, this.db_room, this.db_leader, this.db_question_count, this.db_questions]

        this.startListening()
    }



    set = (place, info) => {
        this.db.ref(place).set(info);
    }

    get = async (place) => {
        const data = await this.db.ref(place).get().then(snap => {
            return snap.val()
        })
        return data
    }


    stopListening = () => {
        this.stopTimer = true
        this.db.ref(`users/${this.room}/${this.user}`).remove()

        
        if (this.isLeader) {
            this.db.ref(`room/${this.room}/leader`).remove()
        }

        for (let i = 0; i < this.references.length; i++) {
            this.references[i].off("value");
        }
    }

    startListening = () => {


        // this.set(`users/${newRoom}/${user}`, { streak: 0, best_streak: 0, total_points: 0 })
        this.db.ref(`users/${this.room}/${this.user}`).set({ streak: 0, best_streak: 0, total_points: 0, name: this.user })
        this.db.ref(`users/${this.room}/${this.user}`).onDisconnect().remove()

        this.db_question_count.on('value', async (snap) => {
            if (snap.exists()) {

                const data = snap.val()
                questionCount = data
                await this.db_questions.get().then(snap => {
                    if (snap.exists()) {
                        const questions = snap.val()
                        index.setQuestion(questions[questionCount], this.user, this.room)
                    }
                })
            }
        })

        this.db_users.on('value', (snap) => {
            if (!snap.exists()) {
                index.setUserCount(0)
                return
            }
            const data = snap.val()
            this.db.ref(`users/${this.room}/${this.user}`).onDisconnect().remove()
            index.setUsers(data)
            let userCount = Object.keys(data).length;

            index.setUserCount(userCount)
        });


        this.db_room.on("value", async (snap) => {
            if (snap.exists()) {
                const data = snap.val()
                this.isLeader = data[`leader`] == this.user
                if (!this.isLeader) {
                    return
                }
                // You have to do this like this becusae if questions is undefined you cant access length
                if (data?.questions !== undefined) {
                    if (Object.keys(data.questions).length <= data['questions_count']) {
                        await setNewQuestions()
                    }
                } else {
                    await setNewQuestions()
                }
            }
        })

        this.db_leader.on("value", async snap => {
            if (!snap.exists()) {
                const dbPath = `room/${index.room}/leader`
                this.db.ref(dbPath).set(this.user)
                this.db.ref(dbPath).onDisconnect().remove()
                notLeader = false
                handleTimer()
            } else {
                notLeader = !(snap.val() == this.user)
            }
        })
    }
}

export const startListening = (room, user) => {
    listeners = new DbListeners(room, firebase, user)
}
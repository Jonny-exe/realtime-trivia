import * as db from "./db.js"
import * as utils from "./utils.js"
console.log("Everything works")
let word = ""
export let user = ""

const $ = (query) => {
    return document.querySelector(query)
}

const addUser = () => {
    //TODO: make erorr on input == ""
    let username = $("input.addUser").value
    user = username
    $('div.addUser').style.display = "none"
    // db.listenOnRoom()
    db.set('users/' + username, { streak: 0, best_streak: 0 })
}

export const setUsers = (users) => {
    console.log("users", users)
    const usersTable = $("table.users")
    let usersHTML = ""

    for (let user in users) {
        console.log(user)
        usersHTML += `<tr><td>${users[user]["name"]}</td></tr>`
    }
    const baseHTML = '<thead><tr><td> Users </td></tr></thead>'
    usersTable.innerHTML = baseHTML + usersHTML
}

$("button.addUser").addEventListener("click", addUser)

export const handleAlert = (action) => {
    if (action == "show") {
        $("div.alertWrapper").style.display = "inherit"
    } else {
        $("div.alertWrapper").style.display = "none"
    }
}

export const setQuestion = (question) => {
    //TODO: style these
    let questionHTML = `<div class="question">${question['question']}</div>`
    let incorrectAnswers = question['incorrect_answers']
    let correctAnswer = question['correct_answer']
    let answers = []
    for (let i = 0; i < incorrectAnswers.length; i++) {
        answers[i] = incorrectAnswers[i]
    }
    answers.push(correctAnswer)

    utils.shuffle(answers)

    let answersHTML = ""
    for (let i = 0; i < answers.length; i++) {
        answersHTML += `<div class="answer">${answers[i]}</div>`
    }

    const finalHTML = questionHTML + answersHTML
    $('div.questions').innerHTML = finalHTML
    const setQuestionsEventListeners = (correctAnswer) => {
        const answers = document.querySelectorAll('.answer')
        for (let i = 0; i < answers.length; i++) {
            if (answers[i].innerHTML == correctAnswer) {
                answers[i].addEventListener('click', () => handleAnswer(true))
            } else {
                answers[i].addEventListener('click', () => handleAnswer(false))
            }
        }
    }
    setQuestionsEventListeners(correctAnswer)
}

const handleAnswer = async (isCorrect) => {
    debugger
    const dbPath = `users/${user}`
    let streakInfo = await db.get(dbPath)
    let streak = streakInfo.streak
    let best_streak = streakInfo.best_streak

    if (isCorrect) {
        streak++
        if (streak >= best_streak) {
            best_streak = streak
        }
    } else {
        streak = 0
        best_streak = streakInfo.best_streak
    }

    db.set(dbPath, {
        streak: streak,
        best_streak: best_streak
    })
    // debugger-
}

export const setUserCount = (userCount) => {
    $("#usercount").innerHTML = `User amount: ${userCount}`
}


